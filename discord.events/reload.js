
module.exports = (env) => {
	const client    = env.client
	const resolve   = env.resolve
	const reject    = env.reject
	const event     = env.event
	const permparse = env.permparse
	const discord   = env.pqDiscord

	const module = env._.pqModuleManager

	event.add ('reload:permission', 'reload:permission', () => {
		discord.permissions = permparse.loadfile ('./data/discord.permission')
	}, 0)
	event.add ('reload:command'   , 'reload:command', () => {
		console.log ('??')
		discord.addcommands (client, resolve, reject)
	}, 0)
	event.add ('reload:event', 'reload:event', () => {
		discord.addevents (client, resolve, reject)
	}, 0)
	event.add ('reload:module', 'reload:module', () => {
		module.ReloadType ('Middleware')
	}, 0)
}