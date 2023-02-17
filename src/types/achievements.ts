import { z } from "zod"

// nanoID generated using https://zelark.github.io/nano-id-cc/
export enum Achievements {
	ATTENDANCE_1 = "nbZNJBk1",
	ATTENDANCE_10 = "o3jsK6Os",
	ATTENDANCE_30 = "QBB4SAoz",
	ATTENDANCE_50 = "vz83EI8Q",
	ATTENDANCE_100 = "U1sPZjUy",
	ATTENDANCE_300 = "nPSUDwAf",
}

export const AchievementNames: { [key in Achievements]: string } = {
	[Achievements.ATTENDANCE_1]: "1일 출석",
	[Achievements.ATTENDANCE_10]: "10일 출석",
	[Achievements.ATTENDANCE_30]: "30일 출석",
	[Achievements.ATTENDANCE_50]: "50일 출석",
	[Achievements.ATTENDANCE_100]: "100일 출석",
	[Achievements.ATTENDANCE_300]: "300일 출석",
}

export const achievementsSchema = z.nativeEnum(Achievements)
