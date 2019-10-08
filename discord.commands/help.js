
module.exports = (env) => {
	const command = env.command
	const send    = env.send
	const noperm  = env.noperm
	const F       = env.F

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

	command.add ('discord', 'd2?', [], 'conversion from dec/hex/bin to dec/hex/bin', 1,
		(args, msg) => {
			return send (parseInt(args [0], args [2] || 10).toString (parseInt (args [1])))
		}, noperm
	)
}