import DevRatingEvent from "../../types/devRatingEvent"
import infoPostLike from "./infoPostLike"
import infoShare from "./infoShare"
import updateAttendance from "./updateAttendance"
import updateRole from "./updateRole"

type DevRatingEventPayload =
	| {
			type: DevRatingEvent.UPDATE_ATTENDANCE
			data: Parameters<typeof updateAttendance>
	  }
	| {
			type: DevRatingEvent.INFO_SHARE
			data: Parameters<typeof infoShare>
	  }
	| {
			type: DevRatingEvent.INFO_LIKE
			data: Parameters<typeof infoPostLike>
	  }
	| {
			type: DevRatingEvent.UPDATE_ROLE
			data: Parameters<typeof updateRole>
	  }

export default function (payload: DevRatingEventPayload) {
	switch (payload.type) {
		case DevRatingEvent.UPDATE_ATTENDANCE: {
			updateAttendance(...payload.data)
			break
		}

		case DevRatingEvent.INFO_SHARE: {
			infoShare(...payload.data)
			break
		}

		case DevRatingEvent.INFO_LIKE: {
			infoPostLike(...payload.data)
			break
		}

		case DevRatingEvent.UPDATE_ROLE: {
			updateRole(...payload.data)
			break
		}

		default: {
			// todo: handle edge case
			break
		}
	}
}
