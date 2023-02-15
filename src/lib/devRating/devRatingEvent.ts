import infoPostLikeAdd from "./infoPostLikeAdd"
import infoPostLikeReceive from "./infoPostLikeReceive"
import infoPostCreate from "./postCreate"
import infoPostDelete from "./postDelete"
import updateAttendance from "./updateAttendance"
import updateRole from "./updateRole"

export enum DevRatingEvent {
	// 출석 업데이트
	UPDATE_ATTENDANCE,

	// 정보공유 포스트 생성
	POST_CREATE,

	// 정보공유 포스트 삭제
	POST_DELETE,

	// 본인의 정보공유 포스트에 좋아요가 추가됨
	POST_LIKE_RECEIVE,

	// 타인의 정보공유 포스트에 좋아요를 추가함
	POST_LIKE_ADD,

	// 역할 정보 갱신
	UPDATE_ROLE,
}

type DevRatingEventPayload =
	| {
			type: DevRatingEvent.UPDATE_ATTENDANCE
			data: Parameters<typeof updateAttendance>
	  }
	| {
			type: DevRatingEvent.POST_CREATE
			data: Parameters<typeof infoPostCreate>
	  }
	| {
			type: DevRatingEvent.POST_DELETE
			data: Parameters<typeof infoPostDelete>
	  }
	| {
			type: DevRatingEvent.POST_LIKE_RECEIVE
			data: Parameters<typeof infoPostLikeReceive>
	  }
	| {
			type: DevRatingEvent.POST_LIKE_ADD
			data: Parameters<typeof infoPostLikeAdd>
	  }
	| {
			type: DevRatingEvent.UPDATE_ROLE
			data: Parameters<typeof updateRole>
	  }

export default async function (payload: DevRatingEventPayload) {
	switch (payload.type) {
		case DevRatingEvent.UPDATE_ATTENDANCE: {
			await updateAttendance(...payload.data)
			break
		}

		case DevRatingEvent.POST_CREATE: {
			await infoPostCreate(...payload.data)
			break
		}

		case DevRatingEvent.POST_DELETE: {
			await infoPostDelete(...payload.data)
			break
		}

		case DevRatingEvent.POST_LIKE_RECEIVE: {
			await infoPostLikeReceive(...payload.data)
			break
		}

		case DevRatingEvent.POST_LIKE_ADD: {
			await infoPostLikeAdd(...payload.data)
			break
		}

		case DevRatingEvent.UPDATE_ROLE: {
			await updateRole(...payload.data)
			break
		}

		default: {
			// todo: handle edge case
			break
		}
	}
}
