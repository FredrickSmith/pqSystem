
class pqModule {
	constructor (name, file) {
		this._n = name
		this._f = file

		this._m = ''
	}

	get name ( ) {return this._n    }
	set name (_) {       this._n = _}

	create (..._) {
		delete require.cache [require.resolve (this._f)]
		this._m = new (require (this._f)) (..._)

		return this._m
	}

	start (..._) {
		return this._m.start (..._)
	}
}

class pqModuleManager {
	constructor (name) {
		this._n = name

		this._m = {}
		this._e = {}
	}

	Module (type, name, file) {
		this._m [type] = this._m [type] ? this._m [type] : {}
		this._m [type] [name] = new pqModule (name, file)

		return this
	}

	Reload (type, name) {
		let modules = this._m [type]

		for (let module in modules) {
			let bmodule = modules [module]

			if (bmodule._n == name) {
				bmodule.create ()

				this._e [bmodule.name] = bmodule._m
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
		let modules

		modules = this._m ['Backware']
		for (let module in modules) {
			module = modules [module]

			module.create (..._)

			this._e [module.name] = module._m
		}
		modules = this._m ['Middleware']
		for (let module in modules) {
			module = modules [module]
			
			module.create (..._)

			this._e [module.name] = module._m
		}

		modules = this._m ['Frontware']
		for (let module in modules) {
			module = modules [module]

			module.create (this._e)
		}

		for (let module in modules) {
			module = modules [module]

			module.start (this._e, ..._)
		}
	}
}

module.exports = pqModuleManager