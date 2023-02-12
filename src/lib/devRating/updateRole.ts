import type { Collection, Role } from "discord.js"
import { userMention } from "discord.js"

import { fetchUserDocument, setUserData, snowflake2UID } from "../firebase"

export default async function (
	discordUserID: string,
	rolesCollection: Collection<string, Role>
) {
	const uid = await snowflake2UID(discordUserID)
	if (!uid) return logError(discordUserID, "Unregistered user")

	// get all role ids except for "@everyone"
	// tracking all roles in case a role gets points assigned in the future
	const roles: string[] = []
	rolesCollection.map((role) => {
		if (role.name === "@everyone") return
		roles.push(role.id)
	})

	const userDoc = await fetchUserDocument(uid)
	if (!userDoc) return logError(discordUserID, "Failed to fetch user document")

	const userData = userDoc.data()
	if (!userData) return logError(discordUserID, "Failed to fetch user data")

	userData.roles = roles

	setUserData(uid, userData)
}

function logError(discordUserID: string, reason: string): void {
	console.error(
		`Failed to update role of discord user "${userMention(
			discordUserID
		)}". ${reason}.`
	)
}
