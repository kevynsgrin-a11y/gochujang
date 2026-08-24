/**
 * Platform release gate for P1/P2 PWA and delivery work.
 *
 * It is deliberately source- and build-artifact-based: we can verify the
 * installability contract and cache policy without pretending to have field
 * Core Web Vitals or turning controlled-preview pages into offline content.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const dist = join(root, 'dist')
const failures = []

function fail(message) {
  failures.push(message)
}

function assert(condition, message) {
  if (!condition) fail(message)
}

function text(file) {
  return readFileSync(join(root, file), 'utf8')
}

function pngSize(file) {
  const data = readFileSync(file)
  const signature = '89504e470d0a1a0a'
  if (data.subarray(0, 8).toString('hex') !== signature) {
    throw new Error(`${file} is not a PNG`)
  }
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) }
}

function hasThirdPartyOrigin(value) {
  return [...value.matchAll(/https?:\/\/[^\s"'<)]+/g)].some((match) => !match[0].startsWith('https://gochujang.net'))
}

const manifestFile = join(publicDir, 'manifest.webmanifest')
let manifest
try {
  manifest = JSON.parse(readFileSync(manifestFile, 'utf8'))
} catch (error) {
  fail(`manifest.webmanifest is not valid JSON (${error.message})`)
}

if (manifest) {
  assert(manifest.name === 'Gochujang', 'manifest name must be Gochujang')
  assert(manifest.short_name === 'Gochujang', 'manifest short_name must be Gochujang')
  assert(manifest.id === '/', 'manifest id must be /')
  assert(manifest.start_url === '/', 'manifest start_url must be /')
  assert(manifest.scope === '/', 'manifest scope must be /')
  assert(manifest.display === 'standalone', 'manifest display must be standalone')
  assert(manifest.theme_color === '#E8542E', 'manifest theme_color drifted')
  assert(manifest.background_color === '#161210', 'manifest background_color drifted')
  assert(/controlled culinary preview/i.test(manifest.description ?? ''), 'manifest must disclose controlled-preview status')
  assert(!hasThirdPartyOrigin(JSON.stringify(manifest)), 'manifest must not contain a third-party origin')

  const requiredIcons = [
    ['/icon-192.png', '192x192', 'any'],
    ['/icon-512.png', '512x512', 'any'],
    ['/icon-maskable-512.png', '512x512', 'maskable'],
  ]
  for (const [src, sizes, purpose] of requiredIcons) {
    const icon = manifest.icons?.find((candidate) => candidate.src === src)
    assert(!!icon, `manifest is missing ${src}`)
    if (!icon) continue
    assert(icon.sizes === sizes, `${src} must declare ${sizes}`)
    assert((icon.purpose ?? '').split(/\s+/).includes(purpose), `${src} must declare ${purpose} purpose`)
    const [width, height] = sizes.split('x').map(Number)
    try {
      const actual = pngSize(join(publicDir, src.slice(1)))
      assert(actual.width === width && actual.height === height, `${src} dimensions do not match ${sizes}`)
    } catch (error) {
      fail(error.message)
    }
  }
}

const index = text('index.html')
assert(/<link rel="manifest" href="\/manifest\.webmanifest"\s*\/>/.test(index), 'index.html is missing the manifest link')
assert(/name="mobile-web-app-capable" content="yes"/.test(index), 'index.html is missing mobile web app capability')
assert(/name="apple-mobile-web-app-capable" content="yes"/.test(index), 'index.html is missing Apple web app capability')
assert(/name="robots" content="noindex, nofollow, noarchive"/.test(index), 'index.html must preserve controlled-preview robots')
assert(!hasThirdPartyOrigin(index), 'index.html must not add a third-party origin')

const main = text('src/main.tsx')
assert(main.includes("navigator.serviceWorker.register('/sw.js', { scope: '/' })"), 'main.tsx is missing service-worker registration')
assert(main.includes('window.isSecureContext'), 'service-worker registration must require a secure context')
assert(main.includes("location.hostname === 'localhost'"), 'service-worker registration must stay disabled on local development hosts')
assert(main.includes("window.addEventListener('load'"), 'service-worker registration must wait for load')

const sw = text('public/sw.js')
assert(sw.includes("const OFFLINE_URL = '/offline.html'"), 'service worker must have a fixed offline fallback')
assert(sw.includes("request.mode === 'navigate'"), 'service worker must identify navigations')
assert(sw.includes('networkFirstNavigation(request)'), 'service-worker navigations must be network-first')
assert(sw.includes("url.pathname.startsWith('/assets/')"), 'service worker must scope caching to build assets')
assert(sw.includes("url.origin !== self.location.origin"), 'service worker must reject cross-origin requests')
assert(sw.includes("['script', 'style', 'font', 'image']"), 'service worker must restrict cached destinations')
assert(!hasThirdPartyOrigin(sw), 'service worker must not reference a third-party origin')

const navFunction = sw.match(/async function networkFirstNavigation\(request\) \{[\s\S]*?\n\}/)?.[0] ?? ''
assert(!navFunction.includes('cache.put'), 'service worker must never cache HTML navigations')

const offline = text('public/offline.html')
assert(/name="robots" content="noindex, nofollow, noarchive"/.test(offline), 'offline page must remain noindex')
assert(/does not cache recipe drafts or food-safety guidance/i.test(offline), 'offline page must disclose its content boundary')
assert(!hasThirdPartyOrigin(offline), 'offline page must not add a third-party origin')

const headers = text('public/_headers')
assert(/worker-src 'self'/.test(headers), 'CSP must retain worker-src self')
assert(/^\/sw\.js\r?\n[ \t]+Cache-Control: no-cache, no-store, must-revalidate/m.test(headers), 'sw.js must be update-checked')
assert(/Service-Worker-Allowed: \//.test(headers), 'sw.js must be allowed to control the root scope')

if (existsSync(dist)) {
  for (const file of ['manifest.webmanifest', 'sw.js', 'offline.html']) {
    assert(existsSync(join(dist, file)), `build output is missing ${file}`)
  }
  if (existsSync(join(dist, 'index.html'))) {
    const builtIndex = readFileSync(join(dist, 'index.html'), 'utf8')
    assert(/<link rel="manifest" href="\/manifest\.webmanifest"\s*\/>/.test(builtIndex), 'built HTML is missing manifest link')
    assert(/name="robots" content="noindex, nofollow, noarchive"/.test(builtIndex), 'built HTML lost controlled-preview robots')

    // P1 #10: the page begins with a complete prerendered shell. The initial
    // module only schedules the interactive app, which is imported after idle
    // or explicit user intent. Keep that parse/execute boundary under the
    // audit's 180 KB raw budget and reject accidental preloads of route code.
    const entry = builtIndex.match(/<script type="module" crossorigin src="(\/assets\/index-[^"]+\.js)"><\/script>/)?.[1]
    assert(!!entry, 'built HTML is missing the initial module entry')
    if (entry) {
      const bytes = statSync(join(dist, entry.slice(1))).size
      assert(bytes < 180 * 1024, `initial JavaScript entry is ${bytes} bytes; budget is under 184320 bytes`)
    }

    const bootstrap = readdirSync(join(dist, 'assets')).find((name) => /^bootstrap-[A-Za-z0-9_-]+\.js$/.test(name))
    assert(!!bootstrap, 'missing deferred interactive bootstrap chunk')
    if (bootstrap) {
      const bytes = statSync(join(dist, 'assets', bootstrap)).size
      assert(bytes < 180 * 1024, `interactive bootstrap is ${bytes} bytes; budget is under 184320 bytes`)
    }

    const preloads = [...builtIndex.matchAll(/<link rel="modulepreload"[^>]+href="([^"]+)"/g)].map((match) => match[1])
    assert(
      !preloads.some((href) => /(?:Explore|Kitchen|DishDetail|bootstrap)-/i.test(href)),
      'initial HTML preloads route or interactive-app code',
    )

    const assetNames = readdirSync(join(dist, 'assets'))
    for (const routeChunk of ['Explore', 'Kitchen', 'DishDetail']) {
      assert(assetNames.some((name) => name.startsWith(`${routeChunk}-`) && name.endsWith('.js')), `missing route chunk: ${routeChunk}`)
    }
  }
}

if (failures.length) {
  console.error(`\n✗ platform P1/P2 verification failed (${failures.length} problem(s)):\n`)
  for (const message of failures) console.error(`  - ${message}`)
  console.error('')
  process.exit(1)
}

console.log('✓ platform P1/P2 verification passed: manifest, icons, noindex, offline boundary, service-worker cache policy, and build output')
