import { botCache, refs } from "."

/**
 * Fetch a firebase user's UID associated with the given discord snowflake
 */
export default async function (
	discordSnowflake: string
): Promise<string | undefined> {
	const cachedData = botCache.data.snowflake2uid.data()
	if (cachedData) return cachedData[discordSnowflake]

	botCache.data.snowflake2uid = await refs.snowflake2uid.get()
	const newCachedData = botCache.data.snowflake2uid.data()
	if (newCachedData) return newCachedData[discordSnowflake]

	return undefined
}
