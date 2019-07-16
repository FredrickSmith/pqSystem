const crypto = require ('crypto'    )
const F      = require ('sprintf-js').sprintf

class pqID {
	constructor (type = 'chinese') {
		this.__t = type
	}
	
	get type ( ) {return this.__t    }
	set type (t) {        this._t = t}

	generator (num, size) {
		if (!num) return crypto.randomBytes (size).toString ('hex').toUpperCase ()

		let arr = [];
		for (i = 0; i < num; i++) {
			arr.push (crypto.randomBytes (size).toString ('hex').toUpperCase ())
		}

		return arr
	}

	chinese (arr) {
		let chinese = ''
		for (let pointer = 1; pointer < arr.length; pointer += 2) {
			chinese += String.fromCharCode (parseInt (F ('0x95%s', arr.substr (pointer - 1, 2))))
		}
	
		return chinese
	}
	hex (arr) {
		return arr
	}

	token (num = !1) {
		let arr = this.generator (num, 2^64)

		if (this.__t == 'chinese') return this.chinese (arr)
		if (this.__t == 'hex'    ) return this.hex     (arr)
	}
	id (num = !1) {
		let arr = this.generator (num, 2^16)

		if (this.__t == 'chinese') return this.chinese (arr)
		if (this.__t == 'hex'    ) return this.hex     (arr)
	}
}

module.exports = pqID