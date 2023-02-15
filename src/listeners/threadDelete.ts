import type { Events } from "@sapphire/framework"
import { Listener } from "@sapphire/framework"
import type { ThreadChannel } from "discord.js"

import { DevRatingEvent, devRatingEvent } from "../lib/devRating"

export class ThreadDeleteListener extends Listener<typeof Events.ThreadDelete> {
	public async run(thread: ThreadChannel) {
		await devRatingEvent({
			type: DevRatingEvent.POST_DELETE,
			data: [thread],
		})
	}
}
