/**
 * Build route-specific static documents from the Vite shell.
 *
 * Controlled-preview invariant: every route is noindex, the sitemap is empty,
 * no recipe-rich-result markup is emitted, and the crawler-visible shell never
 * publishes draft method steps as a validated procedure.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildRoutes,
  titleFor,
  canonicalFor,
  structuredDataFor,
  DEFAULT_OG_IMAGE,
  PREVIEW_ROBOTS,
  SITE_NAME,
} from '../src/data/seo.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const catalog = JSON.parse(readFileSync(join(root, 'src/data/catalog.json'), 'utf8'))
const routes = buildRoutes(catalog)
const template = readFileSync(join(dist, 'index.html'), 'utf8')

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function findFont(prefix) {
  const assets = join(dist, 'assets')
  return readdirSync(assets).find((file) => file.startsWith(prefix) && file.endsWith('.woff2'))
}

const criticalFonts = [
  findFont('fraunces-latin-opsz-normal'),
  findFont('geist-latin-wght-normal'),
].filter(Boolean)

function headFor(route) {
  const title = titleFor(route)
  const canonical = canonicalFor(route)
  const description = route.description
  const parts = [
    `<meta name="robots" content="${PREVIEW_ROBOTS}" />`,
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(canonical)}" />`,
  ]

  for (const font of criticalFonts) {
    parts.push(`<link rel="preload" as="font" type="font/woff2" href="/assets/${font}" crossorigin />`)
  }

  parts.push(
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:type" content="${esc(route.ogType)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:image" content="${esc(DEFAULT_OG_IMAGE)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(SITE_NAME)} — ${esc(route.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(DEFAULT_OG_IMAGE)}" />`,
  )

  for (const schema of structuredDataFor(route)) {
    const json = JSON.stringify(schema).replace(/</g, '\\u003c')
    parts.push(`<script type="application/ld+json">${json}</script>`)
  }

  return parts.map((part) => `    ${part}`).join('\n')
}

function navLink(route, href, label) {
  const current = route.path === href ? ' aria-current="page"' : ''
  return `<a href="${href}"${current}>${label}</a>`
}

/**
 * A small, semantic same-origin shell is visible until React replaces it. It
 * avoids the dangerous implication that a draft method is an approved recipe.
 */
function shellFor(route) {
  const safetyNote = route.path.startsWith('/dish/')
    ? '<p class="pr-status">Recipe draft: this page is not kitchen-tested and must not be used as validated cooking or food-safety guidance.</p>'
    : ''

  return `<main class="pr-shell" id="pr-main" tabindex="-1">
        <a class="pr-skip" href="#pr-content">Skip to content</a>
        <div class="pr-inner">
          <header class="pr-header">
            <a class="pr-brand" href="/" aria-label="Gochujang home">Gochujang</a>
            <nav class="pr-nav" aria-label="Primary navigation">
              ${navLink(route, '/explore', 'Explore')}
              ${navLink(route, '/about', 'About')}
              ${navLink(route, '/contact', 'Contact')}
            </nav>
          </header>
          <section class="pr-content" id="pr-content" aria-labelledby="pr-title">
            <p class="pr-kicker">Controlled preview</p>
            <h1 class="pr-h1" id="pr-title">${esc(route.heading)}</h1>
            ${(route.shell ?? []).map((paragraph) => `<p class="pr-p">${esc(paragraph)}</p>`).join('\n            ')}
            ${safetyNote}
          </section>
          <footer class="pr-footer">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/editorial-policy">Editorial policy</a>
          </footer>
        </div>
      </main>`
}

function render(route) {
  let html = template
  html = html
    .replace(/[ \t]*<title>[^<]*<\/title>\n?/, '')
    .replace(/[ \t]*<meta\s+name="robots"[^>]*>\n?/, '')
    .replace(/[ \t]*<meta\s+name="description"[^>]*>\n?/, '')
    .replace(/[ \t]*<link\s+rel="canonical"[^>]*>\n?/, '')
    .replace(/[ \t]*<meta\s+property="og:[^>]*>\n?/g, '')
    .replace(/[ \t]*<meta\s+name="twitter:[^>]*>\n?/g, '')
    .replace(/[ \t]*<script\s+type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '')

  const shellPattern = /<!--prerender-shell:start-->[\s\S]*?<!--prerender-shell:end-->/
  if (!shellPattern.test(html)) throw new Error(`prerender: missing shell markers for ${route.path}`)

  html = html.replace('</head>', `${headFor(route)}\n  </head>`)
  html = html.replace(
    shellPattern,
    `<!--prerender-shell:start-->\n      ${shellFor(route)}\n      <!--prerender-shell:end-->`,
  )

  if (!html.includes('<title>') || html.includes('<div id="root"></div>')) {
    throw new Error(`prerender: template rewrite failed for ${route.path}`)
  }
  return html
}

function outFile(path) {
  return path === '/' ? join(dist, 'index.html') : join(dist, path.slice(1), 'index.html')
}

let count = 0
for (const route of routes) {
  const file = outFile(route.path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, render(route), 'utf8')
  count++
}

const notFound = render({
  path: '/404',
  title: 'Page not found',
  description: 'The page you are looking for does not exist.',
  ogType: 'website',
  indexable: false,
  heading: 'This dish is off the menu.',
  shell: ['The page you are chasing does not exist.'],
})
writeFileSync(join(dist, '404.html'), notFound, 'utf8')

const indexable = routes.filter((route) => route.indexable)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Controlled preview: no URLs are eligible for indexing. -->
</urlset>
`
writeFileSync(join(dist, 'sitemap.xml'), sitemap, 'utf8')

console.log(
  `prerender: ${count} routes + 404.html; sitemap: ${indexable.length} indexable URLs; preloaded fonts: ${criticalFonts.length}`,
)
