import type { Auth } from "firebase-admin/auth"
import type {
	CollectionReference,
	DocumentData,
	DocumentReference,
	DocumentSnapshot,
	Firestore,
} from "firebase-admin/firestore"

import type BotCache from "../../types/botCache"
import cacheUser from "./cacheUser"
import { getChannelsConfig, setChannelsConfig } from "./channel"
import createUser from "./createUser"
import fetchUserDocument from "./fetchUserDocument"
import fixUser from "./fixUser"
import initializeFirebase from "./initializeFirebase"
import { getRolePoint, setRolePoint } from "./rolePoints"
import setUserData from "./setUserData"
import setUserDiscordID from "./setUserDiscordID"
import snowflake2UID from "./snowflake2UID"

export let auth: Auth
export let db: Firestore

interface FirebaseRefs {
	channelsConfig: DocumentReference<DocumentData>
	rolePoints: DocumentReference<DocumentData>
	snowflake2uid: DocumentReference<DocumentData>
	users: CollectionReference<DocumentData>
}

export let refs: FirebaseRefs = {
	channelsConfig: {} as DocumentReference<DocumentData>,
	rolePoints: {} as DocumentReference<DocumentData>,
	snowflake2uid: {} as DocumentReference<DocumentData>,
	users: {} as CollectionReference<DocumentData>,
}

export const botCache: BotCache = {
	data: {
		channelsConfig: {},
		rolePoints: {},
		snowflake2uid: {} as DocumentSnapshot<DocumentData>,
	},
	users: {},
}

export function setAuth(newAuth: Auth) {
	auth = newAuth
}

export function setDB(newDB: Firestore) {
	db = newDB
}

export function setRefs(newRefs: FirebaseRefs) {
	refs = newRefs
}

export {
	cacheUser,
	createUser,
	fetchUserDocument,
	fixUser,
	getChannelsConfig,
	getRolePoint,
	initializeFirebase,
	setChannelsConfig,
	setRolePoint,
	setUserData,
	setUserDiscordID,
	snowflake2UID,
}
