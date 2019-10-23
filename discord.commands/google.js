
module.exports = (env) => {
	const command     = env  .command
	const send        = env  .send
	const noperm      = env  .noperm
	const F           = env._.F.sprintf
	const fs          = env._.fs
	const crypto      = env._.crypto
	const google      = env._.google.google
	const googlemaps  = env._.googlemaps
	const pqID        = env._.Tokeniser
	const pqSnowFlake = env._.Snowflake

	const token = new pqID (2^48)

	const _google = {}

	fs.readFile ('data/google_id.oauth', 'utf8', (err, id) => {
		if (err) return send ('no id')

		fs.readFile ('data/google_secret.oauth', 'utf8', (err, secret) => {
			if (err) return send ('no secret')

			_google.oa2 = new google.auth.OAuth2 (id, secret, 'urn:ietf:wg:oauth:2.0:oob')

			fs.readFile ('data/google_token.oauth', 'utf8', (err, token) => {
				if (err) return send ('no token')

				_google.oa2.setCredentials (JSON.parse (token))

				_google.sheets = google.sheets ('v4')
			})
		})
	})

	command.add ('discord', 'gsread', ['gsr'], 'google sheets read', 16,
		(args, msg) => {
			_google.sheets.spreadsheets.values.get ({
				auth         : _google.oa2,
				spreadsheetId: '1OmY6tRWHLvK9HSlKtw_NEiRo2P-2gVZ1yzPLsoB9vF0',
				range        : '54D05552A90A9E14ECD35C78615EEE7CEC72!A2:C2'
			}, (err, result) => {
				if (err)
					return console.log (err)

				return send (F ('```js\n%s```', JSON.stringify (result.data)))
			})
		}, noperm
	)
	command.add ('discord', 'gsadd', ['gsa'], 'google sheets add', 16,
		(args, msg) => {
			let sf = pqSnowFlake.cold ().toString (16).toUpperCase ()
			_google.sheets.spreadsheets.values.append ({
				auth            : _google.oa2,
				spreadsheetId   : '1OmY6tRWHLvK9HSlKtw_NEiRo2P-2gVZ1yzPLsoB9vF0',
				range           : '54D05552A90A9E14ECD35C78615EEE7CEC72!A1:C1',
				valueInputOption: 'RAW',
				requestBody     : {
					values: [
						[
							sf,
							crypto.createHash ('sha256').update (sf + '1OmY6tRWHLvK9HSlKtw_NEiRo2P-2gVZ1yzPLsoB9vF0').digest ('hex').toUpperCase (),
							new Date ().toISOString (),
							token.gen ()
						]
					]
				}
			}, (err, result) => {
				if (err)
					return console.log (err)

				return send (F ('```js\n%s```', JSON.stringify (result.data)))
			})
		}, noperm
	)
	command.add ('discord', 'gsget', ['gsg'], 'google sheets get', 16,
		(args, msg) => {
			_google.sheets.spreadsheets.values.batchGetByDataFilter ({
				auth            : _google.oa2,
				spreadsheetId   : '1OmY6tRWHLvK9HSlKtw_NEiRo2P-2gVZ1yzPLsoB9vF0',
				requestBody     : {
					dataFilters: [
						{
							a1Range  : '54D05552A90A9E14ECD35C78615EEE7CEC72!A1:C100000',
						}
					]
				}
			}, (err, result) => {
				if (err)
					return console.log (err)

				return send (F ('```js\n%s```', JSON.stringify (result.data)))
			})
		}, noperm
	)

	fs.readFile ('data/google_1.token', 'utf8', (err, data) => {
		if (err)
			return send ('g1: no token')

		_google.gs = googlemaps.createClient ({key: data})
	})

	command.add ('discord', 'gsearch', ['gz'], 'google maps search', 16,
		(args, msg) => {
			if (!_google.gs) return send ('start google maps')

			try {
				_google.gs.findPlace ({
					input       : args.join (' '),
					inputtype   : 'textquery',
					language    : 'en'       ,
					locationbias: 'ipbias'   ,
					fields      : ['place_id', 'name', 'formatted_address', 'geometry/location']
				}, (err, response) => {
					if (err)
						return send (F ('```failed: %s```', err))

					let place = response.json.candidates [0]

					if (!place)
						return send ('```failed: no place```')

					return send (F ('```\n>	%s\n<	%s\n<	%s\n<	%s\n<	%s,%s```', args.join (' '), place.name, place.formatted_address, place.place_id, place.geometry.location.lat, place.geometry.location.lng))
				})
			} catch (err) {
				return send (F ('```failed: %s```', err))
			}
		}
	)

	// command.add ('discord', 'goastart', ['goas'], 'google oauth start', 16,
	// 	(args, msg) => {
	// 		fs.readFile ('data/google_id.oauth', 'utf8', (err, id) => {
	// 			if (err) return send ('no id')

	// 			fs.readFile ('data/google_secret.oauth', 'utf8', (err, secret) => {
	// 				if (err) return send ('no secret')

	// 				_google.oauth2 = new google.auth.OAuth2 (id, secret, 'urn:ietf:wg:oauth:2.0:oob')
	// 			})
	// 		})
	// 	}, noperm
	// )
	// command.add ('discord', 'goaauth', ['goaa'], 'google oauth auth', 16,
	// 	(args, msg) => {
	// 		if (!_google.oauth2) return send ('start oauth')

	// 		fs.readFile ('data/google_token.oauth', 'utf8', (err, token) => {
	// 			if (err) return send ('no token')

	// 			_google.oauth2.setCredentials (JSON.parse (token))
	// 		})
	// 	}, noperm
	// )
	// command.add ('discord', 'goaauthcreate', ['goaac'], 'google oauth auth create', 16,
	// 	(args, msg) => {
	// 		if (!_google.oauth2) return send ('start oauth')

	// 		const url = _google.oauth2.generateAuthUrl ({
	// 			access_type: 'offline',
	// 			scope: args,
	// 		})

	// 		return send (url)
	// 	}, noperm
	// )
	// command.add ('discord', 'goaauthgettoken', ['goaagt'], 'google oauth auth create', 16,
	// 	(args, msg) => {
	// 		if (!_google.oauth2) return send ('start oauth')

	// 		_google.oauth2.getToken (args [0], (err, token) => {
	// 			if (err) return send (err.response.data.error)

	// 			return msg.author.send (F ('```js\n%s``', JSON.encode (token)))
	// 		})
	// 	}, noperm
	// )

	// command.add ('discord', 'gstart', ['gs'], 'google maps start', 16,
	// 	(args, msg) => {
	// 		fs.readFile ('data/google_1.token', 'utf8', (err, data) => {
	// 			if (err)
	// 				return send ('g1: no token')

	// 			_google.gs = googlemaps.createClient ({key: data})
	// 		})
	// 	}, noperm
	// )
}