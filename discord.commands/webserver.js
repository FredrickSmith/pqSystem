
module.exports = (env) => {
	const command = env.command
	const send    = env.send
	const noperm  = env.noperm
	const F       = env.F

	const app  = require ('express') ()
	const http = require ('http'   )

	let srv

	command.addcommand ('discord', 'wsstart', ['wss'], 'start webserver', 32,
		(args, msg) => {
			srv = http.createServer (app)

			try {
				srv.listen (0xBBB8);
			} catch (e) {
				return send (F ('port in use: %s', 0xBBB8) )
			}

			app.get ('/req', (req, res) => {
				console.log (req)
				return res.send ('hi')
			})

			app.get ('/res', (req, res) => {
				console.log (res)
				return res.send ('hi')
			})

			app.get ('/', (req, res) => {
				return res.send ('hi')
			})
		}, noperm
	)
}