import { z } from "zod"

export const tierSchema = z.enum(["UNRANKED"])

export type Tier = z.infer<typeof tierSchema>

export const defaultTier = tierSchema.enum.UNRANKED
