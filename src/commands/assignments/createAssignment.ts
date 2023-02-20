import { EmbedBuilder } from "@discordjs/builders"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import { ChatInputCommandInteraction } from "discord.js"
import { PermissionFlagsBits } from "discord.js"

import { setAssignment } from "../../lib/firebase"
import { Assignment } from "../../types/assignments"

const Options = {
	assignmentName: "과제-이름",
	repoName: "repository-이름",
	filePath: "파일-경로",
}

export class PostingChannelConfigCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options })
	}

	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("과제-생성")
				.setDescription("새로운 과제 생성")
				.addStringOption((option) =>
					option
						.setName(Options.assignmentName)
						.setDescription("생성할 과제의 이름")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName(Options.repoName)
						.setDescription("과제 제출 확인시 확인할 github repository 이름")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName(Options.filePath)
						.setDescription("과제 제출 확인시 확인할 파일의 경로")
						.setRequired(true)
				)
				.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		const assignmentName = interaction.options.getString(Options.assignmentName)
		if (!assignmentName)
			return this.replyFail(interaction, "과제 이름이 누락되었습니다.")

		const repoName = interaction.options.getString(Options.repoName)
		if (!repoName)
			return this.replyFail(interaction, "파일 경로가 누락되었습니다.")

		const filePath = interaction.options.getString(Options.filePath)
		if (!filePath)
			return this.replyFail(interaction, "repository 이름이 누락되었습니다.")

		const assignmentData: Assignment = {
			name: assignmentName,
			repository: repoName,
			filePath,
		}

		// create assignment
		await setAssignment(assignmentData)

		this.replySuccess(interaction, assignmentData)
	}

	public async replyFail(
		interaction: ChatInputCommandInteraction,
		reason: string
	): Promise<void> {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "과제 생성 실패!",
					description: reason,
				}),
			],
		})
	}

	public async replySuccess(
		interaction: ChatInputCommandInteraction,
		assignmentData: Assignment
	): Promise<void> {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "과제 생성 성공!",
					description: `**과제 이름** - ${assignmentData.name}
**repository 이름** - ${assignmentData.repository}
**파일 경로** - ${assignmentData.filePath}`,
				}),
			],
			ephemeral: true,
		})
	}
}
