import { z } from "zod"

import { tierSchema } from "./tier"

export const userSchema = z.object({
	// user's tier based on their devRating
	tier: tierSchema,

	// total spendable points. Integer. Can be negative.
	points: z.number().int(),

	// array of "YYYY/MM/DD" formatted string (time zone: KST)
	attendance: z.array(z.string().regex(/\d\d\d\d[/]\d\d[/]\d\d/)),

	// array of discord role IDs
	roles: z.array(z.string().regex(/\d+/)),
})

export type User = z.infer<typeof userSchema>

export const defaultUser: User = {
	tier: tierSchema.enum.UNRANKED,
	points: 0,
	attendance: [],
	roles: [],
}
