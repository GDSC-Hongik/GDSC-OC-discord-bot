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
import {
	createAssignment,
	deleteAssignment,
	getAssignment,
	listAssignments,
	setAssignment,
} from "./assignments"
import { getChannels, updateChannels } from "./channel"
import fixSchema from "./fixSchema"
import initializeFirebase, { initializeDB } from "./initializeFirebase"
import {
	createPost,
	CreatePostFailReason,
	deletePost,
	DeletePostFailReason,
	updatePost,
	UpdatePostFailReason,
} from "./posts"
import { getRolePoint, setRolePoint } from "./rolePoints"
import {
	createUser,
	CreateUserFailReason,
	getUser,
	setUser,
	setUserDiscordID,
	snowflake2UID,
} from "./user"

export let auth: Auth
export let db: Firestore

export let refs = {
	// documents
	achievementPoints: {} as DocumentReference<DocumentData>,
	activityPoints: {} as DocumentReference<DocumentData>,
	channels: {} as DocumentReference<DocumentData>,
	rolePoints: {} as DocumentReference<DocumentData>,
	snowflake2uid: {} as DocumentReference<DocumentData>,

	// collections
	assignments: {} as CollectionReference<DocumentData>,
	posts: {} as CollectionReference<DocumentData>,
	users: {} as CollectionReference<DocumentData>,
}

// These are the default values.
// Whatever is in the database will override these data.
export const botCache: BotCache = {
	assignments: {},
	data: {
		achievementPoints: {
			[Achievements.ATTENDANCE_1]: 5,
			[Achievements.ATTENDANCE_10]: 15,
			[Achievements.ATTENDANCE_30]: 30,
			[Achievements.ATTENDANCE_50]: 50,
			[Achievements.ATTENDANCE_100]: 100,
			[Achievements.ATTENDANCE_300]: 300,

			[Achievements.POST_CREATE_1]: 5,
			[Achievements.POST_CREATE_10]: 15,
			[Achievements.POST_CREATE_30]: 30,
			[Achievements.POST_CREATE_50]: 50,
			[Achievements.POST_CREATE_100]: 100,
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
	db.settings({ ignoreUndefinedProperties: true })
}

export function setRefs(newRefs: typeof refs) {
	refs = newRefs
}

export {
	createAssignment,
	createPost,
	CreatePostFailReason,
	createUser,
	CreateUserFailReason,
	deleteAssignment,
	deletePost,
	DeletePostFailReason,
	fixSchema,
	getAssignment,
	getChannels,
	getRolePoint,
	getUser,
	initializeDB,
	initializeFirebase,
	listAssignments,
	setAssignment,
	setRolePoint,
	setUser,
	setUserDiscordID,
	snowflake2UID,
	updateChannels,
	updatePost,
	UpdatePostFailReason,
}
