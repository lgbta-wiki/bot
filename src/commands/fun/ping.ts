import { ApplyOptions } from '@sapphire/decorators'
import { CommandOptions } from '@sapphire/framework'
import { CommandInteraction } from 'discord.js'
import RainCommand from '../../structures/RainCommand'

@ApplyOptions<CommandOptions>({
	name: 'ping',
	aliases: ['ping'],
	description: 'Get bot ping',
	preconditions: ['slashOnly'],
	slashOptions: {
		idHints: ['962802592818298920'],
		//</CommandOptions>options: [
		//{
		//	name: 'user',
		//	description: 'The user you want to know the pronouns of',
		//	type: 'STRING',
		//	required: true,
		//},
		//	],
	},
})
export class PronounsCommand extends RainCommand {
	public override async chatInputRun(interaction: CommandInteraction) {
		await interaction.reply(`Pong`)
	}
}
