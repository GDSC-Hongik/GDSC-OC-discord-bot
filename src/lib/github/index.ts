interface GithubCache {
	// maps firebase UID -> GitHub usernames
	usernames: { [firebaseUID: string]: string }
}

export const githubCache: GithubCache = {
	usernames: {},
}
