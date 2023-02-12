import { cache, refs } from "."

/**
 * Fetch a firebase user's UID associated with the given discord snowflake
 */
export default async function (
	discordSnowflake: string
): Promise<string | undefined> {
	const cachedData = cache.data.snowflake2uid.data()
	if (cachedData) return cachedData[discordSnowflake]

	cache.data.snowflake2uid = await refs.snowflake2uid.get()
	const newCachedData = cache.data.snowflake2uid.data()
	if (newCachedData) return newCachedData[discordSnowflake]

	return undefined
}
