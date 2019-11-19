
module.exports = (env) => {
	const send    = env  .send
	const noperm  = env  .noperm
	const command = env  .command
	const F       = env._.F.sprintf

	send ('started')

	command.add ('discord', 'help', ['Help', 'h'], 'help please', 1,
		(args, msg) => {
			const commands = command.commands

			let str = '```\npq\n'
			for (let cmd in commands) {
				cmd = commands [cmd]
				str += F ('!%s [%s]:\n\t%s\n', cmd.name, cmd.aliases.join (), cmd.description)
			}
			str += '\n```'

			return send (str)
		}, noperm
	)
}