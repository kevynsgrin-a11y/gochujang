#!/usr/bin/env node

/**
 * Release gate for the Cloudflare Pages `_headers` configuration.
 *
 * It intentionally validates the actual deployment platform only. The
 * production project is Git-integrated Cloudflare Pages; Vercel is not a
 * current deployment target for this repository.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const csp = "default-src 'self'; base-uri 'none'; block-all-mixed-content; connect-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'none'; img-src 'self' data:; manifest-src 'self'; media-src 'self'; object-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests; worker-src 'self'"

const expectedSiteHeaders = {
  'Content-Security-Policy': csp,
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), picture-in-picture=(), usb=(), web-share=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
}

const errors = []
const expect = (condition, message) => {
  if (!condition) errors.push(message)
}

function parseCloudflareHeaders(text) {
  const rules = new Map()
  let currentPath = null

  for (const rawLine of text.split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith('#')) continue
    if (!/^\s/.test(rawLine)) {
      currentPath = rawLine.trim()
      rules.set(currentPath, new Map())
      continue
    }
    if (!currentPath) {
      errors.push(`_headers has a header before a path: ${rawLine}`)
      continue
    }
    const line = rawLine.trim()
    if (line.startsWith('! ')) {
      rules.get(currentPath).set(line, '')
      continue
    }
    const divider = line.indexOf(':')
    if (divider <= 0) {
      errors.push(`_headers has an invalid header line: ${rawLine}`)
      continue
    }
    rules.get(currentPath).set(line.slice(0, divider), line.slice(divider + 1).trim())
  }
  return rules
}

function walk(path) {
  const entries = statSync(path).isDirectory() ? readdirSync(path) : []
  return entries.flatMap((entry) => {
    const child = join(path, entry)
    return statSync(child).isDirectory() ? walk(child) : [child]
  })
}

function validateApplicationReadiness() {
  const index = readFileSync(join(repoRoot, 'index.html'), 'utf8')
  const inlineScripts = [...index.matchAll(/<script\b([^>]*)>[\s\S]*?<\/script>/gi)].filter(
    ([, attributes]) => !/\bsrc\s*=/.test(attributes),
  )
  expect(inlineScripts.length === 0, 'index.html contains an inline executable script.')

  const prohibitedOrigins = /(?:cloudflareinsights|loremflickr|staticflickr|images\.unsplash)\.com/i
  const runtimeFiles = [join(repoRoot, 'index.html'), ...walk(join(repoRoot, 'src'))]
    .filter((file) => ['.html', '.js', '.jsx', '.ts', '.tsx'].includes(extname(file)))

  for (const file of runtimeFiles) {
    const content = readFileSync(file, 'utf8')
    expect(
      !prohibitedOrigins.test(content),
      `prohibited third-party runtime origin remains in ${file.slice(repoRoot.length + 1)}.`,
    )
  }
}

const headerFile = join(repoRoot, 'public', '_headers')
const source = readFileSync(headerFile, 'utf8')
const rules = parseCloudflareHeaders(source)
const site = rules.get('/*') ?? new Map()

expect(rules.size <= 100, `_headers has ${rules.size} rules; Cloudflare Pages allows at most 100.`)
for (const [index, line] of source.split(/\r?\n/).entries()) {
  expect(line.length <= 2000, `_headers line ${index + 1} exceeds the 2,000-character limit.`)
}

for (const [name, value] of Object.entries(expectedSiteHeaders)) {
  expect(site.get(name) === value, `expected ${name}: ${value}`)
}
expect(site.has('! Access-Control-Allow-Origin'), 'must remove Pages default Access-Control-Allow-Origin.')
expect(!site.has('Content-Security-Policy-Report-Only'), 'must enforce CSP, not report-only CSP.')
expect(!site.has('Access-Control-Allow-Origin'), 'must not add a CORS allowance.')

const assets = rules.get('/assets/*') ?? new Map()
expect(
  assets.get('Cache-Control') === 'public, max-age=31536000, immutable',
  'asset immutable Cache-Control is missing.',
)

const manifest = rules.get('/manifest.webmanifest') ?? new Map()
expect(manifest.get('Cache-Control') === 'public, max-age=3600', 'manifest Cache-Control is missing.')
expect(
  manifest.get('Content-Type') === 'application/manifest+json; charset=utf-8',
  'manifest Content-Type is missing.',
)

for (const path of ['/robots.txt', '/sitemap.xml']) {
  expect(
    (rules.get(path) ?? new Map()).get('Cache-Control') === 'public, max-age=3600',
    `${path} cache header is missing.`,
  )
}

const scriptDirective = csp
  .split(';')
  .map((directive) => directive.trim())
  .find((directive) => directive.startsWith('script-src '))
expect(scriptDirective === "script-src 'self'", 'script-src must allow self only.')
expect(!/unsafe-inline|cloudflareinsights|https?:/i.test(scriptDirective ?? ''), 'script-src permits inline or third-party code.')
expect(!/(?:cloudflareinsights|loremflickr|staticflickr|images\.unsplash)\.com/i.test(csp), 'CSP permits a retired third-party origin.')

if (process.argv.includes('--require-app-ready')) validateApplicationReadiness()

if (errors.length) {
  console.error('Header validation failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(`Header validation passed${process.argv.includes('--require-app-ready') ? ' (application release gate included)' : ''}.`)
}
