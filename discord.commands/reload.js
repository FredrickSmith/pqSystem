
module.exports = (env) => {
	const client    = env.client
	const resolve   = env.resolve
	const reject    = env.reject
	const command   = env.command
	const send      = env.send
	const noperm    = env.noperm
	const permparse = env.permparse
	const discord   = env.pqDiscord

	const done = () => {resolve ('reload')}
	const fake = () => {}

	command.addcommand ('discord', 'reload', ['Reload', 'r'], 'Reloads the bot', 2,
		(args, msg) => {
			if (args [0] == 'permission') {
				discord.permissions = permparse.loadfile ('./discord.permission')
				return send ('ok reloaded permissions', fake, fake)
			}
			if (args [0] == 'command') {
				discord.addcommands (client, resolve, reject)
				return send ('ok reloaded commands', fake, fake)
			}
			if (args [0] == 'event') {
				discord.addevents (client, resolve, reject)
				return send ('ok reloaded events', fake, fake)
			}
			return send ('ok reloading everything', done, done)
		}, noperm
	)
}