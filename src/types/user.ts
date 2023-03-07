import { z } from "zod"

import { achievementsSchema } from "./achievements"

export const gdscUserSchema = z.object({
	achievements: z.array(achievementsSchema),

	// array of "YYYY/MM/DD" formatted string (time zone: KST)
	attendance: z.array(z.string().regex(/\d\d\d\d[/]\d\d[/]\d\d/)),

	discordID: z.string().regex(/\d+/),

	// total spendable points. Integer. Can be negative.
	points: z.number().int(),

	// array of discord role IDs
	roles: z.array(z.string().regex(/\d+/)),

	// map of upvoted URL to emojis
	upvotesGiven: z.record(z.string()),
})

export type GDSCUser = z.infer<typeof gdscUserSchema>

export const defaultGDSCUser: GDSCUser = {
	achievements: [],
	attendance: [],
	discordID: "0000000000000000000",
	points: 0,
	roles: [],
	upvotesGiven: {},
}
