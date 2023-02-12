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
	refs.snowflake2uid = db.collection("data").doc("snowflake2uid")
	refs.users = db.collection("users")
}

async function initializeDB() {
	// init "/data/snowflake2uid"
	cache.data.snowflake2uid = await refs.snowflake2uid.get()
	if (!cache.data.snowflake2uid.exists) await refs.snowflake2uid.create({})

	// init "/users"
	// "/users/nobody" exists because collections must have at least one document
	createUser("nobody")
}
