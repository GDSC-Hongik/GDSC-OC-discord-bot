import type { Message } from "discord.js"

import { createPost, getUser, setUser, snowflake2UID } from "../firebase"

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

	if (createPostResult.success) {
		user.posts.push(createPostResult.postID)
		await setUser(uid, user)
		return
	}

	logError(uid, "Failed to add post to DB")
}

function logError(user: string, reason: string): void {
	console.error(`Failed to add post to user "${user}". ${reason}.`)
}
