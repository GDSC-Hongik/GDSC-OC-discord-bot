import type { ServiceAccount } from "firebase-admin/app"
import { cert, initializeApp } from "firebase-admin/app"
import type { Firestore } from "firebase-admin/firestore"
import { getFirestore } from "firebase-admin/firestore"

import serviceAccount from "./serviceAccountKey.json"

let db: Firestore

export function initializeFirebase() {
	initializeApp({
		credential: cert(serviceAccount as ServiceAccount),
	})

	db = getFirestore()
}

export { db }
