import { Events, Listener } from "@sapphire/framework"
import type { MessageReaction, User } from "discord.js"
import { ChannelType } from "discord.js"

import { DevRatingEvent, devRatingEvent } from "../lib/devRating"
import { snowflake2UID } from "../lib/firebase"
import { getPost } from "../lib/firebase/posts"

export class MessageReactionAddListener extends Listener<
	typeof Events.MessageReactionAdd
> {
	public async run(messageReaction: MessageReaction, user: User) {
		await handlePostLikeAdd(messageReaction, user)
	}
}

async function handlePostLikeAdd(messageReaction: MessageReaction, user: User) {
	if (messageReaction.emoji.name !== "👍") return

	const message = await messageReaction.message.fetch()
	if (message.channel.type !== ChannelType.PublicThread) return

	const uid = snowflake2UID(user.id)
	if (!uid) return

	const getPostResult = await getPost(message.channel.url)
	if (!getPostResult.success) return

	await devRatingEvent({
		type: DevRatingEvent.POST_LIKE_ADD,
		data: [
			{
				post: getPostResult.data.post,
				postID: getPostResult.data.postID,
				uid,
			},
		],
	})
}
