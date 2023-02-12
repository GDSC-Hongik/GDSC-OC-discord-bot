import { User } from "../../types/user"
import { botCache } from "../firebase"

/**
 * Calculates devRating of a user.
 * devRating = (role based points) + (badge points) + (XP points * x)
 *   where x = 1 as of now
 */
export default async function (user: User): Promise<number> {
	const rolePoints = calculateRolePoints(user)

	return rolePoints + user.points * 1
}

function calculateRolePoints(user: User) {
	let rolePoints = 0

	user.roles.map((role) => {
		rolePoints += botCache.data.rolePoints[role]
	})

	return rolePoints
}
