
module.exports = (env) => {
	const send        = env  .send
	const noperm      = env  .noperm
	const command     = env  .command
	const client      = env  .pqDiscord.dc
	const F           = env._.F        .sprintf
	const fs          = env._.fs
	const pqJWT       = env._.JWT
	const pqDatabase  = env._.Database
	const pqID        = env._.Tokeniser
	const pqSnowFlake = env._.Snowflake

	const gid  = new pqID        ('hex', (2^63) + 3)
	const jwt  = new pqJWT       (fs.readFileSync ('./data/public.key'), fs.readFileSync ('./data/private.key'))
	const db   = new pqDatabase  ()
	const snow = new pqSnowFlake ()

	db.query ('CREATE TABLE IF NOT EXISTS pqusr (sf VARCHAR(24) PRIMARY KEY, r VARCHAR(32));', () => {})
	db.query ('CREATE TABLE IF NOT EXISTS pqs_di (sf VARCHAR(24), cid VARCHAR(18) PRIMARY KEY, FOREIGN KEY (sf) REFERENCES pqusr(sf));', () => {})
	db.query ('CREATE TABLE IF NOT EXISTS pqs_gu (sf VARCHAR(24), i VARCHAR (128), id VARCHAR(128) PRIMARY KEY, FOREIGN KEY (sf) REFERENCES pqusr(sf))', () => {})

	command.add ('discord', '&u', [], 'create user', 4,
		async (args, msg) => {
			const cid = args [0].match (/\d+/) [0]

			let [e1, r, f] = await db.query ('SELECT sf FROM pqs_di WHERE cid = ?;', [cid])
			if (e1) return send (e.sqlMessage)

			if (!r) return send ('no r')
			if (r [0] && r [0].sf) return send ('user exists already')

			const sf = snow.cold ().toString ()

			let [e2] = await db.query ('INSERT INTO pqusr (sf, r) VALUES (?, ?);', [sf, 'user'])
			if (e2) return send (e.sqlMessage)

			let [e3] = await db.query ('INSERT INTO pqs_di (sf, cid) VALUES (?, ?);', [sf, cid])
			if (e3) return send (e.sqlMessage)

			send (F ('created user sf:`%s` cid:`%s`', sf, cid))
		}
	)
	command.add ('discord', '&g', [], 'create guest user', 4,
		async (args, msg) => {
			const id = gid.gen ()
			const sf = snow.cold ().toString ()

			let [e1] = await db.query ('INSERT INTO pqusr (sf, r) VALUES (?, ?);', [sf, 'guest'])
			if (e1) return send (e.sqlMessage)

			let [e2] = await db.query ('INSERT INTO pqs_gu (sf, i, id) VALUES (?, ?, ?)', [sf, args [0], id])
			if (e2) return send (e.sqlMessage)

			send (F ('created guest sf:`%s` id:`%s` info:`%s`', sf, id, args [0]))
		}
	)

	command.add ('discord', '*u', [], 'gen token for user', 4,
		async (args, msg) => {
			const cid = args [0].match (/\d+/) [0]

			let [e, r] = await db.query ('SELECT sf FROM pqs_di WHERE cid = ?;', [cid])
			if (e) return send (e.sqlMessage)

			if (!r) return send ('no r')
			if (!r [0] && !r [0].sf) return send ('no user')

			const token = jwt.sign ({sf : r [0].sf})
			const user = await client.fetchUser (cid)

			await user.send (F ('Here is your token for use across the pqIndustries services.\nDO NOT SHARE THIS WITH ANYONE', token)).catch (() => {})
			await user.send (F ('```\n%s```', token)).catch (() => {})

			await msg.author.send (F ('Generated a token for `%s#%s`.', user.username, user.discriminator)).catch (() => {})
			await msg.author.send (F ('```\n%s```', token)).catch (() => {})
		}, noperm
	)
	command.add ('discord', '*g', [], 'gen token for guest', 4,
		async (args, msg) => {
			let [e, r] = await db.query ('SELECT sf, i FROM pqs_gu WHERE id = ?;', [args [0]])

			if (e) return send (e.sqlMessage)

			if (!r) return send ('no r')
			if (!r [0] && !r [0].sf) return send ('no user')

			const token = jwt.sign ({sf : r [0].sf})

			await msg.author.send (F ('Generated a token for `%s` info:`%s`.', args [0], r [0].i)).catch (() => {})
			await msg.author.send (F ('```\n%s```', token)).catch (() => {})
		}, noperm
	)
}