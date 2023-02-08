import Tier from "./tier"

export default interface User {
	tier?: Tier
	devRating?: number
	points?: number
}
