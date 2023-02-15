import type { ThreadChannel } from "discord.js"

import type { Post } from "../../types/post"
import { deletePost, getUser, refs, setUser } from "../firebase"

export default async function (thread: ThreadChannel): Promise<void> {
	const post = await refs.posts.where("discordLink", "==", thread.url).get()
	post.docs.forEach(async (postDoc) => {
		const postID = postDoc.id
		const postData = postDoc.data() as Post

		// remove post from user
		const user = await getUser(postData.author)
		if (user) {
			user.posts = user.posts.filter((userPostID) => userPostID !== postID)
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
