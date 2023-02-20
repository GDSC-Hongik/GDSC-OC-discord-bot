interface GithubCache {
	id2username: { [id: string]: string }
}

export const githubCache: GithubCache = {
	id2username: {},
}
