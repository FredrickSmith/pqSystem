
const fs      = require ('fs'        )
const F       = require ('sprintf-js').sprintf
const discord = require ('discord.js')

const pqID = require ('./pqID.js')

class pqDiscord {
	constructor (command, event) {
		this.__c = command
		this.__e = event

		this.__p = {
			'600261179826503680': 14, // pq
			'599877756834152450': 12, // officer
			'600261181214818305': 0 , // zarp
		}
	}

	permission (client) {
		let num = 0

		client.roles.forEach (role => {num = num | (this.__p [role.id] || 0)})

		return num | 1
	}

	addcommands (client, resolve, reject) {
		const command = this.__c

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

		fs.readdir ('./commands', 'utf8', (err, str) => { // hot loading oh boy
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
				}) // env ? better ?
			})
		})
	}

	addevents (client) {
 
	}

	start () {
		return new Promise ((resolve, reject) => {
			this._c = new discord.Client ()

			this._c.on ('ready', () => {
				this.addcommands (this._c, resolve, reject)
				this.addevents   (this._c, resolve, reject)
				console.log (F ('discord ready %s', this._c.user.username))
			})

			this._c.on ('message', msg => {
				if (!msg.guild || msg.guild.id != '599853945438994442') return
				if (this._c.user.id == msg.author.id                  ) return
				if (msg.content     == ''                             ) return

				console.log (F ('module `discord` with `%s` in `%s` with `%s`', F ('%s#%s', msg.author.username, msg.author.discriminator), msg.guild ? msg.guild.name : 'dm', msg.content))

				if (this.__c.iscommand (msg.content))
					return this.__c.parse ('discord', this.permission (msg.member), msg.content, msg)

				// msg.channel.send (msg.content).then  (() => {}).catch (() => {})
			})

			fs.readFile ('discord.token', 'utf8', (err, data) => {
				console.log (F ('discord start? %s', data))
				this._c.login (data)
					.catch (()=>{
						reject ('no login')
					})
			})
		})
		.then (reason => {
			console.log (F ('discord finished with `%s`', reason))

			this._c.destroy ()

			if (reason == 'reload') this.start ()
		})
		.catch (reason => {
			console.log (F ('discord finished with `%s`', reason))

			this._c.destroy ()

			if (reason == 'no login') this.start ()
			if (reason == 'reload'  ) this.start ()
		})
	}
}


module.exports = pqDiscord