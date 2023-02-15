import * as admin from "firebase-admin"
import type { ServiceAccount } from "firebase-admin/app"
import { cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

import type { ChannelsCache } from "../../types/botCache"
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
		channels: db.collection("data").doc("channels"),
		rolePoints: db.collection("data").doc("rolePoints"),
		snowflake2uid: db.collection("data").doc("snowflake2uid"),
		posts: db.collection("posts"),
		users: db.collection("users"),
	})
}

async function initializeDB() {
	// init "/data/snowflake2uid"
	const snowflake2uidData = (await refs.snowflake2uid.get()).data()
	if (snowflake2uidData) botCache.data.snowflake2uid = snowflake2uidData
	else await refs.snowflake2uid.create(botCache.data.snowflake2uid)

	// init "/data/rolePoints"
	const rolePointsData = (await refs.rolePoints.get()).data()
	if (rolePointsData) botCache.data.rolePoints = rolePointsData
	else await refs.rolePoints.create(botCache.data.rolePoints)

	// init "/data/channels"
	const channelData = (await refs.channels.get()).data()
	if (channelData) botCache.data.channels = channelData as ChannelsCache
	else await refs.channels.create(botCache.data.channels)

	// the following data exist because firestore collections must have at least
	// one document to exist

	// init "/posts"
	createPost({ author: "nobody", discord: false, likes: 0 }, "EmptyPost")

	// init "/users"
	createUser("nobody")
}
