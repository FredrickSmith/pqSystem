
class pqModule {
	constructor (name, file) {
		this._n = name
		this._f = file

		this._m = ''
	}

	get name ( ) {return this._n    }
	set name (_) {       this._n = _}

	create (bclass, ..._) {
		delete require.cache [require.resolve (this._f)]

		try {
			if (bclass) {
				this._m = new (require (this._f)) (..._)
			} else {
				this._m = require (this._f)
			}
		} catch {}

		return this._m
	}

	start (..._) {
		return this._m.start (..._)
	}
}

class pqModuleManager {
	constructor (name) {
		this._n = name

		this._o = {}
		this.__o = 0

		this._m = {}
		this._e = {
			pqModuleManager: this
		}
	}

	DefineModule (type, order, args, bclass) {
		this._o [order] = [type, args, bclass]

		this.__o += 1

		return this
	}

	Module (type, name, file) {
		this._m [type] = this._m [type] ? this._m [type] : {}
		this._m [type] [name] = new pqModule (name, file)

		return this
	}

	Reload (type, name, bstart = false) {
		let modules = this._m [type]

		for (let module in modules) {
			module = modules [module]

			if (module._n == name)
				this._e [module.name] = module.create ()
		}

		if (bstart) {
			for (let module in modules) {
				module = modules [module]

				if (module._n == name)
					this._e [module].start (this.__e, ..._)
			}
		}
	}

	ReloadType (type, bstart = false) {
		let modules = this._m [type]

		for (let module in modules) {
			module = modules [module]

			this._e [module.name] = module.create ()
		}

		if (bstart) {
			for (let module in modules) {
				module = modules [module]

				this._e [module].start (this.__e, ..._)
			}
		}
	}

	ReloadAll (type) {
		let modules = this._m [type]

		for (let module in modules) {
			let bmodule = modules [module]

			bmodule.create ()

			this._e [bmodule.name] = bmodule._m
		}
	}

	Start (..._) {

		for (let n = 0; n < this.__o; n++) {
			let o = this._o [n]
			let modules = this._m [o [0]]

			for (let module in modules) {
				module = modules [module]

				if ((o [1] & 2) != 0) {
					this._e [module.name] = module.create (o [2], this._e)
				} else if ((o [1] & 4) != 0) {
					this._e [module.name] = module.create (o [2], ..._)
				} else if ((o [1] & 8) != 0) {
					this._e [module.name] = module.create (o [2], this._e, ..._)
				} else {
					this._e [module.name] = module.create (o [2])
				}
			}
		}

		let modules = this._m [this._o [this.__o - 1] [0]]
		for (let module in modules) {
			try {
				this._e [module].start (this.__e, ..._)
			} catch {}
		}
	}
}

module.exports = pqModuleManager