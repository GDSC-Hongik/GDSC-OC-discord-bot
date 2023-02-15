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

export const achievementsSchema = z.nativeEnum(Achievements)
