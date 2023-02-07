import { SapphireClient } from "@sapphire/framework"
import { cert, initializeApp, ServiceAccount } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

import serviceAccount from "./serviceAccountKey.json"

initializeApp({
	credential: cert(serviceAccount as ServiceAccount),
})

export default class Client extends SapphireClient {
	db = getFirestore()
}
