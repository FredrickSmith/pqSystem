
const pqCommand          = require ('./pqCommand'         )
const pqEvent            = require ('./pqEvent'           )
const pqPermissionLoader = require ('./pqPermissionLoader')

const pqModule = require ('./pqModule')
	const pqDiscord    = require ('./pqDiscord'   )
	const pqTeamspeak3 = require ('./pqTeamSpeak3')

let pqModuleManager = new pqModule ('pq Management System')
	pqModuleManager.Module ('Base', 'Command'         , pqCommand         )
	pqModuleManager.Module ('Base', 'Event'           , pqEvent           )
	pqModuleManager.Module ('Base', 'PermissionLoader', pqPermissionLoader)

	pqModuleManager.Module ('Module', 'Discord'   , pqDiscord   )
	pqModuleManager.Module ('Module', 'TeamSpeak3', pqTeamspeak3)

pqModuleManager.Start ()