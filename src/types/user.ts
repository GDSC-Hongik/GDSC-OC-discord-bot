import { z } from "zod"

import { tierSchema } from "./tier"

export const userSchema = z.object({
	tier: tierSchema,
	devRating: z.number(),
	points: z.number(),
})

export type User = z.infer<typeof userSchema>

export const defaultUser: User = {
	tier: tierSchema.enum.UNRANKED,
	devRating: 0,
	points: 0,
}
