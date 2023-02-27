import { EmbedBuilder } from "@discordjs/builders"
import type { ChatInputCommand } from "@sapphire/framework"
import { Command } from "@sapphire/framework"
import { ChatInputCommandInteraction } from "discord.js"
import { PermissionFlagsBits } from "discord.js"

import { listAssignments } from "../../lib/firebase"
import { Assignment } from "../../types/assignments"

const Options = {
	showClosed: "마감된-과제-보이기",
}

export class PostingChannelConfigCommand extends Command {
	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName("과제-나열")
				.setDescription("등록된 과제 나열")
				.addBooleanOption((option) =>
					option
						.setName(Options.showClosed)
						.setDescription("마감된 과제 보이기 (기본: 보이지 않기)")
				)
				.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
				.setDMPermission(false)
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		const showClosed = !!interaction.options.getBoolean(Options.showClosed)

		await this.replySuccess(interaction, showClosed)
	}

	/**
	 * Returns a paginated list of assignment descriptions.
	 * Discord embed description has a character length of 4096.
	 */
	public formatAssignments(assignments: {
		[assignmentID: string]: Assignment
	}): string[] {
		const result: string[] = [""]

		let index = 0
		for (const assignmentID in assignments) {
			const assignment = assignments[assignmentID]

			const str = `**이름** - ${assignment.name}
**ID** - ${assignmentID}
**GitHub 레포 이름** - ${assignment.repository}
**파일 경로** - ${assignment.filePath}
**인원** - ${assignment.members.length}명 (\`</과제-제출-확인>\`으로 확인)
**마감** - ${assignment.closed}

`

			if (result[index].length + str.length >= 4096) {
				index += 1
				result[index] = str
			} else {
				result[index] += str
			}
		}

		return result
	}

	public async replySuccess(
		interaction: ChatInputCommandInteraction,
		showClosed: boolean
	): Promise<void> {
		const assignments = await listAssignments(showClosed)
		const assignmentDescriptions = this.formatAssignments(assignments)

		await interaction.reply("등록된 과제를 나열합니다")

		for (const [i, assignmentDescription] of assignmentDescriptions.entries())
			await interaction.channel?.send({
				embeds: [
					new EmbedBuilder({
						title: `등록된 과제 리스트 ${i + 1}/${
							assignmentDescriptions.length
						}`,
						description: assignmentDescription,
					}),
				],
			})
	}
}
