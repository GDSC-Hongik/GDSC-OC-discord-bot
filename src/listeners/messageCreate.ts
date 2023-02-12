import { Events, Listener } from "@sapphire/framework"
import { Message } from "discord.js"

import { devRatingEvent } from "../lib/devRating"
import DevRatingEvent from "../types/devRatingEvent"

export class MessageCreateListener extends Listener<
	typeof Events.MessageCreate
> {
	public async run(message: Message) {
		if (!message.author.bot)
			devRatingEvent({
				type: DevRatingEvent.UPDATE_ATTENDANCE,
				data: [message.author.id, message.id],
			})
	}
}
