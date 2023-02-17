import * as admin from "firebase-admin"
import type { ServiceAccount } from "firebase-admin/app"
import { cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import type {
	DocumentData,
	DocumentReference,
	WithFieldValue,
} from "firebase-admin/firestore"
import { getFirestore } from "firebase-admin/firestore"

import serviceAccount from "../serviceAccountKey.json"
import {
	botCache,
	createPost,
	createUser,
	db,
	refs,
	setAuth,
	setDB,
	setRefs,
} from "."

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
	setRefs({
		achievementPoints: db.collection("data").doc("achievementPoints"),
		channels: db.collection("data").doc("channels"),
		rolePoints: db.collection("data").doc("rolePoints"),
		snowflake2uid: db.collection("data").doc("snowflake2uid"),
		posts: db.collection("posts"),
		users: db.collection("users"),
	})
}

async function initializeDB() {
	// init "/data/achievementPoints"
	await initDoc(refs.achievementPoints, botCache.data.achievementPoints)

	// init "/data/channels"
	await initDoc(refs.channels, botCache.data.channels)

	// init "/data/rolePoints"
	await initDoc(refs.rolePoints, botCache.data.rolePoints)

	// init "/data/snowflake2uid"
	await initDoc(refs.snowflake2uid, botCache.data.snowflake2uid)

	// the following data exist because firestore collections must have at least
	// one document to exist

	// init "/posts"
	createPost({ author: "nobody", discord: false, likes: 0 }, "EmptyPost")

	// init "/users"
	createUser("nobody")
}

async function initDoc(
	docRef: DocumentReference<DocumentData>,
	dataRef: WithFieldValue<DocumentData>
) {
	const docSnapshot = await docRef.get()
	const data = docSnapshot.data()
	if (data) dataRef = data
	else await docRef.create(dataRef)
}
