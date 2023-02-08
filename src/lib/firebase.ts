import type { ServiceAccount } from "firebase-admin/app"
import { cert, initializeApp } from "firebase-admin/app"
import type { Auth } from "firebase-admin/auth"
import { getAuth } from "firebase-admin/auth"
import type {
	CollectionReference,
	DocumentData,
	DocumentReference,
	DocumentSnapshot,
	Firestore,
} from "firebase-admin/firestore"
import { getFirestore } from "firebase-admin/firestore"

import User from "../interfaces/user"
import serviceAccount from "./serviceAccountKey.json"

interface FirebaseRefs {
	discordIDs: DocumentReference<DocumentData>
	users: CollectionReference<DocumentData>
}

interface Cache {
	data: {
		discordIDs: DocumentSnapshot<DocumentData>
	}

	users: {
		[key: string]: DocumentSnapshot<DocumentData>
	}
}

let auth: Auth
let db: Firestore
const refs: FirebaseRefs = {
	discordIDs: {} as DocumentReference<DocumentData>,
	users: {} as CollectionReference<DocumentData>,
}
const cache: Cache = {
	data: {
		discordIDs: {} as DocumentSnapshot<DocumentData>,
	},
	users: {},
}

export async function initializeFirebase() {
	console.log("Initializing Firebase")

	initializeApp({
		credential: cert(serviceAccount as ServiceAccount),
	})

	db = getFirestore()
	auth = getAuth()

	// get references

	refs.discordIDs = db.collection("data").doc("discordIDs")
	refs.users = db.collection("users")

	// get data

	cache.data.discordIDs = await refs.discordIDs.get()
	cache.users.nobody = await refs.users.doc("nobody").get()

	// initialize database

	if (!cache.data.discordIDs.exists) await refs.discordIDs.create({})
	if (!cache.users.nobody.exists) refs.users.doc("nobody").create({})
}

export async function fetchUserDocument(
	uid: string,
	forceUpdate = false
): Promise<DocumentSnapshot<User> | undefined> {
	// return cached data if it exists

	if (cache.users[uid] && forceUpdate) return cache.users[uid]

	// fetch user data from firestore

	const userDataRef = refs.users.doc(uid)
	const userData = await userDataRef.get()

	// return user data if it exists

	if (userData.exists) return (cache.users[uid] = userData)

	// create user data in DB

	try {
		await auth.getUser(uid)
	} catch {
		return undefined
	}

	await userDataRef.create({})

	return (cache.users[uid] = await userDataRef.get())
}

/**
 * Associates discord ID with a firebase account UID
 */
export async function setUserDiscordID(
	firebaseUID: string,
	discordSnowflake: string
) {
	refs.discordIDs.set({ [discordSnowflake]: firebaseUID }, { merge: true })
	cache.data.discordIDs = await refs.discordIDs.get()
}

export { db }
