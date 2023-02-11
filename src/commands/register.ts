import { EmbedBuilder } from "@discordjs/builders"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import type { ChatInputCommandInteraction } from "discord.js"

import { fetchUserDocument, setUserDiscordID } from "../lib/firebase"

const optionName = "코드"

export class RegisterCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options })
	}

	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("등록")
				.setDescription("본인 인증 코드로 등록")
				.addStringOption((option) =>
					option
						.setName(optionName)
						.setDescription("본인 인증 코드")
						.setRequired(true)
				)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		// get UID from command input

		const uid = interaction.options.getString(optionName)
		if (!uid) return this.replyInvalidUID(interaction)

		// fetch user data

		const user = await fetchUserDocument(uid)
		if (!user || !user.exists) return this.replyInvalidUID(interaction)

		// set user discord ID

		setUserDiscordID(uid, interaction.user.id)

		// return feedback

		this.replySuccess(interaction)
	}

	async replyInvalidUID(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "본인 인증 실패!",
					description: "본인 인증 코드가 우효하지 않습니다.",
				}),
			],
			ephemeral: true,
		})
	}

	async replySuccess(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "등록 완료!",
					description: "</프로필:1065974421203976202> 커맨드를 이용해보세요",
				}),
			],
			ephemeral: true,
		})
	}
}
