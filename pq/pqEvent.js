
class pqEvent {
	constructor (event, name, efunc, priority) {
		this._event    = event
		this._name     = name
		this._priority = priority

		this.efunc = efunc
	}

	run (..._) {return this.efunc (..._)}
}

class pqEventManager {
	constructor () {
		this._events = {}
		this._cache  = {}
	}

	add (event, name, efunc, priority = 4) {
		if (!this._events [event])
			this._events [event] = [[], [], [], [], []]

		if (!this._cache [event])
			this._cache [event] = {}

		if (this._cache [event] [name]) {
			const cache = this._cache [event] [name]

			this._events [event] [cache [0]].splice (cache [1])
		}

		this._cache [event] [name] = [
			priority,
			this._events [event] [priority].length
		]

		this._events [event] [priority].push (new pqEvent (event, name, efunc, priority))
	}

	remove (event, name) {
		const cache = this._cache [event] [name]

		delete this._cache  [event] [name]
		this._events [event] [cache [0]].splice (cache [1])
	}

	run (event, ..._) {
		const ea = this._events [event]

		if (!ea) return

		let r
		for (let a = 0; a <= 4; a++) {
			const ec = ea [a]

			if (ec.length == 0) continue

			for (let b = 0; b <= ec.length - 1; b++) {
				try {
					r = ec [b].run (..._)
				} catch (e) {
					console.log ('event error', e)
				}
			}
		}

		return r
	}
}

module.exports = pqEventManager