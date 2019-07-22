//                                             - command - ranks       - desc
// -------------------------------+          1 - help    - everyone    - help
// ------------------------------+|          2 - reload  - pq          - hot reload format
// -----------------------------+||          4 - id      - pq, officer - test command
// ----------------------------+|||          8 - token   - pq, officer - test command
// ---------------------------+||||         16 - 
// --------------------------+|||||         32 - 
// -------------------------+||||||         64 - 
// ------------------------+|||||||        128 - 
// -----------------------+||||||||        256 - 
// ----------------------+|||||||||        512 - 
// ---------------------+||||||||||       1024 - 
// --------------------+|||||||||||       2048 - 
// -------------------+||||||||||||       4096 - 
// ------------------+|||||||||||||       8192 - 
// -----------------+||||||||||||||      16384 - 
// ----------------+|||||||||||||||      32768 - 
// ---------------+||||||||||||||||      65536 - 
// --------------+|||||||||||||||||     131072 - 
// -------------+||||||||||||||||||     262144 - 
// ------------+|||||||||||||||||||     524288 - 
// -----------+||||||||||||||||||||    1048576 - 
// ----------+|||||||||||||||||||||    2097152 - 
// ---------+||||||||||||||||||||||    4194304 - 
// --------+|||||||||||||||||||||||    8388608 - 
// -------+||||||||||||||||||||||||   16777216 - 
// ------+|||||||||||||||||||||||||   33554432 - 
// -----+||||||||||||||||||||||||||   67108864 - 
// ----+|||||||||||||||||||||||||||  134217728 - 
// ---+||||||||||||||||||||||||||||  268435456 - 
// --+|||||||||||||||||||||||||||||  536870912 - 
// -+|||||||||||||||||||||||||||||| 1073741824 - 
// +||||||||||||||||||||||||||||||| 2147483648 - 
// 00000000000000000000000000001111

// rank    - binary - number
// pq      - 1110   - 14
// officer - 1100   - 12

const pqCommandParser = require ('./pqCommandParser')

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

		this.commandparser = new pqCommandParser ()
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
		return this.commandparser.parse (str, this.commands, this.aliases)
	}

	parse (format, permission, prx, cmd, args, ..._) {

		const commandclass = this.commands [cmd]

		if ((this.permissions [cmd] & permission) != 0) {
			return commandclass.run (format, args, ..._)
		}

		return commandclass.error (format, args, ..._)
	}
}

module.exports = pqCommandManager