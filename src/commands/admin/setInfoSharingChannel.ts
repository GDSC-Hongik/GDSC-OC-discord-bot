import { EmbedBuilder } from "@discordjs/builders"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import { ChannelType, ChatInputCommandInteraction } from "discord.js"
import { PermissionFlagsBits } from "discord.js"

import { setChannelsConfig } from "../../lib/firebase"

const optionName = "채널"

export class SetInfoSharingChannelCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options })
	}

	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("정보공유-채널")
				.setDescription("정보공유 채널 설정")
				.addChannelOption((option) =>
					option
						.setName(optionName)
						.setDescription("정보 공유 채널")
						.setRequired(true)
				)
				.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		// get UID from command input
		const channel = interaction.options.getChannel(optionName)
		if (!channel || channel.type !== ChannelType.GuildForum)
			return this.replyInvalidChannel(interaction)

		const channelID = channel.id

		const operationResult = await setChannelsConfig("infoSharing", channelID)

		if (operationResult === channelID) await this.replySuccess(interaction)
	}

	async replySuccess(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "정보공유 채널 설정 성공",
				}),
			],
			ephemeral: true,
		})
	}

	async replyInvalidChannel(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "정보공유 채널 설정 실패",
					description:
						"선택하신 채널은 [포럼 채널](https://support.discord.com/hc/ko/articles/6208479917079-포럼-채널-FAQ)이 아닙니다",
				}),
			],
			ephemeral: true,
		})
	}
}
