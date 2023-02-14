import type { DocumentData, DocumentSnapshot } from "firebase-admin/firestore"

import type { User } from "./user"

export interface ChannelsCache {
	infoSharing: string[]
}

export default interface BotCache {
	data: {
		channels: ChannelsCache
		rolePoints: { [key: string]: number }
		snowflake2uid: DocumentSnapshot<DocumentData>
	}

	users: { [key: string]: DocumentSnapshot<User> }
}
