
module.exports = (env) => {
	const command = env.command
	const send    = env.send
	const noperm  = env.noperm
	const pqID    = env.pqID

	const id = new pqID ('chinese')

	command.add ('discord', 'link', ['Link', 'l'], 'Randomly generated token', 8,
		(args, msg) => {
			msg.author.send ('this is ur linking code, enter it within 10mins or youll have to restart the process')
			return msg.author.send (id.token ())
		}, noperm
	)
}