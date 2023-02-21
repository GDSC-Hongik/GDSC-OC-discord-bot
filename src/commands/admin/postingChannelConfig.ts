import { EmbedBuilder } from "@discordjs/builders"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import { ChannelType, ChatInputCommandInteraction } from "discord.js"
import { PermissionFlagsBits } from "discord.js"

import { updateChannels } from "../../lib/firebase"

const OptionName = {
	operation: "작업",
	channel: "채널",
}

const OperationName = {
	add: "추가",
	remove: "제거",
}

export class PostingChannelConfigCommand extends Command {
	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("정보공유-채널-설정")
				.setDescription("정보공유 채널 추가/제거")
				.addStringOption((option) =>
					option
						.setName(OptionName.operation)
						.setDescription("수행할 작업 (추가/제거)")
						.addChoices(
							{ name: OperationName.add, value: OperationName.add },
							{ name: OperationName.remove, value: OperationName.remove }
						)
						.setRequired(true)
				)
				.addChannelOption((option) =>
					option
						.setName(OptionName.channel)
						.setDescription("정보 공유 채널")
						.setRequired(true)
				)
				.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		// get UID from command input
		const channel = interaction.options.getChannel(OptionName.channel)
		if (!channel || channel.type !== ChannelType.GuildForum)
			return this.replyFail(interaction, "invalidChannelSelected")

		// get operation type from command input
		const operation = interaction.options.getString(OptionName.operation)
		if (!operation)
			return this.replyFail(interaction, "invalidOperationSelected")

		switch (operation) {
			case OperationName.add: {
				const operationResult = await updateChannels("add", "infoSharing", [
					channel.id,
				])

				if (operationResult.includes(channel.id))
					return await this.replySuccess(interaction)

				break
			}

			case OperationName.remove: {
				const operationResult = await updateChannels("remove", "infoSharing", [
					channel.id,
				])

				if (!operationResult.includes(channel.id))
					return await this.replySuccess(interaction)

				break
			}
		}

		return await this.replyFail(interaction)
	}

	async replySuccess(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "정보공유 채널 설정 성공",
				}),
			],
			ephemeral: true,
		})
	}

	async replyFail(
		interaction: ChatInputCommandInteraction,
		reason?: "invalidChannelSelected" | "invalidOperationSelected" | "unknown"
	): Promise<void> {
		let description = "정보공유 채널 설정이 알 수 없는 이유로 실패했습니다."

		switch (reason) {
			case "invalidChannelSelected": {
				description =
					"선택하신 채널은 [포럼 채널](https://support.discord.com/hc/ko/articles/6208479917079-포럼-채널-FAQ)이 아닙니다."
				break
			}

			case "invalidOperationSelected": {
				description = "선택하신 작업은 올바른 작업이 아닙니다."
				break
			}
		}

		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "정보공유 채널 설정 실패",
					description,
				}),
			],
			ephemeral: true,
		})
	}
}
