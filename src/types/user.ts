import { z } from "zod"

import { achievementsSchema } from "./Achievements"

export const userSchema = z.object({
	// total spendable points. Integer. Can be negative.
	points: z.number().int(),

	// array of "YYYY/MM/DD" formatted string (time zone: KST)
	attendance: z.array(z.string().regex(/\d\d\d\d[/]\d\d[/]\d\d/)),

	// array of discord role IDs
	roles: z.array(z.string().regex(/\d+/)),

	// array of post IDs
	posts: z.array(z.string().regex(/[a-zA-Z0-9]+/)),

	achievements: z.array(achievementsSchema),
})

export type User = z.infer<typeof userSchema>

export const defaultUser: User = {
	points: 0,
	attendance: [],
	roles: [],
	posts: [],
	achievements: [],
}
