import type { User } from "../../types/user"
import { defaultUser, userSchema } from "../../types/user"
import { auth, botCache, refs } from "."

export enum CreateUserFailReason {
	USER_NOT_IN_AUTH,
	USER_ALREADY_EXISTS,
}

export async function createUser(
	uid: string
): Promise<
	| { success: true; user: User }
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

	const userDocRef = refs.users.doc(uid)

	// check if user already exists
	if ((await userDocRef.get()).exists) {
		console.error(
			`Failed to create user "${uid}" in firestore. User already exists.`
		)

		return { success: false, reason: CreateUserFailReason.USER_ALREADY_EXISTS }
	}

	// create, cache, and return user document
	userDocRef.set(defaultUser, { merge: true })
	return {
		success: true,
		user: (await cacheUser(uid, defaultUser)) || defaultUser,
	}
}

/**
 * Fix user database to fit schema. Can not remove or rename fields yet.
 */
export async function fixUser(uid: string): Promise<{ success: boolean }> {
	const userDocRef = refs.users.doc(uid)
	const userDoc = await userDocRef.get()
	if (!userDoc) {
		console.error(`Failed to fix user "${uid}". Failed to fetch user document.`)
		return { success: false }
	}

	const userData = userDoc.data()
	if (!userData) {
		console.error(`Failed to fix user "${uid}". Failed to fetch user data.`)
		return { success: false }
	}

	// create required fields
	await userDocRef.set(defaultUser, { merge: true })

	// restore data
	await userDocRef.set(userData, { merge: true })

	return { success: true }
}

async function cacheUser(uid: string, user: User): Promise<User | undefined> {
	const parseResult = userSchema.safeParse(user)

	if (parseResult.success) return (botCache.users[uid] = parseResult.data)

	console.error(
		`Fixing invalid user data format at "/users/${uid}": ${JSON.stringify(
			parseResult.error.issues,
			null,
			2
		)}`
	)

	const fixResult = await fixUser(uid)
	if (fixResult.success) {
		const fixedUser = (await refs.users.doc(uid).get()).data()
		return (botCache.users[uid] = fixedUser as User)
	}

	return undefined
}

export async function getUser(uid: string): Promise<User | undefined> {
	// return cached data if it exists
	if (botCache.users[uid]) return botCache.users[uid]

	// fetch user document from firestore
	const userDoc = await refs.users.doc(uid).get()

	// return user data if it exists
	if (userDoc.exists) return await cacheUser(uid, userDoc.data() as User)

	// return undefined if the user does not exist in the DB
	return undefined
}

export async function setUser(uid: string, data: User): Promise<void> {
	// fetch user document from firestore
	const userDoc = await refs.users.doc(uid).get()

	if (!userDoc)
		return console.error(
			`Failed to run setUser on "${uid}". Failed to get user document.`
		)

	if (!userDoc)
		return console.error(
			`Failed to run setUser on "${uid}". Document does not exist.`
		)

	userDoc.ref.set(data, { merge: true })
	cacheUser(uid, userDoc.data() as User)
}
