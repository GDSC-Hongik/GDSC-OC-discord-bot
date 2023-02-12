import type { Auth } from "firebase-admin/auth"
import type {
	CollectionReference,
	DocumentData,
	DocumentReference,
	DocumentSnapshot,
	Firestore,
} from "firebase-admin/firestore"

import type { User } from "../../types/user"
//
import cacheUser from "./cacheUser"
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
	snowflake2uid: DocumentReference<DocumentData>
	users: CollectionReference<DocumentData>
}

export const refs: FirebaseRefs = {
	snowflake2uid: {} as DocumentReference<DocumentData>,
	users: {} as CollectionReference<DocumentData>,
}

interface Cache {
	data: {
		snowflake2uid: DocumentSnapshot<DocumentData>
	}

	users: {
		[key: string]: DocumentSnapshot<User>
	}
}

export const cache: Cache = {
	data: {
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
	initializeFirebase,
	setUserData,
	setUserDiscordID,
}
