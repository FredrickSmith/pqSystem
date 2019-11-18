const puppeteer = require ('puppeteer')

class pqPage {
	constructor (p, b, id) {
		this.p       = p
		this.browser = b
		this.id      = id
	}

	async c () {
		this.page = await this.browser.newPage ()

		return this
	}

	async search (url, options, callback) {
		const page  = this.page

		const _ = setTimeout (() => {
			this.close ()
		}, (options.to || 15) * 1000)

		if (options.wd) {
			await page.evaluateOnNewDocument (() => {
				Object.defineProperty (navigator, 'webdriver',
					{
						get: () => undefined,
					}
				)
			})
		}

		const curl = options.curl || url
		await page.on ('response', async response => {
			if ((response.url () == curl) && (!options.st ? true : response.status () == 200)) {
				clearTimeout (_)
				await callback (true, response)
				this.close ()
			}
		})

		page.goto (url)
			.catch (() => {})
	}

	async close () {
		this.p.d (this.id)
		return await this.page.close ()
			.catch (() => {})
	}
}
class pqBrowser {
	constructor () {
		this.id    = 0
		this.pages = {}
	}

	async c () {
		this.browser = await puppeteer.launch ({headless: false})

		return this
	}

	d (id) {
		delete this.pages [id]
	}

	async page () {
		this.id += 1
		this.pages [this.id] = await new pqPage (this, this.browser, this.id).c ()

		return this.pages [this.id]
	}
	async close () {
		return await this.browser.close ()
			.catch (() => {})
	}
}
class pqBrowserManager {
	constructor () {
		this.timeout = 0
	}

	async c () {
		this.browser = await new pqBrowser ().c ()

		this.t (60)

		return this
	}

	t (t) {
		this.timeout = t
		if (this.timer)
			clearTimeout (this.timer)

		this.timer = setTimeout (() => {
			this.browser.close ()

			delete this.browser
			delete this.timer
		}, this.timeout * 1000)
	}

	async page () {
		if (!this.browser)
			this.browser = await new pqBrowser ().c ()

		this.t (60)

		return await this.browser.page ()
	}
}

module.exports = pqBrowserManager