
module.exports = (env) => {
	const command = env  .command
	const event   = env  .event
	const send    = env  .send
	const noperm  = env  .noperm
	const F       = env._.F.sprintf

	const puppeteer = env._.puppeteer
	const request = env._.request

	let cache = {}
	let browser

	command.add ('discord', 'buy', ['Buy'], '', 1, ()=>{send ('no')}, noperm)

	command.add ('discord', 'c_s', [], '', 1,
		async (args, msg) => {
			const browser = await puppeteer.launch ({headless: false})
			const page    = await browser.newPage ()

			let t = false
			let f = false

			setTimeout (()=>{
				if (!t) {
					browser.close ()
					f = true
				}
			}, 30000)

			page.evaluateOnNewDocument (() => {
				Object.defineProperty (navigator, 'webdriver',
					{
						get: () => undefined,
					}
				)
			})

			await page.goto (F ('https://shop.coles.com.au/online/COLRSSearchDisplay?searchTerm=%s&storeId=20508&catalogId=14551&categoryId=&tabType=everything&tabId=everything&personaliseSort=false&langId=-1&beginIndex=0&browseView=false&facetLimit=100&searchSource=Q&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&pageView=image&errorView=AjaxActionErrorResponse&requesttype=ajax', args [0]))

			await page.waitForRequest ('https://shop.coles.com.au/favicon.ico').catch (()=>{})

			t = true

			if (f)
				return send ('```\ncoles\nnothing```')

			let products = await page.evaluate (() => {
				let a
				try {
					a = JSON.parse (document.getElementsByClassName ('products') [0].childNodes [19].textContent)
				} catch (b) {
					a = false
				}
				return Promise.resolve (a)
			})

			if (!products) {
				send ('```\ncoles\nnothing```')
				return await browser.close ()
			}

			let s = '```\ncoles\n'
			let c = 0
			let d = args [1] === '1'

			for (product of products.products) {
				if (c == (d ? (args [2] ? parseInt (args [2]) : 16) : (args [2] ? parseInt (args [2]) : 32))) {
					s += '```'
					send (s)
					s = '```\ncoles\n'
					c = 0
				}

				s += d ? F ('$%s	- %s %s	- %s	- %s\n', product.p1.o || 0, product.m, product.n, product.a.O3, product.u2)
				       : F ('$%s	- %s %s\n'             , product.p1.o || 0, product.m, product.n)
				c += 1
			}

			s += '```'

			send (s)

			await browser.close ()
		}, noperm
	)
	command.add ('discord', 'w_s', [], '', 1,
		async (args, msg) => {
			const browser = await puppeteer.launch ({headless: false})
			const page    = await browser.newPage ()

			let t = false
			let f = false

			setTimeout (()=>{
				if (!t) {
					browser.close ()
					f = true
				}
			}, 30000)

			await page.on ('response', async reponse => {
				if (reponse.url () === 'https://www.woolworths.com.au/apis/ui/Search/products') {
					t = true
					reponse.json ()
						.then  ((a) => {
							let s = '```\nwoolworths\n'
							let c = 0
							let d = args [1] === '1'
				
							for (product of a.Products) {
								for (product of product.Products) {
									if (c == (d ? (args [2] ? parseInt (args [2]) : 16) : (args [2] ? parseInt (args [2]) : 32))) {
										s += '```'
										send (s)
										s = '```\nwoolworths\n'
										c = 0
									}
				
									s += d ? F ('$%s	- %s	- %s	- %s\n', product.Price || 0, product.Description.replace ('<br>', ' '), product.PackageSize, product.CupString)
										   : F ('$%s	- %s\n'                , product.Price || 0, product.Description.replace ('<br>', ' '))

									c += 1
								}
							}
				
							s += '```'
				
							send (s)

							browser.close ()
						})
						.catch (() => {
							send ('```\nwoolworths\nnothing```')
							browser.close ()
						})
				}
			}).catch (()=>{})

			page.goto (F ('https://www.woolworths.com.au/shop/search/products?searchTerm=%s', args [0])).catch (()=>{})
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