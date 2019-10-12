
module.exports = (env) => {
	const command = env.command
	const send    = env.send
	const noperm  = env.noperm
	const pqID    = env.pqID

	const id = new pqID ('hex')

	delete require.cache [require.resolve ('../pqSnowFlake')] // fuck u honestly
	const snow = require ('../pqSnowFlake')

	const blizzard = new snow ()

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

	command.add ('discord', 'snowflake', ['Snowflake', 'snowFlake', 'SnowFlake', 'sf'], 'snowing', 4,
		(args, msg) => {
			return send (blizzard.cold ().toString (16))
		}, noperm
	)
}