
new (require ('./pqModule')) ('pq Management System')
	.Module ('Base', 'Command'         , require ('./pqCommand'         ))
	.Module ('Base', 'Event'           , require ('./pqEvent'           ))
	.Module ('Base', 'PermissionParser', require ('./pqPermissionParser'))

	.Module ('Module', 'Discord'   , require ('./pqDiscord'   ))
	.Module ('Module', 'TeamSpeak3', require ('./pqTeamSpeak3'))

	.Start ()