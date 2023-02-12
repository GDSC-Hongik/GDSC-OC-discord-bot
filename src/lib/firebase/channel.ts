import type { ChannelConfig } from "../../types/botCache"
import { botCache, refs } from "."

function cacheChannelsConfig(key: keyof ChannelConfig, data: string): string {
	return (botCache.data.channelsConfig[key] = data)
}

export async function getChannelsConfig(
	channelName: keyof ChannelConfig
): Promise<string> {
	if (botCache.data.channelsConfig[channelName])
		return botCache.data.channelsConfig[channelName] as string

	const channelDoc = await refs.channelsConfig.get()
	return cacheChannelsConfig(channelName, channelDoc.get(channelName))
}

export async function setChannelsConfig(
	channelName: keyof ChannelConfig,
	channelID: string
): Promise<string> {
	refs.channelsConfig.set({ [channelName]: channelID }, { merge: true })
	return cacheChannelsConfig(channelName, channelID)
}
