const fs = require ('fs')

const pqLex = require ('./pqLex')

class pqCommandParser extends pqLex {
	constructor () {
		super ()

		this.prefix = {
			'!': true,
			'/': true,
		}

		this.whitespace = {
			' ': true,
			'	': true,
		}
		this.string = {
			'\'': true,
			'\"': true,
			'\`': true,
		}
		this.eos = {
			'': true
		}
	}

	parse (str, cmds, als) {
		this.pos = 0
		this.txt = str

		const prefix = this.lookahead (0)
		// const prefix = this.lookaheaduntil ('', 0, (c, pos) => {if (this.prefix [c] || this.eos [c] || this.whitespace [c]) return 0}, true)

		if (!this.prefix [prefix])
			return [false, '', '', []]

		const cmd = this.lookaheaduntil ('', 1, (c, pos) => {if (this.eos [c] || this.whitespace [c]) return 0})
		const realcmd = cmds [cmd] ? cmd : als [cmd]

		if (!realcmd)
			return [false, prefix, cmd, []]

		let argument = []
		while (true) {
			if (this.pos >= str.length) break

			const _c = this.lookahead (0)

			if (this.whitespace [_c]) {
				this.lookaheaduntil (_c, 1, (c, pos)=>{if (!this.whitespace [c]) return -1})
			} else if (this.string [_c]) {
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
				argument.push (this.lookaheaduntil (_c, 1, (c, pos) => {if (this.eos [c] || this.whitespace [c]) return -1}))
			}

			this.pos++
		}
		return [true, prefix, realcmd, argument]
	}
}

module.exports = pqCommandParser