
const fs      = require ('fs'        )
const F       = require ('sprintf-js').sprintf
const discord = require ('discord.js')

const pqID = require ('./pqID.js')

class pqDiscord {
	constructor (env) {
		this._command  = env.Command
		this._event  = env.Event
		this._permloader = env.PermissionLoader

		this.permissions = this._permloader.loadfile ('./discord.permission')

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

		fs.readdir ('./commands', 'utf8', (err, str) => {
			if (err)
				return console.log ('discord no commands')

			str.forEach (file => {
				const filename = F ('./commands/%s', file)

				delete require.cache [require.resolve (filename)]
				require (filename) ({
					client : client,
					channel: channel,
					resolve: resolve,
					reject : reject,
					command: command,
					send   : send,
					noperm : noperm,
					F      : F,
					pqID   : pqID,
				})
			})
		})
	}

	addevents (client) {
 
	}

	start () {
		return new Promise ((resolve, reject) => {
			this.dc = new discord.Client ()

			this.dc.on ('error', err => {
				return reject (err.error.code)
			})

			this.dc.on ('ready', () => {
				this.addcommands (this.dc, resolve, reject)
				this.addevents   (this.dc, resolve, reject)
				console.log (F ('discord ready with `%s` `%s`', this.dc.user.username, this.dc.user.id))
			})

			this.dc.on ('message', msg => {
				if (this.dc.user.id == msg.author.id) return
				if (msg.content     == ''           ) return

				console.log (F ('module `discord` with `%s` in `%s` with `%s`', F ('%s#%s', msg.author.username, msg.author.discriminator), msg.guild ? msg.guild.name : 'dm', msg.content))

				if (!msg.guild || msg.guild.id != '599853945438994442') return

				if (this._command.iscommand (msg.content))
					return this._command.parse ('discord', this.permission (msg.member), msg.content, msg)

				// msg.channel.send (msg.content).then  (() => {}).catch (() => {})
			})

			fs.readFile ('discord.token', 'utf8', (err, data) => {
				console.log (F ('discord starting with `%s`', data))
				this.dc.login (data)
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

			if (reason == 'no login' ) this.start ()
			if (reason == 'ETIMEDOUT') this.start ()
		})
	}
}


module.exports = pqDiscord