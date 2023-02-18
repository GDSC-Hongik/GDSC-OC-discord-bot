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
	| { success: true; data: Post } //
	| { success: false; reason: GetPostFailReason }
> {
	let postData: DocumentData | undefined
	if (postIDOrURL.startsWith("https://")) {
		const querySnapshot = await refs.posts
			.where("discordLink", "==", postIDOrURL)
			.get()

		postData = querySnapshot.docs[0].data()
	} else {
		postData = (await refs.posts.doc(postIDOrURL).get()).data()
	}

	const parseResult = postSchema.safeParse(postData)

	if (parseResult.success) {
		botCache.posts[postIDOrURL] = parseResult.data
		return { success: true, data: parseResult.data }
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

export async function UpdatePost(
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
