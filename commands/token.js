
module.exports = (env) => {
	const command = env.command
	const send    = env.send
	const noperm  = env.noperm
	const pqID    = env.pqID

	const id = new pqID ()

	command.addcommand ('discord', 'token', ['Token', 't'], 'Randomly generated token', 8,
		msg => {
			return send (id.token ())
		}, noperm
	)
}