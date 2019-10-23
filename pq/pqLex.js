class pqLex {
	constructor () {
		this.pos = 0
	}

	lookahead (len) {
		return this.txt.substring (this.pos + len, this.pos + len + 1)
	}

	lookbehind (len) {
		return this.txt.substring (this.pos - len, this.pos + len - 1)
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

	lookbehinduntil (tkn, pos, cause, spos = false) {
		while (true) {
			const t = this.lookbehind (pos)
			const num = cause (t, pos)

			if (num || (num == 0)) {
				if (!spos) {
					this.pos += (pos + num)
				}

				break
			}
			tkn += t
			pos--
		}

		return tkn
	}

	finish () {
		this.pos = 0
		this.txt = ''
	}
}

module.exports = pqLex