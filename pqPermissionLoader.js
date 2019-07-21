const fs = require ('fs')

const pqLex = require ('./pqLex')

class pqPermissionLoader extends pqLex {
	constructor () {
		super ()
	}

	fspc (c, pos) {if ( c == ' ')                return -1}
	fend (c, pos) {if ((c == '\n') || (c == '')) return  0}

	parse (file) {
		this.pos = 0
		this.txt = file

		let perms = {}
		while (true) {
			if (this.pos >= file.length) break

			perms [this.lookaheaduntil ('', 0, this.fspc)] = parseInt (this.lookaheaduntil ('', 2, this.fspc))

			this.lookaheaduntil ('', 1, this.fend)

			this.pos++
		}
		return perms
	}

	loadfile (filename) {
		return this.parse (fs.readFileSync (filename, 'utf8'))
	}
}

module.exports = pqPermissionLoader