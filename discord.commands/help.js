
module.exports = (env) => {
	const command = env.command
	const send    = env.send
	const noperm  = env.noperm
	const F       = env.F

	command.addcommand ('discord', 'help', ['h'], 'help please', 1,
		msg => {
			const commands = command.commands

			let str = '```\npq\n'
			for (let cmd in commands) {
				cmd = commands [cmd]
				str += F ('!%s [%s]:\n\t%s\n', cmd.name, cmd.aliases.join (), cmd.description)
			}
			str += '\n```'

			return send (str)
		}, noperm // ok?
	)
}