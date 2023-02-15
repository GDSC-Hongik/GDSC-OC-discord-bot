import type { Auth } from "firebase-admin/auth"
import type {
	CollectionReference,
	DocumentData,
	DocumentReference,
	Firestore,
} from "firebase-admin/firestore"

import type BotCache from "../../types/botCache"
import { getChannels, updateChannels } from "./channel"
import fixSchema from "./fixSchema"
import initializeFirebase from "./initializeFirebase"
import {
	createPost,
	CreatePostFailReason,
	deletePost,
	DeletePostFailReason,
	UpdatePost,
	UpdatePostFailReason,
} from "./posts"
import { getRolePoint, setRolePoint } from "./rolePoints"
import setUserDiscordID from "./setUserDiscordID"
import snowflake2UID from "./snowflake2UID"
import { createUser, CreateUserFailReason, getUser, setUser } from "./user"

export let auth: Auth
export let db: Firestore

interface FirebaseRefs {
	channels: DocumentReference<DocumentData>
	rolePoints: DocumentReference<DocumentData>
	snowflake2uid: DocumentReference<DocumentData>
	posts: CollectionReference<DocumentData>
	users: CollectionReference<DocumentData>
}

export let refs: FirebaseRefs = {
	channels: {} as DocumentReference<DocumentData>,
	rolePoints: {} as DocumentReference<DocumentData>,
	snowflake2uid: {} as DocumentReference<DocumentData>,
	posts: {} as CollectionReference<DocumentData>,
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
	posts: {},
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
	createPost,
	CreatePostFailReason,
	createUser,
	CreateUserFailReason,
	deletePost,
	DeletePostFailReason,
	fixSchema,
	getChannels,
	getRolePoint,
	getUser,
	initializeFirebase,
	setRolePoint,
	setUser,
	setUserDiscordID,
	snowflake2UID,
	updateChannels,
	UpdatePost,
	UpdatePostFailReason,
}
