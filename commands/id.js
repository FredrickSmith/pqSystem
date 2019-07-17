
module.exports = (client, channel, resolve, reject, command, send, noperm, F, pqID) => {
	const id = new pqID ()

	command.addcommand ('discord', 'id', ['ID', 'i'], 'Randomly generated token', 1,
		msg => {
			return send (id.id ())
		}, noperm
	)
}