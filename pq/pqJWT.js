
const crypto = require ('crypto')

class pqJWT {
	constructor (ukey, ikey) {
		this.ukey = ukey
		this.ikey = ikey

		this.drep = {
			'-': '+',
			'_': '/'
		}
		this.erep = {
			'+': '-',
			'/': '_',
			'=': ''
		}
	}

	dbase64 (str) {
		return Buffer.from (str.replace (/[-_]/g, _=>{return this.drep [_]}), 'base64').toString ()
	}
	dstring64 (str) {
		return JSON.parse (this.dbase64 (str))
	}

	ebase64 (str) {
		return Buffer.from (str).toString ('base64').replace (/([=+/])/g, _=>{return this.erep [_]})
	}
	estring64 (arr) {
		return this.ebase64 (JSON.stringify (arr))
	}

	_sign (str) {
		return crypto.createSign ('RSA-SHA512').update (str).sign (this.ikey)
	}
	_verify (str, sig) {
		return crypto.createVerify ('RSA-SHA512').update (str).verify (this.ukey, sig)
	}

	sign (payload) {
		payload.iat = Date.now ()
		payload.exp = payload.iat + 2419200000

		const header    = this.estring64 ({alg: 'RS512'})
		      payload   = this.estring64 (payload)
		const signature = this.ebase64   (this._sign (header + '.' + payload))

		return header + '.' + payload + '.' + signature

	}
	decode (tkn) {
		const m = tkn.match (/^(.*?)\.(.+?)\.(.*?)$/)

		return [
			[
				this.dstring64 (m [1]),
				this.dstring64 (m [2]),
				this.dbase64   (m [3]),
			], [
				m [1],
				m [2],
				m [3]
			]
		]
	}
	verify (tkn) {
		const [d, e] = this.decode (tkn)

		if (this._verify (e [0] + '.' + e [1], d [2]))
			return [true, 'sig fail']

		if (d [1].iat ? d [1].iat > Date.now () : false)
			return [true, 'iat future']

		if (d [1].exp ? d [1].exp < Date.now () : false)
			return [true, 'exp past']

		return [false, d [1]]
	}
}

module.exports = pqJWT