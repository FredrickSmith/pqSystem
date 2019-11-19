
module.exports = (env) => {
	const send        = env  .send
	const noperm      = env  .noperm
	const command     = env  .command
	const client      = env  .pqDiscord.dc
	const fs          = env._.fs
	const pqJWT       = env._.JWT
	const pqID        = env._.Tokeniser
	const pqSnowFlake = env._.Snowflake

	const custom = new pqID        ('hex', 1   )
	const name   = new pqID        ('hex', 2^8 )
	const id     = new pqID        ('hex', 2^16)
	const token  = new pqID        ('hex', 2^64)
	const jwt    = new pqJWT       (fs.readFileSync ('./data/public.key'), fs.readFileSync ('./data/private.key'))
	const snow   = new pqSnowFlake ()

	command.add ('discord', '*>', [], 'gens token', 4,
		async (args, msg) => {
			const id  = args [0].match (/\d+/) [0]

			const token = jwt.sign ({sf : snow.cold ().toString ()})

			const user = await client.fetchUser (id)

			await user.send (F ('Here is your token for use across the pqIndustries services.\nDO NOT SHARE THIS WITH ANYONE', token))
				.catch (() => {})
			await user.send (F ('```\n%s```', token))
				.catch (() => {})

			await msg.author.send (F ('Generated a token for `%s#%s`.', user.username, user.discriminator))
				.catch (() => {})
			await msg.author.send (F ('```\n%s```', token))
				.catch (() => {})

		}, noperm
	)

	command.add ('discord', '_gn', [], 'name' , 4, (args, msg) => {return send (name .gen ())}, noperm)
	command.add ('discord', '_gi', [], 'id'   , 4, (args, msg) => {return send (id   .gen ())}, noperm)
	command.add ('discord', '_gt', [], 'token', 4, (args, msg) => {return send (token.gen ())}, noperm)

	command.add ('discord', '_gc', [], 'custom', 4, (args, msg) => {return send (custom.gen (parseInt (args [0])))}, noperm)

	command.add ('discord', '_sf', [], 'snow', 4,
		(args, msg) => {
			return send (snow.cold ().toString (16).toUpperCase ())
		}, noperm
	)
}