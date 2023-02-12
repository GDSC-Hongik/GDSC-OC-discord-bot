import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import type { ChatInputCommandInteraction } from "discord.js"
import { EmbedBuilder } from "discord.js"
import type { DocumentSnapshot } from "firebase-admin/firestore"

import { fetchUserDocument, snowflake2UID } from "../lib/firebase"
import type { User } from "../types/user"

export class ProfileCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options })
	}

	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder.setName("프로필").setDescription("사용자의 프로필을 보여줍니다")
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		const uid = await snowflake2UID(interaction.user.id)
		if (!uid) return await this.replyUnregisteredAccount(interaction)

		const userDoc = await fetchUserDocument(uid)
		if (!userDoc || !userDoc.exists)
			return await this.replyUnregisteredAccount(interaction)

		return await this.replyProfile(interaction, userDoc)
	}

	async replyUnregisteredAccount(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "등록된 계정이 없습니다!",
					description: `이 디스코드 계정에 연동된 계정이 없습니다.
<${process.env.SIGN_UP_URL}>에서 회원가입 후 </등록:1072386843506651197> 커맨드를 이용해 계정을 연동시켜주세요`,
				}),
			],
			fetchReply: true,
		})
	}

	async replyProfile(
		interaction: ChatInputCommandInteraction,
		userDoc: DocumentSnapshot<User>
	) {
		const userData = userDoc.data()
		if (!userData) return await this.replyUnregisteredAccount(interaction)

		const embed = new EmbedBuilder({
			title: `${interaction.user.username}님의 프로필`,
			// url: "<profile URL>",
			description: `티어: ${this.formatData(userData.tier)}
DevRating: ${this.formatData(userData.devRating)}
포인트: ${this.formatData(userData.points)}`,
			fields: [
				{
					name: "활동",
					value: `출석: 총 ${this.formatData(userData.attendance.length)}일
포스팅: ${this.formatData(null)}개 + 좋아요 ${this.formatData(null)}개`,
				},
			],
		})
			.setThumbnail(interaction.user.avatarURL())
			.setTimestamp()

		if (interaction.guild && interaction.guild.name)
			embed.setFooter({
				text: interaction.guild?.name,
				iconURL: interaction.guild?.iconURL() || undefined,
			})

		await interaction.reply({
			embeds: [embed],
			fetchReply: true,
		})
	}

	formatData(data: unknown): string {
		let str = "???"

		if (data) {
			str = String(data)
		} else {
			if (data === 0) str = "0"
			if (data === false) str = "false"
		}

		return `**${str}**`
	}
}
