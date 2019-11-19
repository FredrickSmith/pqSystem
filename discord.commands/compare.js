
module.exports = (env) => {
	const send       = env  .send
	const noperm     = env  .noperm
	const command    = env  .command
	const F          = env._.F         .sprintf
	const pqBrowser  = env._.Browser
	const pqCommand  = env._.Command
	const discord    = env._.discord
	const pqDatabase = env._.Database
	const pqCompress = env._.Compress
	const htmlparser = env._.htmlparser

	const browser  = new pqBrowser  ()
	const compress = new pqCompress ()
	const db       = new pqDatabase ()

	command.add ('discord', '$?', [], 'search both coles and woolworths', 1,
		(args, msg) => {
			const [wi, wp, wc, wa] = pqCommand.is (F ('!$w "%s" %s', args [0] || 'suimin', args [1] || 0))
			const [ci, cp, cc, ca] = pqCommand.is (F ('!$c "%s" %s', args [0] || 'suimin', args [1] || 0))

			pqCommand.parse ('discord', 1, wp, wc, wa, msg)
			pqCommand.parse ('discord', 1, cp, cc, ca, msg)
		}, noperm
	)

	command.add ('discord', '$c', [], 'search for coles products', 1,
		async (args, msg) => {
			const page  = await browser.page ()

			page.search (F ('https://shop.coles.com.au/online/COLRSSearchDisplay?searchTerm=%s&storeId=20508&catalogId=14551&categoryId=&tabType=everything&tabId=everything&personaliseSort=false&langId=-1&beginIndex=0&browseView=false&facetLimit=100&searchSource=Q&sType=SimpleSearch&resultCatEntryType=2&showResultsPage=true&pageView=image&errorView=AjaxActionErrorResponse&requesttype=ajax', args [0]),
				{
					wd: true,
					st: true
				}, async (e, response) => {
					const s = new discord.RichEmbed ().setColor (0xE01A22)

					if (!e)
						return send (s.addField ('error', 'rip'))

					const a = await response.text ()
						.catch (() => {
							send (s.addField ('error', 'rip'))
						})
					
					let products = htmlparser.parse (a)

					try {
						products = JSON.parse (products.querySelectorAll ('.products') [0].childNodes [19].childNodes [0].rawText)
					} catch (e) {
						return send (s.addField ('error', 'no products'))
					}

					const d = args [1] === '1'
					let   c = 0

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
				}
			)
		}, noperm
	)
	command.add ('discord', '$w', [], 'search for woolworths products', 1,
		async (args, msg) => {
			const page = await browser.page ()

			page.search (F ('https://www.woolworths.com.au/shop/search/products?searchTerm=%s', args [0]),
				{
					curl: 'https://www.woolworths.com.au/apis/ui/Search/products'
				}, async (e, response) => {
					const s = new discord.RichEmbed ().setColor (0x125430)

					if (!e)
						return send (s.addField ('error', 'rip'))

					const a = await response.json ()
						.catch (e => {
							send (s.addField ('error', e))
						})

					const d = args [1] === '1'
					let   c = 0

					if (!a.Products) 
						return send (s.addField ('error', 'no products'))

					for (product of a.Products) {
						for (product of product.Products) {
							if (c == (d ? (args [2] ? parseInt (args [2]) : 25) : (args [2] ? parseInt (args [2]) : 25))) {
								send (s)
								s = new discord.RichEmbed ().setColor (0x125430)
								c = 0
							}

							const sc = product.Stockcode
							s.addField (compress.encode (sc.length == 5 ? F ('0%s', sc) : sc),
								d ? F ('$%s	- %s	- %s	- %s\n', product.Price || 0, product.Description.replace ('<br>', ' '), product.PackageSize, product.CupString)
								  : F ('$%s	- %s\n'                , product.Price || 0, product.Description.replace ('<br>', ' ')))

							  c += 1
						}
					}
			
					send (s)
				}
			)
		}, noperm
	)

	command.add ('discord', '$', [], 'compare a woolworths product to a coles product', 1,
		async (args, msg)=> {
			if (args [1] === undefined) {
				const a = compress.decode (args [0].substring (0, 3)),
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

			let c, w
			const done = (l) => {
				const d = l [0],
					v = l [1]

				if (d) {
					if (c) return

					c = parseFloat (v) || 9999
				} else {
					if (w) return

					w = v || 9999
				}

				if (c && w) {
					const sdre = new discord.RichEmbed ()
					let co  = 0x007FFF
					let au  = 'No Winner'
					let pic = 'https://cdn.discordapp.com/attachments/150813303822614528/643413128251572225/emote.png'
					if (c < w) {
						co  = 0xE01A22
						au  = 'Coles'
						pic = 'https://shop.coles.com.au/wcsstore/ColesResponsiveStorefrontAssetStore/dist/2e9e1b85e19e5da3568c159145c5e04f/img/Icon-76@2x.png'
					} else if (w < c) {
						co  = 0x125430
						au  = 'Woolworths'
						pic = 'http://logok.org/wp-content/uploads/2014/12/Woolworths-logo-880x654.png'
					}
					sdre.setColor  (co)
						.setAuthor (au, pic)
						.addField  ('Woolworths', F ('$%f', w                ), true)
						.addField  ('Coles'     , F ('$%f', c != 9999 ? c : 0), true)

					return send (sdre.setThumbnail (F ('https://cdn0.woolworths.media/content/wowproductimages/large/%s.jpg', args [0].length == 5 ? F ('0%s', args [0]) : args [0])))
				}
			}

			const a = () => {
				new Promise (async resolve => {
					const page = await browser.page ()
	
					page.search (F ('https://www.woolworths.com.au/apis/ui/product/detail/%s?isMobile=false', args [0]), {},
						async (e, response) => {
							if (!e)
								return resolve ([false, false])

							const a = await response.json ()
								.catch (() => {
									resolve ([false, false])
								})

							resolve ([false, a.Product.Price])
						}
					)
				}).then (done)
			}

			new Promise (async resolve => {
				const page = await browser.page ()

				a ()

				page.search (F ('https://shop.coles.com.au/search/resources/store/20508/productview/bySeoUrlKeyword/%s?catalogId=14551', args [1]),
					{
						wd: true,
						st: true
					}, async (e, response) => {
						if (!e)
							return resolve ([false, false])

						const a = await response.json ()
							.catch (() => {
								resolve ([true, false])
							})

						resolve ([true, a.catalogEntryView [0].p1.o])
					}
				)
			}).then (done)
		}, noperm
	)
}