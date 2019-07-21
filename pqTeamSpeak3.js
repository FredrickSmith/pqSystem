const TeamSpeak3 = require ('ts3-nodejs-library')

class pqTeamSpeak3 {
	constructor (env) {
		this.__c = env.Command
		this.__e = env.Event

		return this
	}

	start () {
	// 	return new Promise ((resolve, reject) => {
	// 		this._c = new TeamSpeak3 ({})

	// 		this._c.on ('ready', () => {
	// 			console.log ('teamspeak ready')
	// 		})

	// 		this._c .on ('clientconnect', ({ client }) => {
	// 			let channelname = ''
	// 			client.on ('move', channel => {
	// 				channelname = channel.name
	// 			})
	// 			client.on ('message', msg => {
	// 				console.log (F ('module `ts3` with `%s` in `%s` with `%s`', client.nickname, channelname, msg.content))

	// 				if (this.__c.iscommand (msg.content)) return this.__c.parse ('ts3', msg)
	// 			})
	// 		  })

	// 		this._c.login (ok).catch (()=>{
	// 			reject ('no login')
	// 		})
	// 	})
	// 	.then (reason => {
	// 		console.log (F ('ts3 finished with `%s`', reason))
	// 	})
	// 	.catch (reason => {
	// 		console.log (F ('ts3 finished with `%s`', reason))

	// 		if (reason == 'no login') this.start ()
	// 		if (reason == 'restart' ) this.start ()
	// 	})
	}
}


module.exports = pqTeamSpeak3