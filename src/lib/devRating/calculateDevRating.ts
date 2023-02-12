import { User } from "../../types/user"

/**
 * Calculates devRating of a user.
 * devRating = (role based points) + (badge points) + (XP points * x)
 *   where x = 1 as of now
 */
export default async function (user: User): Promise<number> {
	return user.points * 1
}
