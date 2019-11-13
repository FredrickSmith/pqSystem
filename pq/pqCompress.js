const F      = require ('sprintf-js').sprintf

class pqCompress {
	constructor () {
		this.a = [
			'a', 'b', 'c', 'd', 'e',
			'f', 'g', 'h', 'i', 'j',
			'k', 'l', 'm', 'n', 'o',
			'p', 'q', 'r', 's', 't',
			'u', 'v', 'w', 'x', 'y',
			'z', '0', '1', '2', '3',
			'4', '5', '6', '7', '8',
			'9', '-', '%', '_'
		]
		this.s_1 = [
			'32', '33', '34', '35', '36',
			'37', '38', '39', '3A', '3B',
			'3C', '3D', '3E', '3F', '40',
			'41', '42', '43', '44', '45',
			'46', '47', '48', '49', '4A',
			'4B', '4C', '4E', '4F', '50',
			'51', '52', '53', '54', '55',
			'56', '57', '58', '59', '5A',
			'5B', '5C', '5D', '5E', '5F',
			'60', '61', '62', '63', '64',
			'65', '66', '67', '68', '69',
			'6A', '6B', '6C', '6D', '6E',
		]
		this.s_2 = [
			'00', '01', '02', '03', '04',
			'05', '06', '07', '08', '09',
			'0A', '0B', '0C', '0D', '0E',
			'0F', '10', '11', '12', '13',
			'14', '15', '16', '17', '18',
			'19', '1A', '1B', '1C', '1D',
			'1E', '1F', '20', '21', '22',
			'23', '24', '25', '26', '27',
			'28', '29', '2A', '2B', '2C',
			'2D', '2E', '2F', '30', '31',
			'32', '34', '35', '36', '37',
			'38', '39', '3A', '3B', '3C',
		]

		this.d_1 = {}
		this.d_2 = {}
		this.e_1 = {}
		this.e_2 = {}

		let a = 0,
			b = 0,
			c = 0,
			d = 0

		for (let h of this.s_1)
			this.d_1 [h] = a++
		for (let h of this.s_2)
			this.d_2 [h] = b++

		for (let l of this.a) {
			this.e_1 [l] = c++
			this.e_2 [l] = d++
		}
	}

	encode (s) {
		s = s.toString ()
		let r = ''
		for (let n = 0; n < s.length; n += 2) {
			r += String.fromCharCode (parseInt (F ('0x%s%s', this.s_1 [this.e_1 [s [n]]], this.s_2 [this.e_2 [s [n + 1] || '_']])))
		}

		return r
	}
	decode (s) {
		let r = ''
		for (let n = 0; n < s.length; n++) {
			let c = s.charCodeAt (n).toString (16)
			r += this.a [this.d_1 [c.substring (0, 2).toUpperCase ()]] || ''
			r += this.a [this.d_2 [c.substring (2, 4).toUpperCase ()]] || ''
		}

		return r.replace ('_', '')
	}
}

module.exports = pqCompress