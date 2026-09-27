/*
 * GA4 bootstrap for gochujang.net.
 *
 * Kept in a same-origin file, like theme-init.js, so Cloudflare can enforce
 * script-src 'self' without 'unsafe-inline', a per-build hash, or a nonce. The
 * gtag.js loader is the separate <script async> tag in index.html.
 */
window.dataLayer = window.dataLayer || []
function gtag() {
  window.dataLayer.push(arguments)
}
gtag('js', new Date())
gtag('config', 'G-L29VWHQXDF')
