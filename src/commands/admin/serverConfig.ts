import { channelMention, EmbedBuilder } from "@discordjs/builders"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import { ChatInputCommandInteraction } from "discord.js"
import { PermissionFlagsBits } from "discord.js"

import { botCache } from "../../lib/firebase"

export class serverConfigCommand extends Command {
	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("서버-설정")
				.setDescription("서버 설정 열람")
				.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		const infoSharingChannels = botCache.data.channels.infoSharing
			? botCache.data.channels.infoSharing
					.map((channel) => `- ${channelMention(channel)}\n`)
					.join()
			: "없음"

		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "서버 설정",
					fields: [
						{
							name: "정보 공유 채널",
							value: infoSharingChannels,
						},
					],
				}),
			],
		})
	}
}
