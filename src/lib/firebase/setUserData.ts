import { User } from "../../types/user"
import { fetchUserDocument } from "."

export default async function (uid: string, data: User) {
	const userDoc = await fetchUserDocument(uid)

	if (!userDoc) {
		console.error(
			`Failed to update user data of "${uid}". Failed to get user document.`
		)
		return undefined
	}

	if (!userDoc.exists) {
		console.error(
			`Failed to update user data of "${uid}". Document does not exist.`
		)
		return undefined
	}

	userDoc.ref.set(data, { merge: true })
}
