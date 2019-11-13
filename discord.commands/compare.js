
module.exports = (env) => {
	const command = env  .command
	const event   = env  .event
	const send    = env  .send
	const noperm  = env  .noperm
	const F       = env._.F.sprintf

	const puppeteer = env._.puppeteer
	const discord   = env._.discord

	const pqCompress = env._.Compress

	const compress = new pqCompress ()

	command.add ('discord', 'buy', ['Buy'], '', 1, ()=>{send ('no')}, noperm)

	command.add ('discord', '>', [], '', 1,
		(args, msg) => {
			send (F ('`%s` > `%s`', args [0], compress.encode (args [0])))
		}, noperm
	)
	command.add ('discord', '<', [], '', 1,
		(args, msg) => {
			send (F ('`%s` > `%s`', args [0], compress.decode (args [0])))
		}, noperm
	)

	command.add ('discord', 'c_s', [], '', 1,
		async (args, msg) => {
			const browser = await puppeteer.launch ({headless: false})
			const page    = await browser.newPage ()

			setTimeout (()=>{
				browser.close ().catch (()=>{})
			}, 15000)

			page.evaluateOnNewDocument (() => {
				Object.defineProperty (navigator, 'webdriver',
					{
						get: () => undefined,
					}
				)
			})

			await page.goto (F ('https://shop.coles.com.au/online/COLRSSearchDisplay?searchTerm=%s&storeId=20508&catalogId=14551&categoryId=&tabType=everything&tabId=everything&personaliseSort=false&langId=-1&beginIndex=0&browseView=false&facetLimit=100&searchSource=Q&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&pageView=image&errorView=AjaxActionErrorResponse&requesttype=ajax', args [0]))

			await page.waitForRequest ('https://shop.coles.com.au/favicon.ico').catch (()=>{})

			let s = new discord.RichEmbed ().setColor (0xE01A22)

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
				send (s.addField ('error', 'no products'))
				return await browser.close ()
			}

			let c = 0
			let d = args [1] === '1'

			for (product of products.products) {
				if (c == (d ? (args [2] ? parseInt (args [2]) : 25) : (args [2] ? parseInt (args [2]) : 25))) {
					send (s)
					s = new discord.RichEmbed ().setColor (0xE01A22)
					c = 0
				}

				s.addField (compress.encode (product.s ? product.s : F ('part_%s', product.p)),
					d ? F ('$%s	- %s %s	- %s	- %s\n', product.p1.o || 0, product.m, product.n, product.a.O3, product.u2)
					  : F ('$%s	- %s %s\n'             , product.p1.o || 0, product.m, product.n))
				c += 1
			}

			send (s)

			await browser.close ()
		}, noperm
	)
	command.add ('discord', 'w_s', [], '', 1,
		async (args, msg) => {
			const browser = await puppeteer.launch ({headless: false})
			const page    = await browser.newPage ()

			setTimeout (()=>{
				browser.close ().catch (()=>{})
			}, 15000)

			await page.on ('response', async response => {
				if (response.url () === 'https://www.woolworths.com.au/apis/ui/Search/products') {
					let s = new discord.RichEmbed ().setColor (0x125430)
					response.json ()
						.then  ((a) => {
							let c = 0
							let d = args [1] === '1'

							if (!a.Products) {
								send (s.addField ('error', 'no products'))
								return browser.close ()
							}

							for (product of a.Products) {
								for (product of product.Products) {
									if (c == (d ? (args [2] ? parseInt (args [2]) : 25) : (args [2] ? parseInt (args [2]) : 25))) {
										send (s)
										s = new discord.RichEmbed ().setColor (0x125430)
										c = 0
									}

									let sc = product.Stockcode
									s.addField (compress.encode (sc.length == 5 ? F ('0%s', sc) : sc),
										d ? F ('$%s	- %s	- %s	- %s\n', product.Price || 0, product.Description.replace ('<br>', ' '), product.PackageSize, product.CupString)
										  : F ('$%s	- %s\n'                , product.Price || 0, product.Description.replace ('<br>', ' ')))

									c += 1
								}
							}
				
							send (s)

							browser.close ()
						})
						.catch (e => {
							send (s.addField ('error', e))
							browser.close ()
						})
				}
			})

			page.goto (F ('https://www.woolworths.com.au/shop/search/products?searchTerm=%s', args [0]))
				.catch (()=>{})
		}, noperm
	)

	command.add ('discord', '$', [], '', 1,
		async (args, msg)=> {
			if (args [1] === undefined) {
				let a = compress.decode (args [0].substring (0, 3)),
					b = compress.decode (args [0].substring (3   ))

				args [0] = a
				args [1] = b
			}

			if (Number.isNaN (parseInt (args [0]))) {
				args [0] = compress.decode (args [0])

				if (Number.isNaN (parseInt (args [0])))
					return send ('arg1: not number')
			}

			if (args [1].charCodeAt (0) > 1000)
				args [1] = compress.decode (args [1])

			if (args [1].match ('undefined'))
				return send ('arg2: incorrect')

			const browser = await puppeteer.launch ({headless: false})

			setTimeout (()=>{
				browser.close ().catch (()=>{})
			}, 25000)

			let c, w
			const done = (l) => {
				let d = l [0],
					v = l [1]

				if (d) {
					if (c) return

					c = parseFloat (v) || 9999
				} else {
					if (w) return

					w = v || 9999
				}

				if (c && w) {
					let sdre = new discord.RichEmbed ()
					if (c < w) {
						sdre.setColor  (0xE01A22)
							.setAuthor ('Coles', 'https://shop.coles.com.au/wcsstore/ColesResponsiveStorefrontAssetStore/dist/2e9e1b85e19e5da3568c159145c5e04f/img/Icon-76@2x.png')
							.addField  ('Woolworths', F ('$%f', w != 9999 ? w : 0), true)
							.addField  ('Coles'     , F ('$%f', c                ), true)
					} else if (w < c) {
						sdre.setColor  (0x125430)
							.setAuthor ('Woolworths', 'http://logok.org/wp-content/uploads/2014/12/Woolworths-logo-880x654.png')
							.addField  ('Woolworths', F ('$%f', w                ), true)
							.addField  ('Coles'     , F ('$%f', c != 9999 ? c : 0), true)
					} else {
						sdre.setColor  (0x007FFF)
							.setAuthor ('No Winner', 'https://cdn.discordapp.com/attachments/150813303822614528/643413128251572225/emote.png')
							.addField  ('Woolworths', F ('$%f', w), true)
							.addField  ('Coles'     , F ('$%f', c), true)
					}

					browser.close ()
					return send (sdre.setThumbnail (F ('https://cdn0.woolworths.media/content/wowproductimages/large/%s.jpg', args [0].length == 5 ? F ('0%s', args [0]) : args [0])))
				}
			}

			new Promise (async resolve => {
				const page = await browser.newPage ()
	
				setTimeout (()=>{
					page.close ().catch (()=>{})
				}, 15000)
	
				let url = F ('https://www.woolworths.com.au/apis/ui/product/detail/%s?isMobile=false', args [0])
				await page.on ('response', async response => {
					if (response.url () === url) {
						response.json ()
							.then  ((a) => {
								resolve ([false, a.Product.Price])
								page.close ()
							})
							.catch (() => {
								resolve ([false, false])
								page.close ()
							})
					}
				})
	
				page.goto (url)
					.catch (()=>{
						resolve ([false, false])
					})
			}).then (done)
			new Promise (async resolve => {
				const page = await browser.newPage ()

				setTimeout (()=>{
					page.close ().catch (()=>{})
				}, 15000)

				await page.evaluateOnNewDocument (() => {
					Object.defineProperty (navigator, 'webdriver',
						{
							get: () => undefined,
						}
					)
				})
	
				let url = F ('https://shop.coles.com.au/search/resources/store/20508/productview/bySeoUrlKeyword/%s?catalogId=14551', args [1])
				await page.on ('response', async response => {
					if (response.url () === url && response.status () == 200) {
						response.json ()
							.then  ((a) => {
								resolve ([true, a.catalogEntryView [0].p1.o])
								page.close ()
							})
							.catch (() => {
								resolve ([true, false])
								page.close ()
							})
					}
				})
	
				page.goto (url)
					.catch (()=>{
						resolve ([true, false])
					})
			}).then (done)
		}, noperm)

	event.add ('reload:command', 'ch:close', () => {
		if (!(browser === undefined)) browser.close ()

		browser = undefined
	})
	event.add ('reload:all', 'ch:close', () => {
		if (!(browser === undefined)) browser.close ()

		browser = undefined
	})
}