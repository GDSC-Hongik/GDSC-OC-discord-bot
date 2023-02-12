import type { ChannelConfig } from "../../types/botCache"
import { botCache, refs } from "."

function cacheChannelsConfig(key: keyof ChannelConfig, data: string): string {
	return (botCache.data.channelsConfig[key] = data)
}

export async function getChannelsConfig(
	channelName: keyof ChannelConfig
): Promise<string | undefined> {
	if (botCache.data.channelsConfig[channelName])
		return botCache.data.channelsConfig[channelName] as string

	const channelConfigDoc = await refs.channelsConfig.get()
	const channelID = channelConfigDoc.get(channelName)

	if (channelID) return cacheChannelsConfig(channelName, channelID)

	console.error(
		`Failed to get channel ID of ${channelName}. Data does not exist in DB.`
	)

	return undefined
}

export async function setChannelsConfig(
	channelName: keyof ChannelConfig,
	channelID: string
): Promise<string> {
	refs.channelsConfig.set({ [channelName]: channelID }, { merge: true })
	return cacheChannelsConfig(channelName, channelID)
}
