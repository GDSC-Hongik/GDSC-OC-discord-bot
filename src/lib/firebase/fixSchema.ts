import type {
	DocumentData,
	DocumentReference,
	PartialWithFieldValue,
} from "firebase-admin/firestore"

/**
 * Fix user database to fit schema. Can not remove or rename fields yet.
 */
export default async function (
	docRef: DocumentReference,
	defaultData: PartialWithFieldValue<DocumentData>
): Promise<{ success: boolean }> {
	const doc = await docRef.get()
	if (!doc) {
		console.error(
			`Failed to fix schema of "${docRef.path}". Failed to get document.`
		)
		return { success: false }
	}

	const data = doc.data()
	if (!data) {
		console.error(
			`Failed to fix schema of "${docRef.path}". Failed to fetch data.`
		)
		return { success: false }
	}

	// create required fields
	await docRef.set(defaultData, { merge: true })

	// restore data
	await docRef.set(data, { merge: true })

	return { success: true }
}
