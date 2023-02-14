import { Tier, tierSchema } from "../../types/tier"
import { User } from "../../types/user"
import { botCache } from "../firebase"

/**
 * Calculates devRating of a user.
 * devRating = (role based points) + (badge points) + (XP points * x)
 *   where x = 1 as of now
 */
export default async function (
	user: User
): Promise<{ points: number; tier: Tier }> {
	const rolePoints = calculateRolePoints(user)

	return {
		points: rolePoints + user.points * 1,
		tier: tierSchema.enum.UNRANKED,
	}
}

function calculateRolePoints(user: User) {
	let rolePoints = 0

	user.roles.map((role) => {
		rolePoints += botCache.data.rolePoints[role]
	})

	return rolePoints
}
