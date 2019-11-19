const fs  = require ('fs')
const sql = require ('mysql')

class pqDatabase {
	constructor () {
		this.c = sql.createConnection ({
			host    : 'localhost',
			user    : fs.readFileSync ('./data/user.sql'),
			password: fs.readFileSync ('./data/password.sql'),
			database: 'pq'
		})

		this.c.connect (e => {
			if (e)
				return console.log ('connect no work :(', e)

			console.log ('we connected!')
		})

		this.c.on ('error', e => {
			console.log ('error', e)
		})
	}

	query (q, foc, c) {
		return new Promise (rs => {
			this.c.query (q, foc, (a, b, c) => {
				rs ([a, b, c])
			})
		})
	}
}

module.exports = pqDatabase