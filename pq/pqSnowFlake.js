
class pqSnowflake {
	constructor () {
		this.checksum = 0b10101010n
		this.id       = 0n
		this.count    = 0n

		this.olddate  = Date.now ()
	}

	cold () {
		let flake = this.checksum
		let epoch = Date.now ()

		this.count   = (this.olddate == epoch) ? this.count : 0n
		this.olddate = epoch

		flake = flake <<  72n | BigInt (epoch)
                      <<   8n | 0n
                      <<  16n | 0n
                      <<   8n | this.id
                      <<  16n | this.count

		this.count += 1n

		return flake
	}
}

module.exports = pqSnowflake