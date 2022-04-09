import { container, SapphireClient } from '@sapphire/framework'
import Utilities from '../functions/utilities'
import * as config from '../config/config'
import RainLogger from '../functions/logging'
import { RainTaskStore } from './RainTaskStore'
import { ApplicationCommandOptionData, Snowflake } from 'discord.js'

export class RainClient extends SapphireClient {
	public constructor(level: number) {
		super({
			caseInsensitiveCommands: true,
			caseInsensitivePrefixes: true,
			defaultPrefix: '-',
			intents: ['GUILDS'],
			loadDefaultErrorListeners: false,
			allowedMentions: { parse: [] },
			loadMessageCommandListeners: true,
			logger: {
				instance: new RainLogger(level),
			},
		})

		container.settings = config
		container.utils = new Utilities()

		this.stores.register(new RainTaskStore())
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		utils: Utilities
		settings: typeof config
	}
}

declare module '@sapphire/framework' {
	interface CommandOptions {
		slashOptions?: {
			options?: ApplicationCommandOptionData[]
			idHints?: Snowflake[]
			description?: string
			guildIDs?: Snowflake[]
		}
	}
	interface Command {
		slashOptions?: {
			options?: ApplicationCommandOptionData[]
			idHints?: Snowflake[]
			description?: string
			guildIDs?: Snowflake[]
		}
	}

	interface StoreRegistryEntries {
		tasks: RainTaskStore
	}
}
