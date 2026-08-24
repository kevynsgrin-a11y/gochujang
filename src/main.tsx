let interactiveStart: Promise<void> | undefined

/**
 * The prerendered shell is complete enough to read and navigate before React
 * loads. Start the richer client application as soon as the browser is idle,
 * or immediately when a visitor signals intent. The idempotent promise avoids
 * duplicate boots when both signals happen close together.
 */
function startInteractiveApp() {
  if (!interactiveStart) {
    interactiveStart = import('./bootstrap.tsx').then(({ startInteractiveApp }) => {
      startInteractiveApp()
    })
  }
  return interactiveStart
}

function scheduleInteractiveApp() {
  const activate = () => {
    void startInteractiveApp()
  }

  window.addEventListener('pointerdown', activate, { once: true, passive: true })
  window.addEventListener('keydown', activate, { once: true })

  const requestIdleCallback = (
    window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number
    }
  ).requestIdleCallback

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(activate, { timeout: 1200 })
  } else {
    window.setTimeout(activate, 300)
  }
}

scheduleInteractiveApp()

// PWA support is strictly progressive. Register after the first load so it
// cannot delay the preview's initial render or input readiness. The worker
// itself uses a network-first document strategy and never stores recipe pages.
function registerOfflineSupport() {
  // Keep local development free from persistent CacheStorage state. Production
  // and Cloudflare preview deployments are HTTPS, so this needs no bundler-only
  // environment type and remains safe in a plain TypeScript DOM build.
  const isLocalHost = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
  if (!window.isSecureContext || isLocalHost || !('serviceWorker' in navigator)) return

  const register = () => {
    void navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      // Offline support is optional; the current preview remains fully usable
      // online if a browser declines or cannot install the worker.
    })
  }

  if (document.readyState === 'complete') register()
  else window.addEventListener('load', register, { once: true })
}

registerOfflineSupport()
