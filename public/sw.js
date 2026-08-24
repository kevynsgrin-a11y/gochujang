/*
 * Gochujang controlled-preview service worker.
 *
 * Documents are always fetched from the network first and are never cached.
 * This protects fresh preview disclosures, noindex metadata, and food-safety
 * controls from being replaced by an old offline copy. Only immutable Vite
 * assets and the intentionally content-free offline fallback use CacheStorage.
 */

const CACHE_NAME = 'gochujang-preview-offline-v1'
const OFFLINE_URL = '/offline.html'
const OFFLINE_SHELL = [OFFLINE_URL, '/pr-shell.css', '/theme-init.js']

function isCacheableAsset(request, url) {
  return (
    url.origin === self.location.origin &&
    url.pathname.startsWith('/assets/') &&
    ['script', 'style', 'font', 'image'].includes(request.destination)
  )
}

async function networkFirstNavigation(request) {
  try {
    return await fetch(request)
  } catch {
    return (await caches.match(OFFLINE_URL)) ?? Response.error()
  }
}

async function cacheFirstAsset(request) {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (response.ok && response.type === 'basic') {
    await cache.put(request, response.clone())
  }
  return response
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(OFFLINE_SHELL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((name) => name.startsWith('gochujang-preview-') && name !== CACHE_NAME).map((name) => caches.delete(name))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request))
    return
  }

  if (isCacheableAsset(request, url)) {
    event.respondWith(cacheFirstAsset(request))
  }
})
