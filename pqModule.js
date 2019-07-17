
class pqModule {
	constructor (name, module) {
		this.__n = name
		this.__m = module
	}

	create (..._) {
		this.__m = new this.__m (..._)
	}

	start (..._) {
		this.__m.start ()
	}
}

class pqModuleManager {
	constructor (name) {
		this.__n = name

		this.__m = {}
	}

	Module (type, name, module) {
		this.__m [type] = this.__m [type] ? this.__m [type] : {}
		this.__m [type] [name] = new pqModule (name, module)
	}

	Start () {
		for (module in this.__m ['Base']) {
			this.__m ['Base'] [module].create ()
		}

		for (module in this.__m ['Module']) {
			this.__m ['Module'] [module].create ( // how to unpack???
				this.__m ['Base'] ['Command'].__m,
				this.__m ['Base'] ['Event'  ].__m,
			)

			this.__m ['Module'] [module].start ()
		}
	}
}

module.exports = pqModuleManager