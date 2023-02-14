import type { Auth } from "firebase-admin/auth"
import type {
	CollectionReference,
	DocumentData,
	DocumentReference,
	Firestore,
} from "firebase-admin/firestore"

import type BotCache from "../../types/botCache"
import { getChannels, updateChannels } from "./channel"
import initializeFirebase from "./initializeFirebase"
import { getRolePoint, setRolePoint } from "./rolePoints"
import setUserDiscordID from "./setUserDiscordID"
import snowflake2UID from "./snowflake2UID"
import {
	createUser,
	CreateUserFailReason,
	fixUser,
	getUser,
	setUser,
} from "./user"

export let auth: Auth
export let db: Firestore

interface FirebaseRefs {
	channels: DocumentReference<DocumentData>
	rolePoints: DocumentReference<DocumentData>
	snowflake2uid: DocumentReference<DocumentData>
	users: CollectionReference<DocumentData>
}

export let refs: FirebaseRefs = {
	channels: {} as DocumentReference<DocumentData>,
	rolePoints: {} as DocumentReference<DocumentData>,
	snowflake2uid: {} as DocumentReference<DocumentData>,
	users: {} as CollectionReference<DocumentData>,
}

export const botCache: BotCache = {
	data: {
		channels: {
			infoSharing: [],
		},
		rolePoints: {},
		snowflake2uid: {},
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
	createUser,
	CreateUserFailReason,
	fixUser,
	getChannels,
	getRolePoint,
	getUser,
	initializeFirebase,
	setRolePoint,
	setUser,
	setUserDiscordID,
	snowflake2UID,
	updateChannels,
}
