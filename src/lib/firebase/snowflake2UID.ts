import { botCache } from "."

/**
 * Fetch a firebase user's UID associated with the given discord snowflake
 */
export default function (discordSnowflake: string): string | undefined {
	return botCache.data.snowflake2uid[discordSnowflake]
}
