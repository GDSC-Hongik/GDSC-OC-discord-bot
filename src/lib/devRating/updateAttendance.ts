import moment from "moment-timezone"

import { Achievements } from "../../types/achievements"
import { getUser, setUser, snowflake2UID } from "../firebase"
import snowflake2Time from "../snowflake2Time"

export default async function (
	userSnowflake: string,
	messageSnowflake: string
): Promise<{ success: boolean }> {
	const uid = snowflake2UID(userSnowflake)
	if (!uid) {
		printError(userSnowflake, "Unregistered user")
		return { success: false }
	}

	const user = await getUser(uid)
	if (!user) {
		printError(userSnowflake, "Failed to get user data")
		return { success: false }
	}

	const messageCreateTime = snowflake2Time(messageSnowflake)
	const YYYYMMDD = formatDate(messageCreateTime)

	const latestYYYYMMDD = user.attendance.at(-1)

	// attendance is already marked
	if (latestYYYYMMDD === YYYYMMDD) return { success: true }

	// update user attendance
	user.attendance.push(YYYYMMDD)

	// update achievements
	const achievementSet = new Set(user.achievements)
	const totalDaysAttended = user.attendance.length
	if (totalDaysAttended >= 1) achievementSet.add(Achievements.ATTENDANCE_1)
	if (totalDaysAttended >= 10) achievementSet.add(Achievements.ATTENDANCE_10)
	if (totalDaysAttended >= 30) achievementSet.add(Achievements.ATTENDANCE_30)
	if (totalDaysAttended >= 50) achievementSet.add(Achievements.ATTENDANCE_50)
	if (totalDaysAttended >= 100) achievementSet.add(Achievements.ATTENDANCE_100)
	if (totalDaysAttended >= 300) achievementSet.add(Achievements.ATTENDANCE_300)

	user.achievements = Array.from(achievementSet)

	// write to DB
	setUser(uid, user)

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
