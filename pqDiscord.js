
const fs      = require ('fs'        )
const F       = require ('sprintf-js').sprintf
const discord = require ('discord.js')

const pqID = require ('./pqID.js')

class pqDiscord {
	constructor (env) {
		this._command          = env.Command
		this._event            = env.Event
		this._permissionparser = env.PermissionParser

		this.permissions = this._permissionparser.loadfile ('./discord.permission')

		return this
	}

	permission (client) {
		let num = 0

		client.roles.forEach (role => {num = num | (this.permissions [role.id] || 0)})

		return num | 1
	}

	addcommands (client, resolve, reject) {
		const command = this._command

		let channel = client.channels.last ()

		client.channels.forEach (_channel => {
			if (_channel.id == '600609099008311306') {
				channel = _channel
				return true
			}
		})

		const send   = (str, thn = ()=>{}, cth = ()=>{}) => {
			return channel.send (str)
				.then  (thn)
				.catch (cth)
		}
		const noperm = msg => {
			return send (F ('%s : No permission.', F ('<@%s>', msg.author.id)))
		}

		fs.readdir ('./discord.commands', 'utf8', (err, str) => {
			if (err)
				return reject ('no commands')

			str.forEach (file => {
				const filename = F ('./discord.commands/%s', file)

				delete require.cache [require.resolve (filename)]
				require (filename) ({
					client : client ,
					channel: channel,
					resolve: resolve,
					reject : reject ,
					command: command,
					send   : send   ,
					noperm : noperm ,
					F      : F      ,
					pqID   : pqID   ,

					event  : this._event           ,
					perms  : this._permissionparser,
					discord: this                  ,
				})
			})
		})
	}

	addevents (client, resolve, reject) {
 
	}

	start () {
		return new Promise ((resolve, reject) => {
			this.dc = new discord.Client ()

			const client = this.dc

			client.on ('error', err => {
				if (err.error.code == 'ETIMEDOUT')
					return reject ('timeout')

				if (err.error.code == 'ENOTFOUND')
					return reject ('timeout')
				
				return reject (F ('discord messed up with `%s`', err.error.code))
			})

			client.on ('ready', () => {
				console.log (F ('discord ready with `%s` `%s`', client.user.username, client.user.id))

				this.addcommands (client, resolve, reject)
				this.addevents   (client, resolve, reject)
			})

			client.on ('message', msg => {
				if (client.user.id == msg.author.id) return
				if (msg.content    == ''           ) return

				console.log (F ('module `discord` with `%s` in `%s` with `%s`', F ('%s#%s', msg.author.username, msg.author.discriminator), msg.guild ? msg.guild.name : 'dm', msg.content))

				if (!msg.guild || msg.guild.id != '599853945438994442') return

				const [iscommand, prefix, command, args] = this._command.iscommand (msg.content)

				if (iscommand)
					return this._command.parse ('discord', this.permission (msg.member), prefix, command, args, msg)

				// msg.channel.send (msg.content).then  (() => {}).catch (() => {})
			})

			fs.readFile ('discord.token', 'utf8', (err, data) => {
				if (err)
					return reject ('no token')

				console.log (F ('discord starting with `%s`', data))

				client.login (data)
					.catch (()=>{
						reject ('no login')
					})
			})
		})
		.then (reason => {
			console.log (F ('discord finished good with `%s`', reason))

			this.dc.destroy ()

			if (reason == 'reload') this.start ()
		})
		.catch (reason => {
			console.log (F ('discord finished bad  with `%s`', reason))

			this.dc.destroy ()

			if (reason == 'no login'   ) this.start ()
			if (reason == 'timeout'    ) this.start ()
			if (reason == 'no commands') console.log ('discord no discord.commands') // this.start ()
			if (reason == 'no token'   ) console.log ('discord no discord.token'   ) // this.start ()
		})
	}
}


module.exports = pqDiscord