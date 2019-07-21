
class pqModule {
	constructor (name, module) {
		this._n = name
		this._m = module
	}

	get name ( ) {return this._n    }
	set name (_) {       this._n = _}

	create (..._) {
		this._m = new this._m (..._)

		return this._m
	}

	start (..._) {
		return this._m.start ()
	}
}

class pqModuleManager {
	constructor (name) {
		this._n = name

		this._m = {}
	}

	Module (type, name, module) {
		this._m [type] = this._m [type] ? this._m [type] : {}
		this._m [type] [name] = new pqModule (name, module)
	}

	Start () {
		let env     = {}
		let modules = {}

		modules = this._m ['Base']
		for (let module in modules) {
			let bmodule = modules [module]
			bmodule.create ()

			env [bmodule.name] = bmodule._m
		}

		modules = this._m ['Module']
		for (let module in modules) {
			let mmodule = modules [module]

			mmodule.create (env).start ()
		}
	}
}

module.exports = pqModuleManager