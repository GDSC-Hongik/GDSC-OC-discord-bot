import {
	Assignment,
	assignmentSchema,
	defaultAssignment,
} from "../../types/assignments"
import nanoid from "../nanoid"
import { botCache, fixSchema, refs } from "."

export async function getAssignment(
	id: string
): Promise<Assignment | undefined> {
	if (botCache.assignments[id]) return botCache.assignments[id]

	const docRef = refs.assignments.doc(id)
	const parseResult = assignmentSchema.safeParse((await docRef.get()).data())
	if (parseResult.success) return (botCache.assignments[id] = parseResult.data)

	console.error(`Failed to get assignment "${id}". Data is invalid.`)
	await fixSchema(docRef, defaultAssignment)

	return undefined
}

export async function setAssignment(
	data: Assignment,
	_id?: string
): Promise<Assignment> {
	const id = _id ? _id : nanoid()

	botCache.assignments[id] = {
		...botCache.assignments[id],
		...data,
	}

	await refs.assignments.doc(id).set(botCache.assignments[id], { merge: true })

	return botCache.assignments[id]
}