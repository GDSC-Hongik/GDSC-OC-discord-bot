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
import setUserDiscordID from "./setUserDiscordID"

export let auth: Auth
export let db: Firestore

interface FirebaseRefs {
	discordIDs: DocumentReference<DocumentData>
	users: CollectionReference<DocumentData>
}

export const refs: FirebaseRefs = {
	discordIDs: {} as DocumentReference<DocumentData>,
	users: {} as CollectionReference<DocumentData>,
}

interface Cache {
	data: {
		discordIDs: DocumentSnapshot<DocumentData>
	}

	users: {
		[key: string]: DocumentSnapshot<User>
	}
}

export const cache: Cache = {
	data: {
		discordIDs: {} as DocumentSnapshot<DocumentData>,
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
	setUserDiscordID,
}
