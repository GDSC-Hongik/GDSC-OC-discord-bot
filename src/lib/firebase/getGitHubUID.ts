import { auth } from "."

export default async function (
	firebaseUID: string
): Promise<string | undefined> {
	const user = await auth.getUser(firebaseUID)

	const gitHubData = user.providerData.find(
		(providerData) => providerData.providerId === "github.com"
	)

	if (!gitHubData) return logError("User is not signed in using GitHub")

	return gitHubData.uid
}

function logError(reason: string): undefined {
	console.error("Failed to get ", reason)

	return undefined
}
