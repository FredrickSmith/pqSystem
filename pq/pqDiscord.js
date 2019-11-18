
class pqDiscord {
	constructor (env) {
		this._command          = env.Command
		this._event            = env.Event
		this._permissionparser = env.PermissionParser

		this._env = env

		this._F       = env.F.sprintf
		this._fs      = env.fs
		this._discord = env.discord

		this.permissions = this._permissionparser.loadfile ('./data/discord.permission')

		return this
	}

	permission (client) {
		let num = 0

		client.roles.forEach (role => {num = num | (this.permissions [role.id] || 0)})

		return num | 1
	}

	addcommands (client, resolve, reject) {
		const command = this._command

		const channeldev = this._fs.readFileSync ('./data/discord.devchannel')
		let channel = client.channels.last ()

		client.channels.forEach (_channel => {
			if (_channel.id == channeldev) {
				channel = _channel
				return true
			}
		})

		const send   = (str, thn = ()=>{}, cth = ()=>{}) => {
			return channel.send (str)
				.then  (thn)
				.catch (cth)
		}
		const noperm = (args, msg) => {
			return send (this._F ('%s : No permission.', this._F ('<@%s>', msg.author.id)))
		}

		this._fs.readdir ('./discord.commands', 'utf8', (err, str) => {
			if (err)
				return reject ('no commands')

			str.forEach (file => {
				const filename = this._F ('../discord.commands/%s', file)

				delete require.cache [require.resolve (filename)]
				try {
					require (filename) ({
						client : client ,
						channel: channel,
						resolve: resolve,
						reject : reject ,
						command: command,
						send   : send   ,
						noperm : noperm ,

						event    : this._event           ,
						permparse: this._permissionparser,
						pqDiscord: this                  ,

						_: this._env
					})
				} catch (e) {
					console.log (this._F ('module `discord` message `couldnt load: %s : %s`', file, e))
				}
			})
		})
	}

	addevents (client, resolve, reject) {
		const command = this._command

		this._fs.readdir ('./discord.events', 'utf8', (err, str) => {
			if (err)
				return reject ('no events')

			str.forEach (file => {
				const filename = this._F ('../discord.events/%s', file)

				delete require.cache [require.resolve (filename)]
				try {
					require (filename) ({
						client : client ,
						resolve: resolve,
						reject : reject ,
						command: command,

						event    : this._event           ,
						permparse: this._permissionparser,
						pqDiscord: this                  ,

						_: this._env
					})
				} catch (e) {
					console.log (this._F ('module `discord` message `couldnt load: %s : %s`', file, e))
				}
			})
		})
	}

	start () {
		return new Promise ((resolve, reject) => {
			this.dc = new this._discord.Client ()
			this.__r__ = resolve

			const client = this.dc

			client.on ('error', err => {
				if (err.error.code == 'ETIMEDOUT')
					return reject ('timeout')

				if (err.error.code == 'ENOTFOUND')
					return reject ('timeout')
				
				return reject (err.error.code)
			})

			client.on ('ready', () => {
				console.log (this._F ('module `discord` message `ready with: %s - %s`', client.user.username, client.user.id))

				this.addcommands (client, resolve, reject)
				this.addevents   (client, resolve, reject)
			})

			client.on ('message', msg => {
				if (client.user.id == msg.author.id) return
				if (msg.content    == ''           ) return

				const txt = this._F ('module `discord` with `%s` in `%s` with `%s`', this._F ('%s#%s', msg.author.username, msg.author.discriminator), msg.guild ? msg.guild.name : 'dm', msg.content)

				console.log (txt)
				this._event.run ('discord:log', txt)

				if (!msg.guild || msg.guild.id != '599853945438994442') return

				const cmd = this._command

				const [iscommand, prefix, command, args] = cmd.is (msg.content)
				try {
					if (iscommand) {
						return cmd.parse ('discord', this.permission (msg.member), prefix, command, args, msg)
				 	} else if (prefix != '') {
						return msg.channel.send (this._F ('%s: Invalid command: `%s%s`', this._F ('<@%s>', msg.author.id), prefix, command))
							.then  (()=>{})
							.catch (()=>{})
					}
				} catch (e) {
					console.log (this._F ('module `discord` message `command errored: %s - %s`', msg.content, e))
				}
			})

			this._fs.readFile ('./data/discord.token', 'utf8', (err, data) => {
				if (err)
					return reject ('no token')

				console.log (this._F ('module `discord` message `starting with: %s`', data))

				client.login (data)
					.catch (()=>{
						reject ('no login')
					})
			})
		})
		.then (reason => {
			console.log (this._F ('module `discord` message `finished good with: %s`', reason))

			this.dc.destroy ()

			if (reason == 'reload') return this.start ()
			if (reason == 'stop'  ) return console.log ('module `discord` message `stop`')
		})
		.catch (reason => {
			console.log (this._F ('module `discord` message `finished bad with: %s`', reason))

			this.dc.destroy ()

			if (this._event.run ('discord:finishbad', reason)) {
				console.log ('module `discord` message `timeout`')

				return setTimeout (() => {this.start ()}, 30000)
			}

			if (reason == 'no login'   ) return this.start ()
			if (reason == 'timeout'    ) return this.start ()
			if (reason == 'no commands') return console.log ('module `discord` message `no: discord.commands`')
			if (reason == 'no events'  ) return console.log ('module `discord` message `no: discord.events'   )
			if (reason == 'no token'   ) return console.log ('module `discord` message `no: discord.token`'   )
		})
	}

	stop () {
		if (this.dc)
			this.__r__ ('stop')
	}
}


module.exports = pqDiscord