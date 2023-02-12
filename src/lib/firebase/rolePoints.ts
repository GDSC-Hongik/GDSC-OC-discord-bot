import { FieldValue } from "firebase-admin/firestore"

import { botCache, refs } from "."

function cacheRolePoints(roleID: string, point: number): number {
	return (botCache.data.rolePoints[roleID] = point)
}

export async function getRolePoint(
	roleID: string
): Promise<number | undefined> {
	if (botCache.data.rolePoints[roleID]) return botCache.data.rolePoints[roleID]

	const rolePointDoc = await refs.rolePoints.get()
	const rolePointsData = rolePointDoc.data()

	if (!rolePointsData || !rolePointsData[roleID]) return undefined

	return cacheRolePoints(roleID, rolePointsData[roleID])
}

export async function setRolePoint(
	roleID: string,
	point: number | undefined | null
): Promise<number | undefined> {
	if (!point) {
		await refs.rolePoints.update({
			[roleID]: FieldValue.delete(),
		})

		return undefined
	}

	await refs.rolePoints.set({ [roleID]: point }, { merge: true })

	return cacheRolePoints(roleID, point)
}
