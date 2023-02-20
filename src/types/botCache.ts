import type { Achievements } from "./achievements"
import type { Activities } from "./activities"
import { Assignment } from "./assignments"
import type { Post } from "./post"
import type { User } from "./user"

export interface ChannelsCache {
	infoSharing: string[]
}

export default interface BotCache {
	assignments: { [assignmentID: string]: Assignment }
	data: {
		achievementPoints: { [key in Achievements]: number }
		activityPoints: { [key in Activities]: number }
		channels: ChannelsCache
		rolePoints: { [key: string]: number }
		snowflake2uid: { [key: string]: string }
	}
	posts: { [key: string]: Post }
	users: { [key: string]: User }
}
