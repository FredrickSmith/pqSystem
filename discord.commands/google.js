
module.exports = (env) => {
	const command = env.command
	const send    = env.send
	const noperm  = env.noperm
	const F       = env.F
	const fs      = env.fs

	const google = {}

	const googlemaps = require ('@google/maps')

	command.addcommand ('discord', 'gstart', ['gs'], 'google maps start', 16,
		(args, msg) => {
			fs.readFile ('data/google_1.token', 'utf8', (err, data) => {
				if (err)
					return send ('g1: no token')

				google.gs = googlemaps.createClient ({
					key: data
				})

				send ('started google places')
			})
		}, noperm
	)

	command.addcommand ('discord', 'gsearch', ['gz'], 'google maps search', 16,
		(args, msg) => {
			try {
				google.gs.findPlace ({
					input       : args.join (' '),
					inputtype   : 'textquery',
					language    : 'en'       ,
					locationbias: 'ipbias'   ,
					fields      : ['place_id', 'name', 'formatted_address', 'geometry/location']
				}, (err, response) => {
					if (err)
						send (F ('```failed: %s```', err))

					let place = response.json.candidates [0]

					if (!place)
						send ('```failed: no place```')

					send (F ('```\n>	%s\n<	%s\n<	%s\n<	%s\n<	%s,%s```', args.join (' '), place.name, place.formatted_address, place.place_id, place.geometry.location.lat, place.geometry.location.lng))
				})
			} catch (err) {
				send (F ('```failed: %s```', err))
			}
		}
	)
}