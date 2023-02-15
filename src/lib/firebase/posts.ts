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

export async function getPost(postID: string): Promise<
	| { success: true; data: Post } //
	| { success: false; reason: GetPostFailReason }
> {
	const postDocRef = refs.posts.doc(postID)
	const postData = await postDocRef.get()
	const parseResult = postSchema.safeParse(postData)

	if (parseResult.success) {
		botCache.posts[postID] = parseResult.data
		return { success: true, data: parseResult.data }
	} else {
		console.error(
			`Failed to get post "${postID}". Data does not fit the schema.`
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
