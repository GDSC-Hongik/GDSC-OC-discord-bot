import type { ServiceAccount } from "firebase-admin/app"
import { cert, initializeApp } from "firebase-admin/app"
import type {
	CollectionReference,
	DocumentData,
	DocumentReference,
	DocumentSnapshot,
	Firestore,
} from "firebase-admin/firestore"
import { getFirestore } from "firebase-admin/firestore"

import serviceAccount from "./serviceAccountKey.json"

interface FirebaseRefs {
	discordIDs?: DocumentReference<DocumentData>
	users?: CollectionReference<DocumentData>
}

interface Data {
	connections: {
		discordIDs?: DocumentSnapshot<DocumentData>
	}

	users: {
		[key: string]: DocumentSnapshot<DocumentData>
	}
}

let db: Firestore
const refs: FirebaseRefs = {}
const data: Data = {
	connections: {},
	users: {},
}

export async function initializeFirebase() {
	console.log("Initializing Firebase")

	initializeApp({
		credential: cert(serviceAccount as ServiceAccount),
	})

	db = getFirestore()

	// get references

	refs.discordIDs = db.collection("connections").doc("discordIDs")
	refs.users = db.collection("users")

	// get data

	data.connections.discordIDs = await refs.discordIDs.get()
	data.users.nobody = await refs.users.doc("nobody").get()

	// initialize database

	if (!data.connections.discordIDs.exists) await refs.discordIDs.create({})
	if (!data.users.nobody.exists) refs.users.doc("nobody").create({})
}

export { db }
