import { Activities } from "../../types/activities"
import type { Post } from "../../types/post"
import { botCache, getUser, setUser, updatePost } from "../firebase"

export default async function ({
	postID,
	post,
	uid,
}: {
	postID: string
	post: Post
	uid: string
}) {
	const user = await getUser(uid)
	if (!user) return
	user.points -= botCache.data.activityPoints[Activities.POST_LIKE_RECEIVE]
	setUser(uid, user)

	post.likes -= 1
	updatePost(postID, post)
}
