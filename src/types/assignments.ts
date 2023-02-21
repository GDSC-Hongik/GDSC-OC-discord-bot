import { z } from "zod"

export const assignmentSchema = z.object({
	name: z.string(),

	repository: z.string(),

	filePath: z.string(),

	closed: z.boolean(),
})

export type Assignment = z.infer<typeof assignmentSchema>

export const defaultAssignment: Assignment = {
	name: "",
	repository: "",
	filePath: "",
	closed: true,
}
