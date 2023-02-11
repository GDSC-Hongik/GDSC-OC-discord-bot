import type { DocumentData, DocumentSnapshot } from "firebase-admin/firestore"

import type { User } from "../../types/user"
import { userSchema } from "../../types/user"
import { cache, refs } from "."
import fixUser from "./fixUser"

export default async function (
	uid: string,
	userDoc: DocumentSnapshot<DocumentData>
): Promise<DocumentSnapshot<User>> {
	const parseResult = userSchema.safeParse(userDoc.data())

	if (parseResult.success)
		return (cache.users[uid] = userDoc as DocumentSnapshot<User>)

	// if the user data does not pass the schema test

	console.error(
		`Fixing invalid user data format at "/users/${uid}": ${JSON.stringify(
			parseResult.error.issues,
			null,
			2
		)}`
	)

	fixUser(uid)

	return (await refs.users.doc(uid).get()) as DocumentSnapshot<User>
}
