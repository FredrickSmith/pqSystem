
module.exports = (env) => {
	const noperm  = env  .noperm
	const command = env  .command
	const pqID    = env._.Tokeniser

	const id = new pqID ('chinese', 2^64)

	command.add ('discord', 'link', ['Link', 'l'], 'Randomly generated token', 8,
		(args, msg) => {
			msg.author.send ('this is ur linking code, enter it within 10mins or youll have to restart the process')
			return msg.author.send (id.gen ())
		}, noperm
	)
}