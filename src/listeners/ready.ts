import { ApplyOptions } from '@sapphire/decorators'
import { Listener, ListenerOptions } from '@sapphire/framework'

@ApplyOptions<ListenerOptions>({
	once: true,
	event: 'ready',
})
export class ReadyListener extends Listener {
	async run() {
		await this.loadTasks()
		this.container.logger.info(`Logged in as ${this.container.client.user?.tag}`)
	}

	async loadTasks() {
		const taskStore = this.container.stores.get('tasks')

		await taskStore.registerTasks()
		this.container.logger.info('Loaded tasks.')
	}
}
