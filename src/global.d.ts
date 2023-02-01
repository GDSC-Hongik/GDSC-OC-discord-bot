declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DISCORD_BOT_TOKEN: string
			DISCORD_BOT_ID: string
			SIGN_UP_URL: string
			TESTING: string
		}
	}
}

export {}
