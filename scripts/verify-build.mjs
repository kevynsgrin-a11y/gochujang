/**
 * Build gate for the prerendered output.
 *
 * Encodes the audit's acceptance criteria as assertions so the class of defect
 * it found — every route serving the homepage's title/canonical/OG, no schema,
 * soft 404s, a sitemap that drifts from the route list — fails the build
 * instead of reaching production again.
 *
 * Checks the built artifact, not the source, so it also catches a prerender
 * step that silently did not run.
 */
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildRoutes, titleFor, canonicalFor } from '../src/data/seo.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

const catalog = JSON.parse(readFileSync(join(root, 'src/data/catalog.json'), 'utf8'))
const routes = buildRoutes(catalog)

const failures = []
const fail = (where, msg) => failures.push(`${where}: ${msg}`)

const pick = (html, re) => {
  const m = html.match(re)
  return m ? m[1] : null
}

const seenTitles = new Map()

for (const route of routes) {
  const file =
    route.path === '/' ? join(dist, 'index.html') : join(dist, route.path.slice(1), 'index.html')
  const where = route.path

  if (!existsSync(file)) {
    fail(where, 'no prerendered HTML was emitted')
    continue
  }
  const html = readFileSync(file, 'utf8')

  // --- metadata is route-specific, not the homepage's -----------------------
  const title = pick(html, /<title>([^<]*)<\/title>/)
  const expectedTitle = titleFor(route)
  if (title !== expectedTitle) fail(where, `title is "${title}", expected "${expectedTitle}"`)

  const canonical = pick(html, /<link\s+rel="canonical"\s+href="([^"]+)"/)
  const expectedCanonical = canonicalFor(route)
  if (canonical !== expectedCanonical) {
    fail(where, `canonical is "${canonical}", expected "${expectedCanonical}"`)
  }

  const ogUrl = pick(html, /<meta\s+property="og:url"\s+content="([^"]+)"/)
  if (ogUrl !== expectedCanonical) fail(where, `og:url is "${ogUrl}", expected "${expectedCanonical}"`)

  const ogType = pick(html, /<meta\s+property="og:type"\s+content="([^"]+)"/)
  if (ogType !== route.ogType) fail(where, `og:type is "${ogType}", expected "${route.ogType}"`)

  const desc = pick(html, /<meta\s+name="description"\s+content="([^"]+)"/)
  if (!desc) fail(where, 'no meta description')

  // Exactly one of each managed tag — a leftover duplicate from the template
  // would leave crawlers picking whichever they saw first.
  for (const [label, re] of [
    ['<title>', /<title>/g],
    ['canonical', /<link\s+rel="canonical"/g],
    ['og:url', /<meta\s+property="og:url"/g],
    ['description', /<meta\s+name="description"/g],
  ]) {
    const n = (html.match(re) ?? []).length
    if (n !== 1) fail(where, `expected exactly 1 ${label}, found ${n}`)
  }

  // --- titles are unique across the site ------------------------------------
  if (seenTitles.has(title)) {
    fail(where, `title collides with ${seenTitles.get(title)}`)
  } else {
    seenTitles.set(title, where)
  }

  // --- a crawler-visible H1 exists before JavaScript -------------------------
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length
  if (h1s !== 1) fail(where, `expected exactly 1 prerendered <h1>, found ${h1s}`)

  if (html.includes('<div id="root"></div>')) fail(where, 'root div is empty — shell not injected')

  // --- structured data is present and parseable ----------------------------
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  const expectedSchemas = route.jsonLd?.() ?? []
  if (blocks.length !== expectedSchemas.length) {
    fail(where, `expected ${expectedSchemas.length} JSON-LD block(s), found ${blocks.length}`)
  }
  for (const [, body] of blocks) {
    try {
      const parsed = JSON.parse(body.replace(/\\u003c/g, '<'))
      if (!parsed['@context'] || !parsed['@type']) fail(where, 'JSON-LD missing @context/@type')
    } catch (e) {
      fail(where, `JSON-LD is not valid JSON (${e.message})`)
    }
  }

  // --- indexability is declared, not implied --------------------------------
  const robots = pick(html, /<meta\s+name="robots"\s+content="([^"]+)"/)
  if (route.indexable && robots && robots.includes('noindex')) {
    fail(where, 'indexable route carries a noindex robots tag')
  }
  if (!route.indexable && !(robots ?? '').includes('noindex')) {
    fail(where, 'preview route is missing its noindex robots tag')
  }
}

/* ------------------------------------------------------------------ 404 -- */

const notFoundFile = join(dist, '404.html')
if (!existsSync(notFoundFile)) {
  fail('/404', 'dist/404.html is missing — unknown paths would soft-404')
} else {
  const html = readFileSync(notFoundFile, 'utf8')
  if (!/<meta\s+name="robots"\s+content="[^"]*noindex/.test(html)) {
    fail('/404', 'the 404 page is missing its noindex robots tag')
  }
}

/* -------------------------------------------------------------- redirects -- */

const redirects = join(dist, '_redirects')
if (existsSync(redirects)) {
  const body = readFileSync(redirects, 'utf8')
  // The SPA catch-all is exactly what turned every unknown path into a 200.
  if (/^\s*\/\*\s+\/index\.html\s+200/m.test(body)) {
    fail('_redirects', 'SPA catch-all rewrite is back — it re-introduces 200 soft 404s')
  }
}

/* ---------------------------------------------------------------- sitemap -- */

const sitemapFile = join(dist, 'sitemap.xml')
if (!existsSync(sitemapFile)) {
  fail('sitemap.xml', 'not generated')
} else {
  const xml = readFileSync(sitemapFile, 'utf8')
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  const expected = routes.filter((r) => r.indexable).map(canonicalFor)

  for (const url of expected) {
    if (!locs.includes(url)) fail('sitemap.xml', `missing indexable URL ${url}`)
  }
  for (const url of locs) {
    if (!expected.includes(url)) fail('sitemap.xml', `lists non-indexable or unknown URL ${url}`)
  }
  if (new Set(locs).size !== locs.length) fail('sitemap.xml', 'contains duplicate URLs')

  // A uniform hardcoded lastmod across every URL was the original defect.
  const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1])
  if (lastmods.some((d) => !/^\d{4}-\d{2}-\d{2}$/.test(d))) {
    fail('sitemap.xml', 'a lastmod is not an ISO date')
  }
}

/* ----------------------------------------------------------------- report -- */

if (failures.length) {
  console.error(`\n✗ build verification failed (${failures.length} problem(s)):\n`)
  for (const f of failures) console.error(`  • ${f}`)
  console.error('')
  process.exit(1)
}

console.log(
  `✓ build verified: ${routes.length} routes, ${routes.filter((r) => r.indexable).length} indexable, 404 + sitemap present`,
)
