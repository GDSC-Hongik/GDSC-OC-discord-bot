import type { ThreadChannel } from "discord.js"

import { Activities } from "../../types/activities"
import type { Post } from "../../types/post"
import { botCache, deletePost, getUser, refs, setUser } from "../firebase"

export default async function (thread: ThreadChannel): Promise<void> {
	const post = await refs.posts.where("discordLink", "==", thread.url).get()
	post.docs.forEach(async (postDoc) => {
		const postID = postDoc.id
		const postData = postDoc.data() as Post

		const user = await getUser(postData.author)
		if (user) {
			// remove post from post author
			user.posts = user.posts.filter((userPostID) => userPostID !== postID)

			// remove points from post author
			user.points -= botCache.data.activityPoints[Activities.POST_CREATE]

			setUser(postData.author, user)
		}

		// remove post itself
		const postDeleteResult = await deletePost(postID)
		if (!postDeleteResult.success) logError(postData.author)
	})
}

function logError(user: string): void {
	console.error(`Failed to delete post of user "${user}".`)
}
