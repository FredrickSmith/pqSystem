
module.exports = (env) => {
	const resolve = env.resolve
	const command = env.command
	const send    = env.send
	const noperm  = env.noperm

	const done = () => {resolve ('reload')}

	command.addcommand ('discord', 'reload', ['Reload', 'r'], 'Reloads the bot', 2,
		msg => {
			return send ('ok reloading', done, done)
		}, noperm
	)
}