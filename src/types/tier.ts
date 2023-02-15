import { z } from "zod"

export const tierSchema = z.enum(["UNRANKED", "I", "II", "III", "IV", "V"])

export type Tier = z.infer<typeof tierSchema>

export const defaultTier = tierSchema.enum.UNRANKED
