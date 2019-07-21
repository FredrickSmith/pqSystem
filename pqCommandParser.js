const fs = require ('fs')

const pqLex = require ('./pqLex')

class pqCommandParser extends pqLex {
	constructor () {
		super ()
	}

	parse (file) {
		this.pos = 0
		this.txt = file

		let argument = []
		while (true) {
			if (this.pos >= file.length) break

			const _c = this.lookahead (0)

			if ((_c == ' ') || (_c == '	')) {
				this.lookaheaduntil (_c, 1, (c, pos)=>{if (!((c == ' ') || (c == '	'))) return -1})
			} else if ((_c == '\'') || (_c == '"')) {
				argument.push (this.lookaheaduntil ('', 1, (c, pos)=>{
					if (_c == c) {
						if (this.lookbehind (-pos + 1) == '\\') {
							const slashes = this.lookbehinduntil ('\\', pos - 1, (c, pos) => {return c != '\\'})

							if ((slashes.length % 2) == 1) {
								return 0
							}

							return
						}
						return 0
					} else if (c == '') {
						return 0
					}
				}))
			} else {
				argument.push (this.lookaheaduntil (_c, 1, (c, pos) => {if ((c == '') || (c == ' ') || (c == '	')) return -1}))
			}

			this.pos++
		}
		return argument
	}
}

module.exports = pqCommandParser