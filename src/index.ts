import { SapphireClient } from "@sapphire/framework"
import dotenv from "dotenv"

dotenv.config()

const client = new SapphireClient({ intents: ["GUILDS", "GUILD_MESSAGES"] })

client.login(process.env.DISCORD_BOT_TOKEN)
