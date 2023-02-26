import { z } from "zod"

import { achievementsSchema } from "./achievements"

export const userSchema = z.object({
	achievements: z.array(achievementsSchema),

	// array of "YYYY/MM/DD" formatted string (time zone: KST)
	attendance: z.array(z.string().regex(/\d\d\d\d[/]\d\d[/]\d\d/)),

	discordID: z.string().regex(/\d+/),

	// total spendable points. Integer. Can be negative.
	points: z.number().int(),

	// array of post IDs
	posts: z.array(z.string().regex(/[a-zA-Z0-9]+/)),

	// array of discord role IDs
	roles: z.array(z.string().regex(/\d+/)),
})

export type User = z.infer<typeof userSchema>

export const defaultUser: User = {
	achievements: [],
	attendance: [],
	discordID: "0000000000000000000",
	points: 0,
	posts: [],
	roles: [],
}
