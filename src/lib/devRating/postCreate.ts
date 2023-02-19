import type { Message } from "discord.js"

import { Activities } from "../../types/activities"
import { User } from "../../types/user"
import {
	botCache,
	createPost,
	getUser,
	setUser,
	snowflake2UID,
} from "../firebase"

export default async function (message: Message): Promise<void> {
	const uid = snowflake2UID(message.author.id)
	if (!uid) return logError(message.author.id, "User is not registered")

	const user = await getUser(uid)
	if (!user) return logError(uid, "Failed to get user data")

	const createPostResult = await createPost({
		author: uid,
		discord: true,
		likes: 0,
		discordLink: message.channel.url,
	})

	if (!createPostResult.success)
		return logError(uid, "Failed to add post to DB")

	await updateUser(createPostResult.postID, uid, user)
}

async function updateUser(postID: string, uid: string, user: User) {
	user.posts.push(postID)
	user.points += botCache.data.activityPoints[Activities.POST_CREATE]
	await setUser(uid, user)
}

function logError(user: string, reason: string): void {
	console.error(`Failed to add post to user "${user}". ${reason}.`)
}
