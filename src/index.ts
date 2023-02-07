import { GatewayIntentBits } from "discord.js"
import dotenv from "dotenv"

import Client from "./lib/client"

dotenv.config()

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

client.login(process.env.DISCORD_BOT_TOKEN)
