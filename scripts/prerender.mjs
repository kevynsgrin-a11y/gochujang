/**
 * Build-time prerenderer.
 *
 * Vite emits one SPA shell whose <head> describes the homepage, so every route
 * — /explore, /about, each /dish/... — served the wrong title, description,
 * canonical, and social card to any crawler that does not execute JavaScript.
 * This script rewrites that shell once per route using the shared model in
 * src/data/seo.js, and writes a real file per route so Cloudflare Pages can
 * serve each one directly (and return a true 404 for everything else).
 *
 * It also emits the sitemap from the same model, so route list and sitemap
 * cannot drift apart.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildRoutes,
  titleFor,
  canonicalFor,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  REMOTE_IMAGE_ORIGIN,
} from '../src/data/seo.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

const catalog = JSON.parse(readFileSync(join(root, 'src/data/catalog.json'), 'utf8'))
const routes = buildRoutes(catalog)
const template = readFileSync(join(dist, 'index.html'), 'utf8')

/** Content revision date for the sitemap — the build date, in UTC. */
const BUILD_DATE = (process.env.SOURCE_DATE || new Date().toISOString()).slice(0, 10)

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/* ------------------------------------------------ above-the-fold fonts -- */

// Hashed at build time, so discover rather than hardcode. Only the Latin
// display + body subsets actually used above the fold are preloaded.
function findFont(prefix) {
  const files = readdirSync(join(dist, 'assets'))
  return files.find((f) => f.startsWith(prefix) && f.endsWith('.woff2'))
}
const criticalFonts = [
  findFont('fraunces-latin-opsz-normal'),
  findFont('geist-latin-wght-normal'),
].filter(Boolean)

/* ------------------------------------------------------------- <head> -- */

function headFor(route) {
  const title = titleFor(route)
  const canonical = canonicalFor(route)
  const desc = route.description
  const parts = []

  if (!route.indexable) {
    parts.push(`<meta name="robots" content="noindex, follow" />`)
  }

  parts.push(`<title>${esc(title)}</title>`)
  parts.push(`<meta name="description" content="${esc(desc)}" />`)
  parts.push(`<link rel="canonical" href="${esc(canonical)}" />`)
  parts.push(`<link rel="manifest" href="/manifest.webmanifest" />`)

  // Only routes that actually render dish photography pay for the handshake.
  if (route.remoteImages) {
    parts.push(`<link rel="preconnect" href="${REMOTE_IMAGE_ORIGIN}" crossorigin />`)
    parts.push(`<link rel="dns-prefetch" href="${REMOTE_IMAGE_ORIGIN}" />`)
  }

  for (const f of criticalFonts) {
    parts.push(
      `<link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin />`,
    )
  }

  parts.push(`<meta property="og:title" content="${esc(title)}" />`)
  parts.push(`<meta property="og:description" content="${esc(desc)}" />`)
  parts.push(`<meta property="og:type" content="${esc(route.ogType)}" />`)
  parts.push(`<meta property="og:url" content="${esc(canonical)}" />`)
  parts.push(`<meta property="og:site_name" content="${esc(SITE_NAME)}" />`)
  parts.push(`<meta property="og:image" content="${esc(DEFAULT_OG_IMAGE)}" />`)
  parts.push(`<meta property="og:image:width" content="1200" />`)
  parts.push(`<meta property="og:image:height" content="630" />`)
  parts.push(
    `<meta property="og:image:alt" content="${esc(SITE_NAME)} — ${esc(route.title)}" />`,
  )
  parts.push(`<meta name="twitter:card" content="summary_large_image" />`)
  parts.push(`<meta name="twitter:title" content="${esc(title)}" />`)
  parts.push(`<meta name="twitter:description" content="${esc(desc)}" />`)
  parts.push(`<meta name="twitter:image" content="${esc(DEFAULT_OG_IMAGE)}" />`)

  for (const schema of route.jsonLd?.() ?? []) {
    // </script> inside JSON would close the tag early; escape defensively.
    const json = JSON.stringify(schema).replace(/</g, '\\u003c')
    parts.push(`<script type="application/ld+json">${json}</script>`)
  }

  return parts.map((p) => '    ' + p).join('\n')
}

/* ------------------------------------------------------------- shell -- */

/**
 * A crawler-visible, semantically correct content shell.
 *
 * main.tsx mounts with createRoot().render() (not hydrateRoot), so React
 * REPLACES these nodes on mount — there is no hydration contract to break.
 * Until then it gives first-pass parsers a real H1 and real copy instead of
 * an empty div, and gives humans on slow connections something on-brand.
 */
function shellFor(route) {
  const body = []
  body.push(`<h1 class="pr-h1">${esc(route.heading)}</h1>`)
  for (const p of route.shell ?? []) {
    body.push(`<p class="pr-p">${esc(p)}</p>`)
  }
  if (route.steps?.length) {
    body.push('<h2 class="pr-h2">Method</h2>')
    body.push('<ol class="pr-list">')
    for (const s of route.steps) body.push(`<li>${esc(s)}</li>`)
    body.push('</ol>')
  }
  return `<div class="pr-shell">
      <div class="pr-inner">
${body.map((l) => '        ' + l).join('\n')}
      </div>
    </div>`
}

// Scoped, token-driven styling so the pre-JS paint is on-brand rather than
// raw user-agent HTML. Removed from the DOM the moment React mounts.
const SHELL_CSS = `<style id="pr-shell-css">
      .pr-shell{min-height:100svh;display:flex;align-items:center;background:rgb(var(--bg,245 239 230));color:rgb(var(--text,26 19 16))}
      .pr-inner{width:100%;max-width:72rem;margin:0 auto;padding:6rem 1.5rem}
      .pr-h1{font-family:var(--font-display,Georgia,serif);font-weight:600;font-size:clamp(2.25rem,6vw,4rem);line-height:1.05;margin:0}
      .pr-h2{font-family:var(--font-display,Georgia,serif);font-weight:600;font-size:1.5rem;margin:2.5rem 0 .75rem}
      .pr-p{font-family:var(--font-body,system-ui,sans-serif);color:rgb(var(--text-muted,92 81 72));max-width:44rem;margin:1.25rem 0 0;line-height:1.6}
      .pr-list{font-family:var(--font-body,system-ui,sans-serif);color:rgb(var(--text-muted,92 81 72));max-width:44rem;line-height:1.6;padding-left:1.25rem}
      .pr-list li{margin:.5rem 0}
    </style>`

/* -------------------------------------------------------------- write -- */

function render(route) {
  let html = template

  // Strip every SEO-managed tag the Vite template hardcoded for the homepage,
  // then re-emit the full set for THIS route. Attribute values never contain
  // '>', so [^>]* safely spans the template's multi-line tags.
  html = html
    .replace(/[ \t]*<title>[^<]*<\/title>\n?/, '')
    .replace(/[ \t]*<meta\s+name="description"[^>]*>\n?/, '')
    .replace(/[ \t]*<link\s+rel="canonical"[^>]*>\n?/, '')
    .replace(/[ \t]*<meta\s+property="og:[^>]*>\n?/g, '')
    .replace(/[ \t]*<meta\s+name="twitter:[^>]*>\n?/g, '')

  html = html.replace('</head>', `${headFor(route)}\n    ${SHELL_CSS}\n  </head>`)
  html = html.replace('<div id="root"></div>', `<div id="root">${shellFor(route)}</div>`)

  if (html.includes('<div id="root"></div>') || !html.includes('<title>')) {
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

/* --------------------------------------------------------------- 404 -- */

// Cloudflare Pages serves /404.html with a real 404 status for any path that
// does not match a file — which is why the SPA catch-all rewrite is gone.
const notFound = render({
  path: '/404',
  title: 'Page not found',
  description: 'The page you are looking for does not exist.',
  ogType: 'website',
  indexable: false,
  heading: 'This dish is off the menu.',
  shell: ["The page you're chasing doesn't exist — but there's plenty more heat where that came from."],
  jsonLd: () => [],
})
writeFileSync(join(dist, '404.html'), notFound, 'utf8')

/* ----------------------------------------------------------- sitemap -- */

const indexable = routes.filter((r) => r.indexable)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable
  .map(
    (r) => `  <url>
    <loc>${esc(canonicalFor(r))}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${r.changefreq ?? 'monthly'}</changefreq>
    <priority>${r.priority ?? '0.5'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`
writeFileSync(join(dist, 'sitemap.xml'), sitemap, 'utf8')

console.log(
  `prerender: ${count} routes + 404.html; sitemap: ${indexable.length} indexable URLs (${routes.length - indexable.length} excluded); preloaded fonts: ${criticalFonts.length}`,
)
