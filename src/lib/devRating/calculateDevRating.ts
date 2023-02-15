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
	const achievementPoints = calculateAchievementPoints(user)

	return {
		points: rolePoints + achievementPoints + user.points * 1,
		tier: tierSchema.enum.UNRANKED,
	}
}

function calculateRolePoints(user: User): number {
	let rolePoints = 0

	user.roles.map((role) => {
		if (typeof botCache.data.rolePoints[role] === "number")
			rolePoints += botCache.data.rolePoints[role]
	})

	return rolePoints
}

function calculateAchievementPoints(user: User): number {
	let achievementPoints = 0

	user.achievements.map((achievement) => {
		if (typeof botCache.data.achievementPoints[achievement] === "number")
			achievementPoints += botCache.data.achievementPoints[achievement]
	})

	return achievementPoints
}
