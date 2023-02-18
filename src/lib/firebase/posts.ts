import { DocumentData } from "firebase-admin/firestore"
import { customAlphabet } from "nanoid"

import { Post, postSchema } from "../../types/post"
import { botCache, refs } from "."

const nanoid = customAlphabet(
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	32
)

export enum GetPostFailReason {
	InvalidSchema,
}
export enum CreatePostFailReason {}
export enum DeletePostFailReason {}
export enum UpdatePostFailReason {}

export async function getPost(postIDOrURL: string): Promise<
	| { success: true; data: { post: Post; postID: string } } //
	| { success: false; reason: GetPostFailReason }
> {
	// return cached data if it exists
	if (botCache.posts[postIDOrURL])
		return {
			success: true,
			data: {
				post: botCache.posts[postIDOrURL],
				postID: postIDOrURL,
			},
		}

	// get post data from DB
	let postID: string
	let postData: DocumentData | undefined
	if (postIDOrURL.startsWith("https://")) {
		const querySnapshot = await refs.posts
			.where("discordLink", "==", postIDOrURL)
			.get()

		postID = querySnapshot.docs[0].id
		postData = querySnapshot.docs[0].data()
	} else {
		postID = postIDOrURL
		postData = (await refs.posts.doc(postIDOrURL).get()).data()
	}

	// check if the data is valid
	const parseResult = postSchema.safeParse(postData)

	if (parseResult.success) {
		botCache.posts[postIDOrURL] = parseResult.data
		return { success: true, data: { post: parseResult.data, postID } }
	} else {
		console.error(
			`Failed to get post "${postIDOrURL}". Data does not fit the schema.`
		)
		return { success: false, reason: GetPostFailReason.InvalidSchema }
	}
}

export async function createPost(
	data: Post,
	postID?: string
): Promise<
	| { success: true; postID: string } //
	| { success: false; reason: CreatePostFailReason }
> {
	if (!postID) postID = nanoid()
	const postDocRef = refs.posts.doc(postID)

	await postDocRef.set(data, { merge: true })

	return { success: true, postID }
}

export async function deletePost(postID: string): Promise<
	| { success: true } //
	| { success: false; reason: DeletePostFailReason }
> {
	const postDocRef = refs.posts.doc(postID)

	await postDocRef.delete()

	return { success: true }
}

export async function updatePost(
	postID: string,
	data: Post
): Promise<
	| { success: true } //
	| { success: false; reason: UpdatePostFailReason }
> {
	const postDocRef = refs.posts.doc(postID)

	await postDocRef.set(data, { merge: true })

	return { success: true }
}
