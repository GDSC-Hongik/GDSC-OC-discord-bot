import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import type { ChatInputCommandInteraction } from "discord.js"
import { EmbedBuilder } from "discord.js"

import { calculateDevRating } from "../lib/devRating"
import { botCache, getUser, snowflake2UID } from "../lib/firebase"
import { AchievementNames, Achievements } from "../types/achievements"
import { Tier, tierSchema } from "../types/tier"
import type { User } from "../types/user"

export class ProfileCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options })
	}

	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("프로필")
				.setDescription("사용자의 프로필을 보여줍니다")
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		const uid = snowflake2UID(interaction.user.id)
		if (!uid) return await this.replyUnregisteredAccount(interaction)

		const user = await getUser(uid)
		if (!user) return await this.replyUnregisteredAccount(interaction)

		return await this.replyProfile(interaction, user)
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

	async replyProfile(interaction: ChatInputCommandInteraction, user: User) {
		const devRating = await calculateDevRating(user)
		const lastAttendance = user.attendance.at(-1)
			? `(마지막 출석: ${user.attendance.at(-1)})`
			: ""

		const embed = new EmbedBuilder({
			title: `${interaction.user.username}님의 프로필`,
			// url: "<profile URL>",
			description: `티어: ${this.formatTier(devRating.tier)}
DevRating: ${this.formatData(devRating.points)}
포인트: ${this.formatData(user.points)}`,
			fields: [
				{
					name: "활동",
					value: `출석: 총 ${this.formatData(
						user.attendance.length
					)}일 ${lastAttendance}
포스팅: ${this.formatData(user.posts.length)}개`,
				},
				{
					name: "업적 (달성 순서대로)",
					value: this.formatAchievements(user.achievements),
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

	formatTier(tier: Tier): string {
		if (tier === "UNRANKED") return "UNRANKED"

		return Object.keys(tierSchema.enum)
			.map((elem) => {
				if (elem === "UNRANKED") return undefined
				return elem === tier ? `__**${elem}**__` : elem
			})
			.filter((elem) => elem !== undefined)
			.join(" / ")
	}

	formatAchievements(achievements: Achievements[]): string {
		let str = ""

		achievements.forEach((achievement) => {
			str += `- ${AchievementNames[achievement]} (${botCache.data.achievementPoints[achievement]}점)\n`
		})

		return str
	}
}
