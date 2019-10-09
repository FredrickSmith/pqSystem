
module.exports = (env) => {
	const client    = env.client
	const resolve   = env.resolve
	const reject    = env.reject
	const command   = env.command
	const event     = env.event
	const send      = env.send
	const noperm    = env.noperm
	const permparse = env.permparse
	const discord   = env.pqDiscord

	const done = () => {resolve ('reload')}
	const fake = () => {}

	command.add ('discord', 'reload', ['Reload', 'r'], 'Reloads the bot', 2,
		(args, msg) => {
			if (args [0] == 'permission') {
				event.run ('reload:permission')

				discord.permissions = permparse.loadfile ('./data/discord.permission')
				return send ('ok reloaded permissions', fake, fake)
			}
			if ((args [0] == 'command') || (args [0] == 'commands')) {
				event.run ('reload:command')

				discord.addcommands (client, resolve, reject)
				return send ('ok reloaded commands', fake, fake)
			}
			if ((args [0] == 'event') || (args [0] == 'events')) {
				event.run ('reload:event')

				discord.addevents (client, resolve, reject)
				return send ('ok reloaded events', fake, fake)
			}
			event.run ('reload:all')

			return send ('ok reloading everything', done, done)
		}, noperm
	)
}