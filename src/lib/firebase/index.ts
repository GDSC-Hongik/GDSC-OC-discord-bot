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
import fetchDiscordUserUID from "./fetchDiscordUserUID"
import fetchUserDocument from "./fetchUserDocument"
import fixUser from "./fixUser"
import initializeFirebase from "./initializeFirebase"
import setUserData from "./setUserData"
import setUserDiscordID from "./setUserDiscordID"

export let auth: Auth
export let db: Firestore

interface FirebaseRefs {
	channelsConfig: DocumentReference<DocumentData>
	snowflake2uid: DocumentReference<DocumentData>
	users: CollectionReference<DocumentData>
}

export const refs: FirebaseRefs = {
	channelsConfig: {} as DocumentReference<DocumentData>,
	snowflake2uid: {} as DocumentReference<DocumentData>,
	users: {} as CollectionReference<DocumentData>,
}

export const botCache: BotCache = {
	data: {
		channelsConfig: {},
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

export {
	cacheUser,
	createUser,
	fetchDiscordUserUID,
	fetchUserDocument,
	fixUser,
	getChannelsConfig,
	initializeFirebase,
	setChannelsConfig,
	setUserData,
	setUserDiscordID,
}
