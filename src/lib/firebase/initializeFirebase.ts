import * as admin from "firebase-admin"
import type { ServiceAccount } from "firebase-admin/app"
import { cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
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
		activityPoints: db.collection("data").doc("activityPoints"),
		channels: db.collection("data").doc("channels"),
		rolePoints: db.collection("data").doc("rolePoints"),
		snowflake2uid: db.collection("data").doc("snowflake2uid"),
		posts: db.collection("posts"),
		users: db.collection("users"),
	})
}

async function initializeDB() {
	await initDataDoc("achievementPoints")
	await initDataDoc("activityPoints")
	await initDataDoc("channels")
	await initDataDoc("rolePoints")
	await initDataDoc("snowflake2uid")

	// the following data exist because firestore collections must have at least
	// one document to exist

	// init "/posts"
	createPost({ author: "nobody", discord: false, likes: 0 }, "EmptyPost")

	// init "/users"
	createUser("nobody")
}

async function initDataDoc(
	key: keyof typeof refs & keyof typeof botCache.data
) {
	const docSnapshot = await refs[key].get()
	const data = docSnapshot.data()

	if (data) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		botCache.data[key] = data
	} else {
		await refs[key].create(botCache.data[key])
	}
}
