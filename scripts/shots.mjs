// Visual + a11y check: node scripts/shots.mjs [outDir]
import AxeBuilder from '@axe-core/playwright'
import { chromium } from 'playwright'

const out = process.argv[2] ?? 'shots'
const url = process.env.URL ?? 'http://localhost:4173/'
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {})
const errors = []

for (const [name, viewport] of [
  ['mobile', { width: 390, height: 844 }],
  ['desktop', { width: 1440, height: 900 }],
]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: name === 'mobile' ? 2 : 1, hasTouch: name === 'mobile' })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`))
  page.on('console', (m) => m.type() === 'error' && errors.push(`${name} console: ${m.text()}`))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${out}/${name}-hero.png` })
  await page.evaluate(() => document.querySelector('[aria-label=Highlights]').scrollIntoView({ block: 'center', behavior: 'instant' }))
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${out}/${name}-stats.png` })

  // Scroll through so reveals + count-ups fire, then capture each section.
  for (const id of ['experience', 'projects', 'community', 'education', 'about', 'contact']) {
    await page.evaluate((id) => document.getElementById(id).scrollIntoView({ behavior: 'instant' }), id)
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${out}/${name}-${id}.png` })
  }

  // Open project detail via carousel keyboard: focus track, arrow right, Enter.
  await page.evaluate(() => document.getElementById('projects').scrollIntoView({ behavior: 'instant' }))
  await page.waitForTimeout(600)
  await page.focus('[aria-roledescription="carousel"]')
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${out}/${name}-carousel-2.png` })
  await page.keyboard.press('Enter')
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${out}/${name}-sheet.png` })
  const focusedInSheet = await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]'))
  await page.keyboard.press('Escape')
  await page.waitForTimeout(700)

  if (name === 'mobile') {
    await page.click('button[aria-controls="mobile-menu"]')
    await page.waitForTimeout(700)
    await page.screenshot({ path: `${out}/${name}-menu.png` })
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  const axe = await new AxeBuilder({ page }).analyze()
  console.log(
    `${name}: horizontal overflow=${overflow}px, focus moved into sheet=${focusedInSheet}, axe violations=${axe.violations.length}`,
  )
  for (const v of axe.violations) console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length}) → ${v.nodes[0].target}`)
  await page.close()
}

// Reduced motion: everything must be visible at rest.
const rm = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
await rm.goto(url, { waitUntil: 'networkidle' })
await rm.evaluate(() => document.getElementById('about').scrollIntoView({ behavior: 'instant' }))
await rm.waitForTimeout(300)
await rm.screenshot({ path: `${out}/reduced-about.png` })

console.log(errors.length ? `ERRORS:\n${errors.join('\n')}` : 'No runtime errors')
await browser.close()
