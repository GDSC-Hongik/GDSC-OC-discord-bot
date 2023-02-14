import infoPostLike from "./infoPostLike"
import infoShare from "./infoShare"
import updateAttendance from "./updateAttendance"
import updateRole from "./updateRole"

export enum DevRatingEvent {
	// 출석 업데이트
	UPDATE_ATTENDANCE,

	// 정보공유 포스트 생성
	INFO_POST_CREATE,

	// 정보공유 포스트 삭제
	INFO_POST_DELETE,

	// 본인의 정보공유 포스트에 좋아요가 추가됨
	INFO_POST_LIKE_RECEIVED,

	// 타인의 정보공유 포스트에 좋아요를 추가함
	INFO_POST_LIKE_ADD,

	// 역할 정보 갱신
	UPDATE_ROLE,
}

type DevRatingEventPayload =
	| {
			type: DevRatingEvent.UPDATE_ATTENDANCE
			data: Parameters<typeof updateAttendance>
	  }
	| {
			type: DevRatingEvent.INFO_POST_CREATE
			data: Parameters<typeof infoShare>
	  }
	| {
			type: DevRatingEvent.INFO_POST_LIKE_RECEIVED
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

		case DevRatingEvent.INFO_POST_CREATE: {
			infoShare(...payload.data)
			break
		}

		case DevRatingEvent.INFO_POST_LIKE_RECEIVED: {
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
