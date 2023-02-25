import fetch from "node-fetch"

import { githubCache } from "."

export default async function (id: string): Promise<string> {
	const response = await fetch(`https://api.github.com/user/${id}`)
	const data = (await response.json()) as { login: string }

	return (githubCache.id2username[id] = data.login)
}
