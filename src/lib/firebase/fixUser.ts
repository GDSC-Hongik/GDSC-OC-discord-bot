import { defaultUser } from "../../types/user"
import { fetchUserDocument } from "."

/**
 * Fix user database to fit schema. Can not remove or rename fields yet.
 */
export default async function (uid: string): Promise<{ success: boolean }> {
	// fetch document
	const userDoc = await fetchUserDocument(uid)
	if (!userDoc) {
		console.error(`Failed to fix user "${uid}". Failed to fetch document.`)
		return { success: false }
	}

	// get user data
	const data = userDoc.data()
	if (!data) {
		console.error(`Failed to fix user "${uid}". Failed to backup data.`)
		return { success: false }
	}

	// create required fields
	await userDoc.ref.set(defaultUser, { merge: true })

	// restore data
	await userDoc.ref.set(data, { merge: true })

	return { success: true }
}
