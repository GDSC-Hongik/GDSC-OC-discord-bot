import type { DocumentData, DocumentSnapshot } from "firebase-admin/firestore"

import type { User } from "./user"

export default interface BotCache {
	data: {
		snowflake2uid: DocumentSnapshot<DocumentData>
	}

	users: {
		[key: string]: DocumentSnapshot<User>
	}
}
