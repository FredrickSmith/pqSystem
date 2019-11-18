
new (require ('./pq/pqModule')) ('pq Management System')

	.DefineModule ('Node'      , 0, 0, false)
	.DefineModule ('ThirdParty', 1, 0, false)
	.DefineModule ('Backware'  , 2, 0, true )
	.DefineModule ('Middleware', 3, 2, false)
	.DefineModule ('Frontware' , 4, 8, true )

	.Module ('Node', 'fs'    , 'fs'    )
	.Module ('Node', 'http'  , 'http'  )
	.Module ('Node', 'https' , 'https' )
	.Module ('Node', 'crypto', 'crypto')

	.Module ('ThirdParty', 'F'         , 'sprintf-js'        )
	.Module ('ThirdParty', 'mysql'     , 'mysql'             )
	.Module ('ThirdParty', 'google'    , 'googleapis'        )
	.Module ('ThirdParty', 'express'   , 'express'           )
	.Module ('ThirdParty', 'discord'   , 'discord.js'        )
	.Module ('ThirdParty', 'request'   , 'request'           )
	.Module ('ThirdParty', 'puppeteer' , 'puppeteer'         )
	.Module ('ThirdParty', 'googlemaps', '@google/maps'      )
	.Module ('ThirdParty', 'htmlparser', 'node-html-parser'  )
	.Module ('ThirdParty', 'teamspeak3', 'ts3-nodejs-library')

	.Module ('Backware', 'Command'         , './pqCommand'         )
	.Module ('Backware', 'Event'           , './pqEvent'           )
	.Module ('Backware', 'PermissionParser', './pqPermissionParser')

	.Module ('Middleware', 'Browser'  , './pqBrowser'  )
	.Module ('Middleware', 'Database' , './pqDatabase' )
	.Module ('Middleware', 'Compress' , './pqCompress' )
	.Module ('Middleware', 'Tokeniser', './pqID'       )
	.Module ('Middleware', 'Snowflake', './pqSnowFlake')

	.Module ('Frontware', 'Discord'   , './pqDiscord'   )
	// .Module ('Frontware', 'Webserver' , './pqWebserver' )
	.Module ('Frontware', 'TeamSpeak3', './pqTeamSpeak3')

	.Start ('pq Management System')