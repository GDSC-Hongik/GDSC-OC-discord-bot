import { DocumentSnapshot } from "firebase-admin/firestore"

import { defaultUser, User } from "../../types/user"
import { auth, cache, refs } from "."
import cacheUser from "./cacheUser"

export default async function (
	uid: string,
	forceUpdate = false
): Promise<DocumentSnapshot<User> | undefined> {
	// return cached data if it exists

	if (cache.users[uid] && forceUpdate) return cache.users[uid]

	// fetch user data from firestore

	const userDataRef = refs.users.doc(uid)
	const userDoc = await userDataRef.get()

	// return user data if it exists

	if (userDoc.exists) return cacheUser(uid, userDoc)

	// check if user account exists
	try {
		await auth.getUser(uid)
	} catch {
		return undefined
	}

	// create new user
	await userDataRef.create(defaultUser)
	return cacheUser(uid, await userDataRef.get())
}
