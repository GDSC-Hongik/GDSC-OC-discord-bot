import moment from "moment-timezone"

import {
	fetchDiscordUserUID,
	fetchUserDocument,
	setUserData,
} from "../firebase"
import snowflake2Time from "../snowflake2Time"

export default async function (
	userSnowflake: string,
	messageSnowflake: string
): Promise<{ success: boolean }> {
	const uid = await fetchDiscordUserUID(userSnowflake)
	if (!uid) {
		printError(userSnowflake, "Unregistered user")
		return { success: false }
	}

	const userDoc = await fetchUserDocument(uid)
	if (!userDoc) {
		printError(userSnowflake, "Failed to fetch user document")
		return { success: false }
	}

	const messageCreateTime = snowflake2Time(messageSnowflake)
	const YYYYMMDD = formatDate(messageCreateTime)

	const userData = userDoc.data()
	if (!userData) {
		printError(userSnowflake, "Failed to fetch user data")
		return { success: false }
	}

	const latestYYYYMMDD = userData.attendance.at(-1)

	// attendance is already marked
	if (latestYYYYMMDD === YYYYMMDD) return { success: true }

	// update user attendance
	setUserData(uid, userData)
	userData.attendance.push(YYYYMMDD)

	return { success: true }
}

/**
 * Converts a date object to a `YYYY/MM/DD` formatted string in KST time zone
 */
function formatDate(date: Date): string {
	return moment(date).tz("Asia/Seoul").format("YYYY/MM/DD")
}

function printError(discordUserSnowflake: string, reason: string) {
	console.error(
		`Failed to update attendance of discord user "${discordUserSnowflake}". ${reason}.`
	)
}
