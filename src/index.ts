import { SapphireClient } from "@sapphire/framework"
import { GatewayIntentBits } from "discord.js"
import dotenv from "dotenv"

import { initializeFirebase } from "./lib/firebase"

dotenv.config()
initializeFirebase()

const client = new SapphireClient({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

client.login(process.env.DISCORD_BOT_TOKEN)
