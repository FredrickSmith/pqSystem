
module.exports = (env) => {
	const command     = env  .command
	const send        = env  .send
	const noperm      = env  .noperm
	const pqID        = env._.Tokeniser
	const pqSnowFlake = env._.Snowflake

	const custom = new pqID ('hex', 1   )
	const name   = new pqID ('hex', 2^8 )
	const id     = new pqID ('hex', 2^16)
	const token  = new pqID ('hex', 2^64)

	const snow = new pqSnowFlake ()

	command.add ('discord', '_gn', [], '', 4, (args, msg) => {return send (name .gen ())}, noperm)
	command.add ('discord', '_gi', [], '', 4, (args, msg) => {return send (id   .gen ())}, noperm)
	command.add ('discord', '_gt', [], '', 4, (args, msg) => {return send (token.gen ())}, noperm)

	command.add ('discord', '_gc', [], '', 4, (args, msg) => {return send (custom.gen (parseInt (args [0])))}, noperm)

	command.add ('discord', 'snowflake', ['Snowflake', 'snowFlake', 'SnowFlake', 'sf'], 'snowing', 4,
		(args, msg) => {
			return send (snow.cold ().toString (16).toUpperCase ())
		}, noperm
	)
}