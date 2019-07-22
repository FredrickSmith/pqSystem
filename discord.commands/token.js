
module.exports = (env) => {
	const command = env.command
	const send    = env.send
	const noperm  = env.noperm
	const pqID    = env.pqID

	const id = new pqID ('hex')

	command.addcommand ('discord', 'id', ['ID', 'i'], 'Randomly generated token', 4,
		(args, msg) => {
			return send (id.id ())
		}, noperm
	)

	command.addcommand ('discord', 'token', ['Token', 't'], 'Randomly generated token', 8,
		(args, msg) => {
			return send (id.token ())
		}, noperm
	)
}