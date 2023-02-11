import { EmbedBuilder } from "@discordjs/builders"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import type { ChatInputCommandInteraction } from "discord.js"

import { createUser, setUserDiscordID } from "../lib/firebase"
import { CreateUserFailReason } from "../lib/firebase/createUser"

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

		// create user
		const createUserResult = await createUser(uid)
		if (!createUserResult.success)
			return this.replyInvalidUID(interaction, createUserResult.reason)

		// set user discord ID
		setUserDiscordID(uid, interaction.user.id)

		// return feedback
		this.replySuccess(interaction)
	}

	async replyInvalidUID(
		interaction: ChatInputCommandInteraction,
		reason?: CreateUserFailReason
	) {
		let description =
			"본인 인증 코드가 우효하지 않습니다. </가입:1069853137529208852> 후 이용해주세요."

		if (reason === CreateUserFailReason.USER_ALREADY_EXISTS)
			description =
				"인증이 이미 완료되었습니다. 재인증을 받기 위해선 관리자에게 연락하세요."

		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "본인 인증 실패!",
					description,
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
