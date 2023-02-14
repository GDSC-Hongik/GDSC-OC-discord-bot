import infoPostCreate from "./infoPostCreate"
import infoPostDelete from "./infoPostDelete"
import infoPostLikeAdd from "./infoPostLikeAdd"
import infoPostLikeReceive from "./infoPostLikeReceive"
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
	INFO_POST_LIKE_RECEIVE,

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
			data: Parameters<typeof infoPostCreate>
	  }
	| {
			type: DevRatingEvent.INFO_POST_DELETE
			data: Parameters<typeof infoPostDelete>
	  }
	| {
			type: DevRatingEvent.INFO_POST_LIKE_RECEIVE
			data: Parameters<typeof infoPostLikeReceive>
	  }
	| {
			type: DevRatingEvent.INFO_POST_LIKE_ADD
			data: Parameters<typeof infoPostLikeAdd>
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
			infoPostCreate(...payload.data)
			break
		}

		case DevRatingEvent.INFO_POST_DELETE: {
			infoPostDelete(...payload.data)
			break
		}

		case DevRatingEvent.INFO_POST_LIKE_RECEIVE: {
			infoPostLikeReceive(...payload.data)
			break
		}

		case DevRatingEvent.INFO_POST_LIKE_ADD: {
			infoPostLikeAdd(...payload.data)
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
