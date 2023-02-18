import { Events, Listener } from "@sapphire/framework"
import { ChannelType, MessageReaction, User } from "discord.js"

import { DevRatingEvent, devRatingEvent } from "../lib/devRating"
import { snowflake2UID } from "../lib/firebase"
import { getPost } from "../lib/firebase/posts"

export class MessageReactionRemoveListener extends Listener<
	typeof Events.MessageReactionRemove
> {
	public async run(messageReaction: MessageReaction, user: User) {
		await handlePostLikeRemove(messageReaction, user)
	}
}

async function handlePostLikeRemove(
	messageReaction: MessageReaction,
	user: User
) {
	if (messageReaction.emoji.name !== "👍") return

	const message = await messageReaction.message.fetch()
	if (message.channel.type !== ChannelType.PublicThread) return

	const uid = snowflake2UID(user.id)
	if (!uid) return

	const getPostResult = await getPost(message.channel.url)
	if (!getPostResult.success) return

	devRatingEvent({
		type: DevRatingEvent.POST_LIKE_REMOVE,
		data: [
			{
				post: getPostResult.data.post,
				postID: getPostResult.data.postID,
				uid,
			},
		],
	})
}
