
module.exports = (env) => {
	const command = env.command
	const send    = env.send
	const noperm  = env.noperm
	const pqID    = env.pqID

	const id = new pqID ('hex')

	command.add ('discord', 'id', ['ID', 'i'], 'Randomly generated token', 4,
		(args, msg) => {
			return send (id.id ())
		}, noperm
	)

	command.add ('discord', 'token', ['Token', 't'], 'Randomly generated token', 4,
		(args, msg) => {
			return send (id.token ())
		}, noperm
	)
}