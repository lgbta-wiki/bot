/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApplyOptions } from '@sapphire/decorators'
import { Args, CommandOptions, container as iContainer } from '@sapphire/framework'
import { Message } from 'discord.js'
import util, { promisify } from 'util'
import { exec } from 'child_process'
import { tokens } from '../../config/config'
import { reply } from '@sapphire/plugin-editable-commands'
import RainCommand from '../../structures/RainCommand'

@ApplyOptions<CommandOptions>({
	name: 'eval',
	aliases: ['ev'],
	description: 'run code',
	preconditions: ['ownerOnly'],
})
export class EvalCommand extends RainCommand {
	public override async messageRun(message: Message, args: Args) {
		const codetoeval = await args.rest('string')

		let codeToEval = `(async () => {${codetoeval}})()`
		if (!codetoeval.includes('await') && !codetoeval.includes('return')) codeToEval = codetoeval
		if (codetoeval.includes('await') && !codetoeval.includes('return')) codeToEval = `(async () => { return ${codetoeval}})()`

		const { output, success } = await EvalCommand.runCode(codeToEval, message)

		await reply(message, {
			embeds: [
				{
					title: 'Eval Output',
					color: success ? 0x00ff00 : 0xff0000,
					fields: [
						{ name: 'Input', value: `\`\`\`js\n${codetoeval}\`\`\`` },
						{ name: 'Output', value: await this.formatOutput(output) },
					],
				},
			],
		})
	}

	async formatOutput(output: string): Promise<string> {
		if (!output) return `\`\`\`js\n${EvalCommand.cleanOutput(output)}\`\`\``
		if (EvalCommand.cleanOutput(output).length >= 1000) {
			return await this.container.utils.haste(EvalCommand.cleanOutput(output))
		} else return `\`\`\`js\n${EvalCommand.cleanOutput(output)}\`\`\``
	}

	static cleanOutput(output: string) {
		for (const key of Object.keys(tokens)) {
			output = output.replaceAll(tokens[key as keyof typeof tokens], `tokens.${key}`)
		}

		return output
	}

	static async runCode(code: string, message?: Message) {
		let output
		let success
		try {
			const container = iContainer

			const inspect = util.inspect,
				utils = container.utils,
				client = container.client,
				settings = container.settings,
				user = message?.author,
				member = message?.member,
				guild = message?.guild,
				channel = message?.channel,
				sh = promisify(exec),
				inviteRegex = /((https?:\/\/)?(discord\.gg|discord\.com\/invite)\/)(?<code>([a-zA-Z0-9]{2,}))/g,
				emojiRegex = /(?:<:|<a:)\w{1,64}:(?<id>\d{17,18})>/g

			output = inspect(await eval(code), { depth: 0 })
			success = true
		} catch (err) {
			output = err.message
			success = false
		}

		return {
			output,
			success,
		}
	}
}
