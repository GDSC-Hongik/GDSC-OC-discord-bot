import { DocumentSnapshot } from "firebase-admin/firestore"

import { User } from "../../types/user"
import { botCache, refs } from "."
import cacheUser from "./cacheUser"

export default async function (
	uid: string,
	forceUpdate = false
): Promise<DocumentSnapshot<User> | undefined> {
	// return cached data if it exists
	if (!forceUpdate && botCache.users[uid]) return botCache.users[uid]

	// fetch user data from firestore
	const userDoc = await refs.users.doc(uid).get()

	// return user data if it exists
	if (userDoc.exists) return await cacheUser(uid, userDoc)

	// return undefined if the user does not exist in the DB
	return undefined
}
