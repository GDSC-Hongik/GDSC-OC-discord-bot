import { auth } from "../firebase"

/**
 * Converts firebase user UID to GitHub user UID (NOT USERNAME)
 *
 * Example: the GitHub user UID of the user "developomp" is: 40858122.
 * https://api.github.com/users/developomp
 */
export default async function (
	firebaseUID: string
): Promise<string | undefined> {
	const user = await auth.getUser(firebaseUID)

	const gitHubData = user.providerData.find(
		(providerData) => providerData.providerId === "github.com"
	)

	if (!gitHubData) {
		console.error(
			`Failed to get GitHub UID of "${firebaseUID}". User is not signed in using GitHub`
		)
		return undefined
	}

	return gitHubData.uid
}
