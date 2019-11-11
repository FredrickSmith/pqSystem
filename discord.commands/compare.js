
module.exports = (env) => {
	const command = env  .command
	const event   = env  .event
	const send    = env  .send
	const noperm  = env  .noperm
	const F       = env._.F.sprintf

	const https  = env._.https
	const puppeteer = env._.puppeteer
	const request = env._.request

	let browser

	command.add ('discord', 'c_fc', [], '', 1,
		async (args, msg) => {
			      browser = await puppeteer.launch ({headless: false})
			const page    = await browser.newPage ()

			page.evaluateOnNewDocument (() => {
				Object.defineProperty (navigator, 'webdriver',
					{
						get: () => undefined,
					}
				)
			})

			await page.goto (F ('https://shop.coles.com.au/online/COLRSSearchDisplay?storeId=20508&catalogId=14551&searchTerm=%s&categoryId=&tabType=everything&tabId=everything&personaliseSort=false&langId=-1&beginIndex=0&browseView=false&facetLimit=100&searchSource=Q&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&pageView=image&errorView=AjaxActionErrorResponse&requesttype=ajax', args [1]))

			await page.waitForRequest ('https://shop.coles.com.au/favicon.ico')

			let products = await page.evaluate (() => {
				return Promise.resolve (JSON.parse (document.getElementsByClassName ('products') [0].childNodes [19].textContent))
			})

			let s = '```\n'
			let c = 0
			let d = args [0] === '1'

			for (product of products.products) {
				if (c == (d ? 16 : 32)) {
					s += '```'
					send (s)
					s = '```\n'
					c = 0
				}

				s += d ? F ('$%s - %s - %s - %s\n', product.p1.o, product.n, product.a.O3, product.u2) : F ('$%s$ - %s\n', product.p1.o, product.n)
				c += 1
			}

			s += '```'

			send (s)

			await browser.close ()
		}, noperm
	)

	event.add ('reload:command', 'ch:close', () => {
		if (!(browser === undefined)) browser.close ()

		browser = undefined
	})
	event.add ('reload:all', 'ch:close', () => {
		if (!(browser === undefined)) browser.close ()

		browser = undefined
	})
}