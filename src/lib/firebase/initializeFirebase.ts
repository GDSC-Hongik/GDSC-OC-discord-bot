import * as admin from "firebase-admin"
import type { ServiceAccount } from "firebase-admin/app"
import { cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

import serviceAccount from "../serviceAccountKey.json"
import { cache, db, refs, setAuth, setDB } from "."
import createUser from "./createUser"

export default async function () {
	console.log("Initializing Firebase")

	admin.initializeApp({
		credential: cert(serviceAccount as ServiceAccount),
	})

	setDB(getFirestore())
	setAuth(getAuth())

	await initializeReferences()
	await initializeDB()
}

async function initializeReferences() {
	refs.discordIDs = db.collection("data").doc("discordIDs")
	refs.users = db.collection("users")
}

async function initializeDB() {
	// initialize "/data/discordIDs"

	cache.data.discordIDs = await refs.discordIDs.get()
	if (!cache.data.discordIDs.exists) await refs.discordIDs.create({})

	// initialize "/users"

	// "/users/nobody" exists because collections must have at least one document
	createUser("nobody")
}
