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
		// slash command 사용은 출석 처리 X
		if (!message.author.bot && !message.author.system)
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
