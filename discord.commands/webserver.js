
module.exports = (env) => {
	const command = env  .command
	const event   = env  .event
	const send    = env  .send
	const noperm  = env  .noperm
	const F       = env._.F.sprintf

	const app  = require ('express') ()
	const http = require ('http'   )

	let srv

	command.add ('discord', 'wsstart', ['wss'], 'start webserver', 32,
		(args, msg) => {
			srv = http.createServer (app)

			srv.on ('error', (e) => {return send (F ('port in use: `%s`', e))})

			srv.listen (args [0] || 0xBBBE);

			srv.on ('error', (e) => {return console.log (F ('module `discord` message `webserver error with: %s`', e))})
			srv.on ('close', ( ) => {return send ('webserver ended')})

			app.get ('/req/:a', (req, res) => {
				send (F ('```lua\nheaders: %s\ncookies: %s\nparams: %s\nquery: %s\npath: %s\nremote: %s - %s:%s```',
					JSON.stringify (req.headers),
					req.headers.cookie,
					JSON.stringify (req.params),
					JSON.stringify (req.query),
					req.path,
					req.connection.remoteFamily,
					req.connection.remoteAddress,
					req.connection.remotePort
				))

				return res.send ('hi')
			})

			app.get ('/req', (req, res) => {
				return res.send ('hi?')
			})

			app.get ('/*', (_, res) => {return res.send ('hi')})
			app.get ('/' , (_, res) => {return res.send ('hi')})

			return send (F ('server listening on?: %s', args [0] || 0xBBBE))
		}, noperm
	)

	command.add ('discord', 'wsend', ['wse'], 'end webserver', 32,
		(args, msg) => {
			if (!(srv === undefined) && srv.listening)
				srv.close ()
		}, noperm
	)

	event.add ('reload:command', 'ws:close', () => {
		if (!(srv === undefined) && srv.listening) srv.close ()

		srv = undefined
	})
	event.add ('reload:all', 'ws:close', () => {
		if (!(srv === undefined) && srv.listening) srv.close ()

		srv = undefined
	})
}