import type { Auth } from "firebase-admin/auth"
import type {
	CollectionReference,
	DocumentData,
	DocumentReference,
	Firestore,
} from "firebase-admin/firestore"

import { Achievements } from "../../types/achievements"
import { Activities } from "../../types/activities"
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

export let refs = {
	achievementPoints: {} as DocumentReference<DocumentData>,
	activityPoints: {} as DocumentReference<DocumentData>,
	channels: {} as DocumentReference<DocumentData>,
	rolePoints: {} as DocumentReference<DocumentData>,
	snowflake2uid: {} as DocumentReference<DocumentData>,
	posts: {} as CollectionReference<DocumentData>,
	users: {} as CollectionReference<DocumentData>,
}

export const botCache: BotCache = {
	data: {
		achievementPoints: {
			[Achievements.ATTENDANCE_1]: 5,
			[Achievements.ATTENDANCE_10]: 15,
			[Achievements.ATTENDANCE_30]: 30,
			[Achievements.ATTENDANCE_50]: 50,
			[Achievements.ATTENDANCE_100]: 100,
			[Achievements.ATTENDANCE_300]: 300,
		},
		activityPoints: {
			[Activities.ATTENDANCE]: 1,

			[Activities.POST_CREATE]: 5,
			[Activities.POST_LIKE_RECEIVE]: 1,
			[Activities.POST_LIKE_ADD]: 1,

			[Activities.ATTEND_STUDY]: 10,
			[Activities.ATTEND_SEMINAR]: 10,
			[Activities.SEMINAR_SPEAKER]: 15,
		},
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

export function setRefs(newRefs: typeof refs) {
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
