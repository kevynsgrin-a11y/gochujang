/**
 * Release gate for the built controlled-preview artifact.
 *
 * This checks emitted HTML rather than source, preventing regressions where a
 * route hydrates correctly but sends unsafe metadata or a blank shell to a
 * crawler, slow connection, or non-JavaScript client.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildRoutes,
  titleFor,
  canonicalFor,
  structuredDataFor,
  PREVIEW_ROBOTS,
} from '../src/data/seo.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const catalog = JSON.parse(readFileSync(join(root, 'src/data/catalog.json'), 'utf8'))
const routes = buildRoutes(catalog)
const failures = []
const fail = (where, message) => failures.push(`${where}: ${message}`)

const pick = (html, re) => html.match(re)?.[1] ?? null

function walk(path) {
  const entries = statSync(path).isDirectory() ? readdirSync(path) : []
  return entries.flatMap((entry) => {
    const child = join(path, entry)
    return statSync(child).isDirectory() ? walk(child) : [child]
  })
}

function containsRecipeType(value) {
  if (!value || typeof value !== 'object') return false
  if (Array.isArray(value)) return value.some(containsRecipeType)
  if (value['@type'] === 'Recipe') return true
  return Object.values(value).some(containsRecipeType)
}

function executableInlineScriptExists(html) {
  return /<script(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi.test(
    html.replace(/<script[^>]*\ssrc="[^"]+"[^>]*><\/script>/gi, ''),
  )
}

const seenTitles = new Map()

for (const route of routes) {
  const file = route.path === '/' ? join(dist, 'index.html') : join(dist, route.path.slice(1), 'index.html')
  const where = route.path

  if (!existsSync(file)) {
    fail(where, 'no prerendered HTML was emitted')
    continue
  }

  const html = readFileSync(file, 'utf8')
  const title = pick(html, /<title>([^<]*)<\/title>/)
  const expectedTitle = titleFor(route)
  if (title !== expectedTitle) fail(where, `title is "${title}", expected "${expectedTitle}"`)

  const canonical = pick(html, /<link\s+rel="canonical"\s+href="([^"]+)"/)
  const expectedCanonical = canonicalFor(route)
  if (canonical !== expectedCanonical) fail(where, `canonical is "${canonical}", expected "${expectedCanonical}"`)

  const ogUrl = pick(html, /<meta\s+property="og:url"\s+content="([^"]+)"/)
  if (ogUrl !== expectedCanonical) fail(where, `og:url is "${ogUrl}", expected "${expectedCanonical}"`)

  if (pick(html, /<meta\s+property="og:type"\s+content="([^"]+)"/) !== route.ogType) {
    fail(where, 'og:type does not match the route')
  }

  const description = pick(html, /<meta\s+name="description"\s+content="([^"]+)"/)
  if (!description) fail(where, 'no meta description')

  const robots = pick(html, /<meta\s+name="robots"\s+content="([^"]+)"/)
  if (robots !== PREVIEW_ROBOTS) fail(where, `robots is "${robots}", expected "${PREVIEW_ROBOTS}"`)

  for (const [label, re] of [
    ['<title>', /<title>/g],
    ['robots', /<meta\s+name="robots"/g],
    ['canonical', /<link\s+rel="canonical"/g],
    ['og:url', /<meta\s+property="og:url"/g],
    ['description', /<meta\s+name="description"/g],
  ]) {
    const count = (html.match(re) ?? []).length
    if (count !== 1) fail(where, `expected exactly 1 ${label}, found ${count}`)
  }

  if (seenTitles.has(title)) fail(where, `title collides with ${seenTitles.get(title)}`)
  else seenTitles.set(title, where)

  const h1s = (html.match(/<h1[\s>]/g) ?? []).length
  if (h1s !== 1) fail(where, `expected exactly 1 prerendered <h1>, found ${h1s}`)
  if (html.includes('<div id="root"></div>')) fail(where, 'root div is empty')
  if (html.includes('<h2 class="pr-h2">Method</h2>')) fail(where, 'draft method steps leaked into the static shell')
  if (html.includes('<style')) fail(where, 'inline stylesheet leaked into the CSP-controlled shell')
  if (executableInlineScriptExists(html)) fail(where, 'inline executable script leaked into the CSP-controlled shell')
  if (/(?:loremflickr|staticflickr|images\.unsplash|cloudflareinsights)/i.test(html)) {
    fail(where, 'third-party runtime origin leaked into emitted HTML')
  }

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  const expectedSchemas = structuredDataFor(route)
  if (blocks.length !== expectedSchemas.length) {
    fail(where, `expected ${expectedSchemas.length} JSON-LD block(s), found ${blocks.length}`)
  }
  for (const [, body] of blocks) {
    try {
      const parsed = JSON.parse(body.replace(/\\u003c/g, '<'))
      if (!parsed['@context'] || !parsed['@type']) fail(where, 'JSON-LD missing @context/@type')
      if (containsRecipeType(parsed)) fail(where, 'Recipe JSON-LD is forbidden in controlled preview')
    } catch (error) {
      fail(where, `JSON-LD is not valid JSON (${error.message})`)
    }
  }
}

const notFoundFile = join(dist, '404.html')
if (!existsSync(notFoundFile)) {
  fail('/404', 'dist/404.html is missing')
} else {
  const html = readFileSync(notFoundFile, 'utf8')
  if (!html.includes(`content="${PREVIEW_ROBOTS}"`)) fail('/404', 'missing controlled-preview robots')
}

const redirects = join(dist, '_redirects')
if (existsSync(redirects)) {
  const body = readFileSync(redirects, 'utf8')
  if (/^\s*\/\*\s+\/index\.html\s+200/m.test(body)) {
    fail('_redirects', 'SPA catch-all rewrite is present and would reintroduce soft 404s')
  }
}

const sitemapFile = join(dist, 'sitemap.xml')
if (!existsSync(sitemapFile)) {
  fail('sitemap.xml', 'not generated')
} else {
  const xml = readFileSync(sitemapFile, 'utf8')
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  if (locs.length !== 0) fail('sitemap.xml', 'controlled preview sitemap must not advertise URLs')
}

if (routes.some((route) => route.indexable)) {
  fail('route model', 'controlled preview unexpectedly contains an indexable route')
}

/* --------------------------------------------------- withheld procedures -- */

// Vite receives a transformed preview catalog. Assert the emitted bundle does
// not contain the raw procedure fields or an actual draft step from source.
const artifact = walk(dist)
  .filter((file) => /\.(?:js|html|json)$/i.test(file))
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n')

if (/\bingredients\s*:/i.test(artifact) || /\bmethod\s*:/i.test(artifact)) {
  fail('preview bundle', 'draft ingredient or method fields were shipped to the browser')
}

for (const step of catalog.dishes.flatMap((dish) => dish.method ?? []).filter((step) => step.length > 24)) {
  if (artifact.includes(step)) {
    fail('preview bundle', 'a raw draft procedure step was shipped to the browser')
    break
  }
}

if (failures.length) {
  console.error(`\n✗ build verification failed (${failures.length} problem(s)):\n`)
  for (const failure of failures) console.error(`  • ${failure}`)
  console.error('')
  process.exit(1)
}

console.log(`✓ build verified: ${routes.length} controlled-preview routes, 404, and empty sitemap`)
