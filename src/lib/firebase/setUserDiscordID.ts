import { botCache, refs } from "."

/**
 * Associates discord ID with a firebase account UID
 */
export default async function setUserDiscordID(
	firebaseUID: string,
	discordSnowflake: string
) {
	refs.snowflake2uid.set({ [discordSnowflake]: firebaseUID }, { merge: true })
	botCache.data.snowflake2uid[discordSnowflake] = firebaseUID
}
