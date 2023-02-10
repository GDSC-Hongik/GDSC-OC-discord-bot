import { cache, refs } from "."

/**
 * Fetch a firebase user's UID associated with the given discord snowflake
 */
export default async function (
	discordSnowflake: string
): Promise<string | undefined> {
	const cachedData = cache.data.discordIDs.data()
	if (cachedData) return cachedData[discordSnowflake]

	cache.data.discordIDs = await refs.discordIDs.get()
	const newCachedData = cache.data.discordIDs.data()
	if (newCachedData) return newCachedData[discordSnowflake]

	return undefined
}
