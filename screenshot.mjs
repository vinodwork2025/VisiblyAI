import { chromium } from 'playwright'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
await page.screenshot({ path: 'screenshots/home.png', fullPage: false })
console.log('HOME done')

await page.goto('http://localhost:3000/scan', { waitUntil: 'networkidle' })
await page.screenshot({ path: 'screenshots/scan.png', fullPage: false })
console.log('SCAN done')

await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' })
await page.screenshot({ path: 'screenshots/login.png', fullPage: false })
console.log('LOGIN done')

await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' })
await page.screenshot({ path: 'screenshots/dashboard.png', fullPage: false })
console.log('DASHBOARD done')

await browser.close()
