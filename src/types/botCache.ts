import type { User } from "./user"

export interface ChannelsCache {
	infoSharing: string[]
}

export default interface BotCache {
	data: {
		channels: ChannelsCache
		rolePoints: { [key: string]: number }
		snowflake2uid: { [key: string]: string }
	}
	users: { [key: string]: User }
}
