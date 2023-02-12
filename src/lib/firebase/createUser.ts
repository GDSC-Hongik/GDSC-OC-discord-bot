import type { DocumentSnapshot } from "firebase-admin/firestore"

import type { User } from "../../types/user"
import { defaultUser } from "../../types/user"
import { auth, refs } from "."
import cacheUser from "./cacheUser"

export enum CreateUserFailReason {
	USER_NOT_IN_AUTH,
	USER_ALREADY_EXISTS,
}

export default async function (
	uid: string
): Promise<
	| { success: true; data: DocumentSnapshot<User> }
	| { success: false; reason: CreateUserFailReason }
> {
	// check if user exists in firebase auth
	try {
		if (uid !== "nobody") await auth.getUser(uid)
	} catch {
		console.error(
			`Failed create user "${uid}" int firestore. User does not exist in firebase auth.`
		)

		return { success: false, reason: CreateUserFailReason.USER_NOT_IN_AUTH }
	}

	const userDoc = refs.users.doc(uid)

	// check if user already exists
	if ((await userDoc.get()).exists) {
		console.error(
			`Failed to create user "${uid}" in firestore. User already exists.`
		)

		return { success: false, reason: CreateUserFailReason.USER_ALREADY_EXISTS }
	}

	// create, cache, and return user document
	userDoc.set(defaultUser, { merge: true })
	return {
		success: true,
		data: await cacheUser(uid, await userDoc.get()),
	}
}
