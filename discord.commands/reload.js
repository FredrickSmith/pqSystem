
module.exports = (env) => {
	const resolve   = env.resolve
	const command   = env.command
	const event     = env.event
	const send      = env.send
	const noperm    = env.noperm

	const kill = () => {process.exit ()}
	const done = () => {resolve ('reload')}
	const fake = () => {}

	command.add ('discord', 'kill', [], 'Kills the bots process', 2,
		()=> {
			return send ('please dont do this', kill, kill)
		}, noperm
	)

	command.add ('discord', 'reload', ['Reload', 'r'], 'Reloads the bot', 2,
		(args, msg) => {
			if ((args [0] == 'permission') || (args [0] == 'permissions')) {
				event.run ('reload:permission')

				return send ('ok reloaded permissions', fake, fake)
			}
			if ((args [0] == 'command') || (args [0] == 'commands')) {
				event.run ('reload:command')

				return send ('ok reloaded commands', fake, fake)
			}
			if ((args [0] == 'event') || (args [0] == 'events')) {
				event.run ('reload:event')

				return send ('ok reloaded events', fake, fake)
			}
			if ((args [0] == 'module') || (args [0] == 'modules')) {
				event.run ('reload:module')

				return send ('ok reloaded modules', fake, fake)
			}
			event.run ('reload:all')

			return send ('ok reloading everything', done, done)
		}, noperm
	)
}