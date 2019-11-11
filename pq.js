
new (require ('./pq/pqModule')) ('pq Management System')

	.DefineModule ('Node'      , 0, 0, false)
	.DefineModule ('ThirdParty', 1, 0, false)
	.DefineModule ('Backware'  , 2, 0, true )
	.DefineModule ('Middleware', 3, 2, false)
	.DefineModule ('Frontware' , 4, 8, true )

	.Module ('Node', 'fs'    , 'fs'    )
	.Module ('Node', 'http'  , 'http'  )
	.Module ('Node', 'crypto', 'crypto')

	.Module ('ThirdParty', 'F'         , 'sprintf-js'        )
	.Module ('ThirdParty', 'http'      , 'http'              )
	.Module ('ThirdParty', 'https'     , 'https'             )
	.Module ('ThirdParty', 'google'    , 'googleapis'        )
	.Module ('ThirdParty', 'discord'   , 'discord.js'        )
	.Module ('ThirdParty', 'express'   , 'express'           )
	.Module ('ThirdParty', 'googlemaps', '@google/maps'      )
	.Module ('ThirdParty', 'teamspeak3', 'ts3-nodejs-library')
	.Module ('ThirdParty', 'puppeteer' , 'puppeteer'         )
	.Module ('ThirdParty', 'request'   , 'request'           )

	.Module ('Backware', 'Command'         , './pqCommand'         )
	.Module ('Backware', 'Event'           , './pqEvent'           )
	.Module ('Backware', 'PermissionParser', './pqPermissionParser')

	.Module ('Middleware', 'Tokeniser', './pqID'       )
	.Module ('Middleware', 'Snowflake', './pqSnowFlake')
	.Module ('Middleware', 'Database' , './pqDatabase' )

	.Module ('Frontware', 'Discord'   , './pqDiscord'   )
	// .Module ('Frontware', 'Webserver' , './pqWebserver' )
	.Module ('Frontware', 'TeamSpeak3', './pqTeamSpeak3')

	.Start ('pq Management System')