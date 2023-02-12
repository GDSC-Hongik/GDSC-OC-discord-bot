import type { DocumentData, DocumentSnapshot } from "firebase-admin/firestore"

import type { User } from "./user"

export interface ChannelConfig {
	infoSharing?: string
}

export default interface BotCache {
	data: {
		channelsConfig: ChannelConfig
		snowflake2uid: DocumentSnapshot<DocumentData>
	}

	users: {
		[key: string]: DocumentSnapshot<User>
	}
}
