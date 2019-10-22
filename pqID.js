const crypto = require ('crypto'    )
const F      = require ('sprintf-js').sprintf

class pqID {
	constructor (type = 'chinese', length = 2^16) {
		this.__t = type
		this.__l = length

		this.__c = ''
	}
	
	get type ( ) {return this.__t    }
	set type (t) {        this._t = t}

	generator (num, size) {
		if (!num) {
			this.__c = crypto.randomBytes (size).toString ('hex').toUpperCase ()
			return this
		}

		let arr = []
		for (let i = 0; i < num; i++) {
			arr.push (crypto.randomBytes (size).toString ('hex').toUpperCase ())
		}

		this.__c = arr.join ('')

		return this
	}

	chinese () {
		let chinese = ''
		for (let pointer = 1; pointer < this.__c.length; pointer += 2) {
			chinese += String.fromCharCode (parseInt (F ('0x95%s', this.__c.substr (pointer - 1, 2))))
		}
	
		this.__c = chinese

		return this
	}

	gen (num = !1) {
		this.generator (num, this.__l)

		if (this.__t == 'chinese') this.chinese ()

		return this.__c
	}
}

module.exports = pqID