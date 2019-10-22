
new (require ('./pqModule')) ('pq Management System')

	.Module ('Backware', 'Command'         , './pqCommand'         )
	.Module ('Backware', 'Event'           , './pqEvent'           )
	.Module ('Backware', 'PermissionParser', './pqPermissionParser')

	.Module ('Middleware', 'Tokeniser', './pqID'       )
	.Module ('Middleware', 'Snowflake', './pqSnowFlake')
	.Module ('Middleware', 'Database' , './pqDatabase' )

	.Module ('Frontware', 'Discord'   , './pqDiscord'   )
	.Module ('Frontware', 'TeamSpeak3', './pqTeamSpeak3')

	.Start ()