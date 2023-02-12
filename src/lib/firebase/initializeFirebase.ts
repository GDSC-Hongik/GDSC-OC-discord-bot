import * as admin from "firebase-admin"
import type { ServiceAccount } from "firebase-admin/app"
import { cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

import type { ChannelConfig } from "../../types/botCache"
import serviceAccount from "../serviceAccountKey.json"
import { botCache, db, refs, setAuth, setDB } from "."
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
	refs.channelsConfig = db.collection("data").doc("channelsConfig")
	refs.rolePoints = db.collection("data").doc("rolePoints")
	refs.snowflake2uid = db.collection("data").doc("snowflake2uid")
	refs.users = db.collection("users")
}

async function initializeDB() {
	// init "/data/snowflake2uid"
	botCache.data.snowflake2uid = await refs.snowflake2uid.get()
	if (!botCache.data.snowflake2uid.exists) await refs.snowflake2uid.create({})

	// init "/data/rolePoints"
	const rolePointsData = (await refs.rolePoints.get()).data()
	if (rolePointsData) botCache.data.rolePoints = rolePointsData
	else await refs.rolePoints.create({})

	// init "/data/channelsConfig"
	const channelData = (await refs.channelsConfig.get()).data()
	if (channelData) botCache.data.channelsConfig = channelData as ChannelConfig
	else await refs.channelsConfig.create({})

	// init "/users"
	// "/users/nobody" exists because collections must have at least one document
	createUser("nobody")
}
