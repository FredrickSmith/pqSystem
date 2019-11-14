
const a = require ('child_process')

const b = _ => {
	console.log (_.toString ().replace ('\n', ''))
}

const c = () => {
	const d = a.spawn ('node', ['pq'])

	d.stdout.on ('data', b)
	d.stderr.on ('data', b)

	d.on ('close', _ => {
		console.log (`pq died`)
		c ()
	})
}

c ()