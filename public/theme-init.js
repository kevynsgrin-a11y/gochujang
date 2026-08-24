/*
 * A tiny external first-paint theme initializer.
 *
 * Keeping this in a same-origin file, rather than inline in index.html, lets
 * Cloudflare enforce script-src 'self' without a per-build CSP hash or nonce.
 */
;(function applyInitialTheme() {
  try {
    var key = 'gochujang-theme'
    var stored = window.localStorage.getItem(key)
    var dark = stored
      ? stored === 'dark'
      : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    var root = document.documentElement

    root.classList.toggle('dark', dark)
    root.dataset.theme = dark ? 'dark' : 'light'

    var themeColor = document.querySelector('meta[name="theme-color"]')
    if (themeColor) themeColor.setAttribute('content', dark ? '#161210' : '#F5EFE6')
  } catch {
    // Theme persistence is an enhancement; the readable light shell is the fallback.
  }
})()
