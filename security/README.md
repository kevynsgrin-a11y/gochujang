# Cloudflare Pages security release gate

The production project is Git-integrated Cloudflare Pages. The site-wide
`public/_headers` rule enforces a self-only CSP, HSTS, anti-framing,
MIME-sniffing, COOP/CORP, Permissions-Policy, Referrer-Policy, no CORS
allowance, and `X-Robots-Tag: noindex, nofollow, noarchive`.

Run before release:

```powershell
node security/validate-headers.mjs --require-app-ready
```

The gate rejects executable inline scripts in `index.html` and the known
retired third-party runtime origins in application source. If future Pages
Functions or SSR are added, mirror these headers on every dynamic response:
Cloudflare Pages only applies `_headers` to static assets.
