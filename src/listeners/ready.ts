import { Events, Listener } from "@sapphire/framework"
import type { Client } from "discord.js"

export class ReadyListener extends Listener<typeof Events.ClientReady> {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: true,
			event: Events.ClientReady,
		})
	}

	public async run(client: Client) {
		this.container.logger.info(`${client?.user?.tag} 준비 완료!`)
	}
}
