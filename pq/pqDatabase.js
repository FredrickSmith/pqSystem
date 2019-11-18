const fs  = require ('fs')
const sql = require ('mysql')

class pqDatabase {
	constructor () {
		this.c = sql.createConnection ({
			host    : 'localhost',
			user    : fs.readFileSync ('./data/user.sql'),
			password: fs.readFileSync ('./data/password.sql')
		})

		this.c.connect (e => {
			if (e)
				return // console.log ('connect no work :(', e)

			// console.log ('we connected!')
			this.c.query ('USE pq;', ()=>{})
		})

		this.c.on ('error', e => {
			// console.log ('error')
		})
	}

	query (q, c) {
		this.c.query (q, c)
	}
}

module.exports = pqDatabase