import { z } from "zod"

// nanoID generated using https://zelark.github.io/nano-id-cc/
export enum Activities {
	// community activities

	ATTENDANCE = "q9Ih8La4",

	// knowledge sharing activities

	POST_CREATE = "lxIe5uHH",
	POST_LIKE_RECEIVE = "RSvP35f7",
	POST_LIKE_ADD = "tEM4TM2k",

	// scholar

	ATTEND_STUDY = "GVhp3rXV",
	ATTEND_SEMINAR = "c2e0F31Z",
	SEMINAR_SPEAKER = "CKyfHAeO",
}

export const activitiesSchema = z.nativeEnum(Activities)
