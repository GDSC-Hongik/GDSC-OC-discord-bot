import * as admin from "firebase-admin"
import type { ServiceAccount } from "firebase-admin/app"
import { cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

import serviceAccount from "../serviceAccountKey.json"
import { botCache, db, refs, setAuth, setDB, setRefs } from "."

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
		assignments: db.collection("assignments"),
		achievementPoints: db.collection("data").doc("achievementPoints"),
		activityPoints: db.collection("data").doc("activityPoints"),
		channels: db.collection("data").doc("channels"),
		rolePoints: db.collection("data").doc("rolePoints"),
		snowflake2uid: db.collection("data").doc("snowflake2uid"),
		posts: db.collection("posts"),
		users: db.collection("users"),
	})
}

export async function initializeDB(): Promise<void> {
	// bruh why doesn't js have built in set intersection feature
	const dataCacheKeys = Object.keys(refs).filter((key) =>
		Object.keys(botCache.data).includes(key)
	)

	for (const _key of dataCacheKeys) {
		const key = _key as keyof typeof refs & keyof typeof botCache.data
		const docSnapshot = await refs[key].get()
		const data = docSnapshot.data() || {}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		botCache.data[key] = {
			...botCache.data[key],
			...data,
		}

		if (JSON.stringify(data) !== JSON.stringify(botCache.data[key]))
			await refs[key].set(botCache.data[key], { merge: true })
	}
}
