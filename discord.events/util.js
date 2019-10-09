
module.exports = (env) => {
	const event   = env.event

	let lastreason
	let increment = 0

	event.add ('discord:finishbad', 'util:spamloginfix', reason => {
		if (reason == lastreason) {
			increment += 1

			if (increment >= 3) {
				reason    = ''
				increment = 0

				return true
			}

			return false
		}
		
		lastreason = reason
		increment = 1

		return false
	})
}