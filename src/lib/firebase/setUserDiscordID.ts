import { cache, refs } from "."

/**
 * Associates discord ID with a firebase account UID
 */
export default async function setUserDiscordID(
	firebaseUID: string,
	discordSnowflake: string
) {
	refs.discordIDs.set({ [discordSnowflake]: firebaseUID }, { merge: true })
	cache.data.discordIDs = await refs.discordIDs.get()
}
