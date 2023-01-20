import { ChatInputCommand, Command } from "@sapphire/framework"
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js"

export class PingCommand extends Command {
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
		const embed = await this.generateEmbed(interaction)

		await interaction.reply({
			embeds: [embed],
			fetchReply: true,
		})
	}

	async generateEmbed(
		interaction: ChatInputCommandInteraction
	): Promise<EmbedBuilder> {
		const embed = new EmbedBuilder({
			title: `${interaction.user.username}님의 프로필`,
			// url: "<profile URL>",
			description: `#XXX위 (상위 X.XX%)
포인트: XXXX
👍 XXX 👎 XX`,
			fields: [
				{
					name: "개발",
					value: `뱃지: X개 (\`/뱃지\`)
`,
				},
				{
					name: "활동",
					value: `지난 X주간...
메세지: XXX개
포스팅: XXX개 + 좋아요 XXX개`,
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

		return embed
	}
}
