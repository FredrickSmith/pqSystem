
module.exports = (env) => {
	const command = env.command
	const send    = env.send
	const noperm  = env.noperm
	const pqID    = env.pqID

	const id = new pqID ()

	command.addcommand ('discord', 'id', ['ID', 'i'], 'Randomly generated token', 4,
		msg => {
			return send (id.id ())
		}, noperm
	)
}