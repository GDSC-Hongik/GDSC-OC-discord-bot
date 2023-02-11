import { Events, Listener } from "@sapphire/framework"
import { Message } from "discord.js"

import { updateAttendance } from "../lib/devRating"

export class MessageCreateListener extends Listener<
	typeof Events.MessageCreate
> {
	public async run(message: Message) {
		updateAttendance(message.author.id, message.id)
	}
}
