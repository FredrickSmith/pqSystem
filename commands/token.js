
module.exports = (client, channel, resolve, reject, command, send, noperm, F, pqID) => {
	const id = new pqID ()

	command.addcommand ('discord', 'token', ['Token', 't'], 'Randomly generated token', 1,
		msg => {
			return send (id.token ())
		}, noperm
	)
}