import { Activities } from "../../types/activities"
import type { Post } from "../../types/post"
import { botCache, getUser, setUser, updatePost } from "../firebase"

/**
 * @param data.postID - The ID of the post the reaction got removed from
 * @param data.post - The {@link Post} the reaction was removed from
 * @param data.uid - Firebase auth UID of the user who added the reaction
 */
export default async function ({
	postID,
	post,
	uid,
}: {
	postID: string
	post: Post
	uid: string
}) {
	// remove points from the user who added the reaction
	{
		const user = await getUser(uid)
		if (!user) return
		user.points -= botCache.data.activityPoints[Activities.POST_LIKE_ADD]
		setUser(uid, user)
	}

	// remove points from the owner of the post
	{
		const user = await getUser(post.author)
		if (!user) return
		user.points -= botCache.data.activityPoints[Activities.POST_LIKE_RECEIVE]
		setUser(uid, user)
	}

	// remove likes from the post
	post.likes -= 1
	updatePost(postID, post)
}
