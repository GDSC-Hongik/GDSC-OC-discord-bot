import { z } from "zod"

export const postSchema = z.object({
	// whether the post is from discord or not
	discord: z.boolean(),

	// The firebase auth UID
	author: z.string(),

	// link to the post on discord
	discordLink: z.string().optional(),

	// number of likes of the post
	likes: z.number().int(),
})

export type Post = z.infer<typeof postSchema>
