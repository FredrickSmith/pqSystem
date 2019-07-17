//                                                     - discord            - teamspeak3
// pq      -------------------------------+          1 - 600261179826503680 - 
// officer ------------------------------+|          2 - 599877756834152450 - 
// zarp    -----------------------------+||          4 - 600261181214818305 - 
// user    ----------------------------+|||          8 - 
//         ---------------------------+||||         16 - 
//         --------------------------+|||||         32 - 
//         -------------------------+||||||         64 - 
//         ------------------------+|||||||        128 - 
//         -----------------------+||||||||        256 - 
//         ----------------------+|||||||||        512 - 
//         ---------------------+||||||||||       1024 - 
//         --------------------+|||||||||||       2048 - 
//         -------------------+||||||||||||       4096 - 
//         ------------------+|||||||||||||       8192 - 
//         -----------------+||||||||||||||      16384 - 
//         ----------------+|||||||||||||||      32768 - 
//         ---------------+||||||||||||||||      65536 - 
//         --------------+|||||||||||||||||     131072 - 
//         -------------+||||||||||||||||||     262144 - 
//         ------------+|||||||||||||||||||     524288 - 
//         -----------+||||||||||||||||||||    1048576 - 
//         ----------+|||||||||||||||||||||    2097152 - 
//         ---------+||||||||||||||||||||||    4194304 - 
//         --------+|||||||||||||||||||||||    8388608 - 
//         -------+||||||||||||||||||||||||   16777216 - 
//         ------+|||||||||||||||||||||||||   33554432 - 
//         -----+||||||||||||||||||||||||||   67108864 - 
//         ----+|||||||||||||||||||||||||||  134217728 - 
//         ---+||||||||||||||||||||||||||||  268435456 - 
//         --+|||||||||||||||||||||||||||||  536870912 - 
//         -+|||||||||||||||||||||||||||||| 1073741824 - 
//         +||||||||||||||||||||||||||||||| 2147483648 - 
//         00000000000000000000000000001111

class pqCommand {
	constructor (name, aliases, description, permission, format, pfunc, efunc) {
		this._name        = name
		this._aliases     = aliases
		this._description = description
		this._permission  = permission

		this.pcommand = {}
		this.pcommand [format] = pfunc

		this.ecommand = {}
		this.ecommand [format] = efunc
	}

	get name        ( ) {return this._name           }
	set name        (_) {       this._name        = _}
	get aliases     ( ) {return this._aliases        }
	set aliases     (_) {       this._aliases     = _}
	get description ( ) {return this._description    }
	set description (_) {       this._description = _}

	addformat (format, pfunc, efunc) {
		this.pcommand [format] = pfunc
		this.ecommand [format] = efunc
	}

	run (format, ..._) {
		return this.pcommand [format] (..._)
	}

	error (format, ..._) {
		return this.ecommand [format] (..._)
	}
}

class pqCommandManager {
	constructor () {
		this._commands    = {}
		this.aliases      = {}
		this.permissions  = {}

		this.prefix       = {
			'!': true,
			'/': true,
		}
	}

	get commands ( ) {return this._commands    }
	set commands (_) {       this._commands = _}

	addcommand (format, name, aliases = [], description, permission, funcperm, funcnoperm) {
		if (this.commands [name]) {
			this.commands [name].addformat (format, funcperm, funcnoperm)
		} else {
			this.commands [name] = new pqCommand (name, aliases, description, permission, format, funcperm, funcnoperm)

			for (let alias in aliases) {
				this.aliases [aliases [alias]] = name
			}

			this.permissions [name] = permission
		}
	}

	iscommand (str) {
		if (!this.prefix [str.substr (0, 1)]) return false

		let command = str.split (' ') [0].substr (1)

		return this.commands [command] || this.aliases [command]
	}

	parse (format, permission, str, ..._) {
		let command = str.split (' ') [0].substr (1)

		command = this.commands [command] ? command : this.aliases [command]

		let commandclass = this.commands [command]

		if ((this.permissions [command] & permission) != 0) {
			return commandclass.run (format, ..._)
		}

		return commandclass.error (format, ..._)
	}
}

module.exports = pqCommandManager