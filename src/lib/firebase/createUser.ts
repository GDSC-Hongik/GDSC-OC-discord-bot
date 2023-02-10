import { defaultUser } from "../../types/user"
import { refs } from "."
import cacheUser from "./cacheUser"

export default async function (uid: string) {
	const userDoc = refs.users.doc(uid)
	userDoc.set(defaultUser, { merge: true })
	cacheUser(uid, await userDoc.get())
}
