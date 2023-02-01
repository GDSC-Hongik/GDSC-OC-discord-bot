import { EmbedBuilder } from "@discordjs/builders"
import { ChatInputCommand, Command } from "@sapphire/framework"
import { ChatInputCommandInteraction } from "discord.js"

export class RegisterCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options })
	}

	public override registerApplicationCommands(
		registry: ChatInputCommand.Registry
	) {
		registry.registerChatInputCommand((builder) =>
			builder.setName("가입").setDescription("가입")
		)
	}

	public async chatInputRun(interaction: ChatInputCommandInteraction) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder({
					title: "링크를 눌러 로그인하세요",
					description:
						process.env.TESTING === "true"
							? "http://localhost:5173"
							: process.env.SIGN_UP_URL,
				}),
			],
			ephemeral: true,
		})
	}
}
