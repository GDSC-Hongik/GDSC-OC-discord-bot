import * as admin from "firebase-admin"
import type { ServiceAccount } from "firebase-admin/app"
import { cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

import type { ChannelsCache } from "../../types/botCache"
import serviceAccount from "../serviceAccountKey.json"
import { botCache, db, refs, setAuth, setDB, setRefs } from "."
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
	setRefs({
		channels: db.collection("data").doc("channels"),
		rolePoints: db.collection("data").doc("rolePoints"),
		snowflake2uid: db.collection("data").doc("snowflake2uid"),
		users: db.collection("users"),
	})
}

async function initializeDB() {
	// init "/data/snowflake2uid"
	botCache.data.snowflake2uid = await refs.snowflake2uid.get()
	if (!botCache.data.snowflake2uid.exists) await refs.snowflake2uid.create({})

	// init "/data/rolePoints"
	const rolePointsData = (await refs.rolePoints.get()).data()
	if (rolePointsData) botCache.data.rolePoints = rolePointsData
	else await refs.rolePoints.create({})

	// init "/data/channels"
	const channelData = (await refs.channels.get()).data()
	if (channelData) botCache.data.channels = channelData as ChannelsCache
	else await refs.channels.create(botCache.data.channels)

	// init "/users"
	// "/users/nobody" exists because collections must have at least one document
	createUser("nobody")
}
