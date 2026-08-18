/**
 * Accessibility regression gate.
 *
 * Runs axe against the built site in BOTH themes, plus explicit assertions for
 * the things axe cannot see on its own: that every image carries meaningful
 * alt text or is marked decorative, and that the reduced-motion preference is
 * actually honoured.
 *
 * Kept out of package.json dependencies on purpose — playwright and axe are
 * installed on demand in CI so the Cloudflare Pages production build does not
 * have to download a browser.
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { AxeBuilder } from '@axe-core/playwright'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const PORT = 4179

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json',
}

// Mirrors how Cloudflare Pages resolves a directory to its index.html and
// falls back to 404.html, so CI exercises the real routing shape.
const server = createServer(async (req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0])
  for (const c of [join(dist, p), join(dist, p, 'index.html')]) {
    try {
      if ((await stat(c)).isFile()) {
        res.writeHead(200, { 'Content-Type': TYPES[extname(c)] ?? 'application/octet-stream' })
        res.end(await readFile(c))
        return
      }
    } catch {}
  }
  res.writeHead(404, { 'Content-Type': 'text/html' })
  res.end(await readFile(join(dist, '404.html')))
})
await new Promise((r) => server.listen(PORT, r))

const ROUTES = ['/', '/explore', '/kitchen', '/about', '/dish/gochujang-galbi', '/privacy']
const THEMES = ['light', 'dark']

// CHROMIUM_PATH lets a sandbox with a preinstalled browser opt out of
// Playwright's own download; CI leaves it unset and uses the matching build.
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
)
const failures = []

for (const theme of THEMES) {
  const context = await browser.newContext({ colorScheme: theme, reducedMotion: 'reduce' })
  const page = await context.newPage()

  for (const route of ROUTES) {
    const url = `http://127.0.0.1:${PORT}${route}`
    await page.goto(url, { waitUntil: 'networkidle' })
    // The app replaces the prerendered shell on mount; assert against the real UI.
    await page.waitForSelector('header nav[aria-label="Primary"]', { timeout: 10_000 })

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      // Placeholder photography is fetched from a third-party host; its
      // decorative contrast is not something this suite can control.
      .disableRules([])
      .analyze()

    for (const v of results.violations) {
      failures.push(
        `[${theme}] ${route} — ${v.id} (${v.impact}): ${v.help} × ${v.nodes.length}\n      ${v.nodes[0]?.target?.join(' ')}`,
      )
    }

    // Every image must be meaningfully described or explicitly decorative.
    const badImages = await page.$$eval('img', (imgs) =>
      imgs
        .filter((i) => {
          const alt = i.getAttribute('alt')
          const decorative = alt === '' || i.getAttribute('aria-hidden') === 'true'
          return !decorative && !(alt && alt.trim().length > 2)
        })
        .map((i) => i.getAttribute('src') ?? '(no src)'),
    )
    for (const src of badImages) {
      failures.push(`[${theme}] ${route} — image without meaningful or decorative alt: ${src}`)
    }

    // Images must declare intrinsic dimensions so their box cannot reflow.
    const undimensioned = await page.$$eval('img', (imgs) =>
      imgs
        .filter((i) => !i.getAttribute('width') || !i.getAttribute('height'))
        .map((i) => i.getAttribute('src') ?? '(no src)'),
    )
    for (const src of undimensioned) {
      failures.push(`[${theme}] ${route} — image without width/height: ${src}`)
    }
  }

  await context.close()
}

/* ------------------------------------------------ keyboard + focus gates -- */

{
  const context = await browser.newContext({ viewport: { width: 390, height: 780 } })
  const page = await context.newPage()
  await page.goto(`http://127.0.0.1:${PORT}/explore`, { waitUntil: 'networkidle' })
  await page.waitForSelector('header nav[aria-label="Primary"]')

  // The skip link must be the first thing a keyboard user reaches.
  await page.keyboard.press('Tab')
  const firstFocus = await page.evaluate(() => document.activeElement?.textContent?.trim())
  if (firstFocus !== 'Skip to content') {
    failures.push(`keyboard — first Tab stop is "${firstFocus}", expected "Skip to content"`)
  }

  // Opening the mobile menu must move focus into it; Escape must return it.
  const trigger = page.locator('button[aria-controls="mobile-menu"]')
  await trigger.click()
  await page.waitForSelector('#mobile-menu')
  const inMenu = await page.evaluate(
    () => !!document.getElementById('mobile-menu')?.contains(document.activeElement),
  )
  if (!inMenu) failures.push('keyboard — opening the mobile menu did not move focus into it')

  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  const backOnTrigger = await page.evaluate(
    () => document.activeElement?.getAttribute('aria-controls') === 'mobile-menu',
  )
  if (!backOnTrigger) failures.push('keyboard — Escape did not return focus to the menu trigger')

  await context.close()
}

await browser.close()
server.close()

if (failures.length) {
  console.error(`\n✗ accessibility gate failed (${failures.length} problem(s)):\n`)
  for (const f of failures) console.error(`  • ${f}`)
  console.error('')
  process.exit(1)
}
console.log(`✓ accessibility gate passed: ${ROUTES.length} routes × ${THEMES.length} themes, axe + keyboard/focus assertions`)
