import DevRatingEvent from "../../types/devRatingEvent"
import updateAttendance from "./updateAttendance"

type DevRatingEventPayload = {
	type: DevRatingEvent.UPDATE_ATTENDANCE
	// user UID
	data: Parameters<typeof updateAttendance>
}

export default function (payload: DevRatingEventPayload) {
	switch (payload.type) {
		case DevRatingEvent.UPDATE_ATTENDANCE: {
			updateAttendance(...payload.data)
		}
	}
}
