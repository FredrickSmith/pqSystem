
module.exports = (client, channel, resolve, reject, command, send, noperm, F, pqID) => {
	command.addcommand ('discord', 'reload', ['Reload', 'r'], 'Reloads the bot', 1,
		msg => {
			return send ('ok reloading', ()=>{resolve ('reload')}, ()=>{resolve ('reload')})
		}, noperm
	)
}