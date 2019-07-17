
module.exports = (client, channel, resolve, reject, command, send, noperm, F, pqID) => {
	command.addcommand ('discord', 'help', ['h'], 'help please', 8,
		msg => {
			const commands = command.commands

			let str = '```js\npq\n'
			for (let cmd in commands) {
				cmd = commands [cmd]
				str += F ('!%s [%s]:\n\t%s\n', cmd.name, cmd.aliases.join (), cmd.description)
			}
			str += '\n```'

			return send (str)
		}, noperm // ok?
	)
}