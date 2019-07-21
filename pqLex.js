class pqLex {
	constructor () {}

	lookahead (len) {
		return this.txt.substring (this.pos + len, this.pos + len + 1)
	}

	lookaheaduntil (tkn, pos, cause, spos = false) {
		while (true) {
			const t = this.lookahead (pos)
			const num = cause (t, pos)

			if (num || (num == 0)) {
				if (!spos) {
					this.pos += (pos + num)
				}

				break
			}
			tkn += t
			pos++
		}

		return tkn
	}
}

module.exports = pqLex