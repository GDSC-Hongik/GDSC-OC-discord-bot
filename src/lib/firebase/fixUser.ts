import { defaultUser } from "../../types/user"
import { refs } from "."

/**
 * Fix user database to fit schema
 */
export default async function (uid: string) {
	const userDocRef = refs.users.doc(uid)
	const userDoc = await userDocRef.get()

	// user data
	const data = userDoc.data()

	if (!data)
		throw Error(`Failed to fix "/users/${uid}". Failed to backup data.`)

	// create required fields
	await userDocRef.set(defaultUser, { merge: true })

	// restore data
	await userDocRef.set(data, { merge: true })
}
