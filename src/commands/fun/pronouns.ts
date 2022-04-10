import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction } from 'discord.js'
import RainCommand from '../../structures/RainCommand'
import { ArgsUser } from '../../types/misc'

@ApplyOptions<CommandOptions>({
	name: 'pronouns',
	aliases: ['pronouns'],
	description: 'see someones pronouns',
	preconditions: ['slashOnly'],
	slashOptions: {
		guildIDs: ['931713412256387143'],
		idHints: ['962802593606807552'],
		options: [
			{
				name: 'user',
				description: 'The user you want to know the pronouns of',
				type: 'STRING',
				required: true,
			},
		],
	},
})
export class PronounsCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		const args: { user: ArgsUser } = this.container.utils.parseInteractionArgs(interaction)

		const pronouns = await this.container.utils.getPronouns(args.user.user)

		await interaction.reply(`${pronouns}`)
	}
}
