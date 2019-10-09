
module.exports = (env) => {
	const event  = env.event
	const client = env.client

	const fs      = require ('fs'        )

	const logchannelid = fs.readFileSync ('./data/discord.logchannel')

	let logchannel = false

	client.channels.forEach (_channel => {
		if (_channel.id == logchannelid) {
			logchannel = _channel
			return true
		}
	})

	if (!logchannel)
		return console.log ('module `discord` message `no logchannel?`')

	event.add ('discord:log', 'log:log', msg => {
		return logchannel.send (msg).then  (() => {}).catch (() => {})
	})
}