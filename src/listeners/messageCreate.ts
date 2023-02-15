import type { Events } from "@sapphire/framework"
import { Listener } from "@sapphire/framework"
import type { Message } from "discord.js"
import { ChannelType } from "discord.js"

import { DevRatingEvent, devRatingEvent } from "../lib/devRating"
import { botCache } from "../lib/firebase"

export class MessageCreateListener extends Listener<
	typeof Events.MessageCreate
> {
	public async run(message: Message) {
		if (!message.author.bot)
			await devRatingEvent({
				type: DevRatingEvent.UPDATE_ATTENDANCE,
				data: [message.author.id, message.id],
			})

		if (
			// if channel is a thread
			message.channel.type === ChannelType.PublicThread &&
			// and thread parent exists
			message.channel.parent &&
			// and parent channel is a registered info sharing channel
			botCache.data.channels.infoSharing.includes(message.channel.parent.id)
		)
			await devRatingEvent({
				type: DevRatingEvent.POST_CREATE,
				data: [message],
			})
	}
}
