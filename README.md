# Gochujang — controlled culinary preview

Gochujang is a privacy-first, no-collection preview of a future culinary utility.
Its design system, discovery routes, and Kitchen prototype are available for review;
the dishes are editorial drafts, procedures are withheld, personal tracking is not
live, and every route remains intentionally non-indexable until the release evidence
documented in [`docs/content-and-index-release-gate.md`](./docs/content-and-index-release-gate.md) is complete.

> Built as a full front-end overhaul, designed top-to-bottom by a multi-agent
> design fleet (market research → brand → information architecture → content →
> design system → visual art-direction → UX → accessibility → synthesis). The
> resulting master spec lives in [`design/spec/`](./design/spec).

## ✨ Highlights

- **Preview routes**: cinematic Home, filterable Explore mosaic, dish-draft
  detail, the illustrative **Mise** Kitchen (`/kitchen`), About, and factual
  preview governance pages (privacy, terms, contact, editorial policy).
- **Prerendered, controlled HTML** — every route ships its own title, canonical,
  social card, generic page-level JSON-LD, one `<h1>`, and `noindex` before
  JavaScript runs. Recipes and procedures are not published in this release.
- **"Fermented Editorial" design system** — warm-charcoal + bone palette, one
  crimson→persimmon ember accent used _by scarcity_, Fraunces display serif +
  Geist / Geist Mono, fluid type scale, signature gradients, film grain, and
  full **light + dark** themes (all tokens are CSS variables).
- **A guaranteed-render graphic spine** — every image sits on a category-tinted
  gradient + generative ember art + grain, so a slot is **never broken** even
  offline. Category glyphs, a chili SpiceMeter, a 270° Scoville gauge, a flavor
  radar, progress rings, a streak heatmap, and passport seals all ship as local
  inline SVG.
- **Motion that enriches, never gates** — Ken-Burns hero, kinetic headline,
  scroll reveals, magnetic-feeling CTAs, animated data — all gated by
  `prefers-reduced-motion`.
- **Accessibility-first** — one `<h1>` per route, skip link, visible focus,
  named controls, reduced-motion handling, and axe/keyboard regression checks in CI.

## 🧑‍🍳 Tech stack

Vite · React 18 · TypeScript · Tailwind CSS · Framer Motion · React Router ·
self-hosted variable fonts via `@fontsource` · lucide-react icons.

## 🚀 Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check → vite build → prerender → verify
npm run preview   # serve the production build
npm run verify    # re-run the build gate against an existing /dist
```

## 🖼️ Imagery — how to plug in real photos

The design layers real food photography **on top of** the guaranteed gradient
art. Photo wiring lives in a single file: **[`src/data/images.ts`](./src/data/images.ts)**.

`IMAGE_MODE` controls the source:

| Mode         | Behavior                                                                 |
| ------------ | ------------------------------------------------------------------------ |
| `'local'` | Rights-cleared, root-relative assets explicitly listed in `PHOTO`. |
| `'off'`   | Gradient-only editorial art (the current controlled-preview baseline). |

**To use rights-cleared photography after release approval:** set `IMAGE_MODE = 'local'`,
drop responsive assets in `/public` (for example `/photos/galbi-1200.webp` and
`/photos/galbi-1600.webp`), retain the license/credit record outside the bundle,
and map the root-relative path in `PHOTO`:

```ts
export const PHOTO: Record<string, string> = {
  'gochujang-galbi': '/photos/galbi-1200.webp',
  home: '/photos/hero-1600.webp',
}
```

Every slot has a deterministic local fallback. Do not introduce a third-party
image host or preload a hero file until the rights-cleared asset exists.

## 📁 Structure

```
src/
  components/   layout, brand, graphics (SVG), decor, DishCard, StatTile, …
  pages/        Home, Explore, DishDetail, Kitchen, About, NotFound,
                Privacy, Terms, Contact, EditorialPolicy
  data/         catalog (dishes/categories), site config, Mise data,
                image manifest, seo.js (route metadata — single source of truth)
  lib/          theme, motion presets, release gates, and compatibility helpers
  index.css     design tokens (CSS variables, light + dark)
scripts/        prerender.mjs, verify-build.mjs, a11y.mjs
tailwind.config.js   type scale, gradients, radii, shadows, keyframes
design/spec/    the multi-agent design fleet's master spec (reference)
```

## 🔎 Rendering, SEO & the build gate

The site is a client-rendered SPA, but it is **not** served as one. `npm run
build` runs three steps after the type-check:

1. **`vite build`** — bundles the app, with every route except Home split into
   its own lazily-loaded chunk.
2. **`scripts/prerender.mjs`** — writes one real HTML file per route
   (`dist/explore/index.html`, `dist/dish/<slug>/index.html`, …), each carrying
   its own `<title>`, description, canonical, Open Graph / Twitter tags,
   JSON-LD, and a semantic content shell with a real `<h1>`. It also emits
   `dist/404.html` and generates `dist/sitemap.xml`.
3. **`scripts/verify-build.mjs`** — fails the build if any route serves the
   wrong title or canonical, duplicates a title, is missing its `<h1>` or
   JSON-LD, loses its `noindex`, re-introduces the SPA catch-all rewrite, or
   drifts out of sync with the sitemap.
4. **`scripts/p1p2-verify-platform.mjs`** — validates the manifest and icon
   dimensions, mobile/PWA declarations, noindex boundary, service-worker cache
   policy, absence of third-party origins, and built platform files.

Route metadata has exactly one home: **[`src/data/seo.js`](./src/data/seo.js)**.
The prerenderer and the client's `usePageMeta` hook both read it, so the
document a crawler fetches and the document a browser ends up with cannot
disagree. Adding a route means adding it there.

### Deliberate decisions

- **Every route is `noindex`, including the Kitchen.** The sitemap is
  deliberately empty while the release is a controlled preview.
- **Only generic `WebSite`, `WebPage`, and breadcrumb JSON-LD are emitted.**
  Recipe/Article schema, authorship, publication dates, ratings, and procedures
  remain disabled until an approved record holds genuine values.
- **One shared `og.png` is intentional.** Per-route social imagery requires
  owned media; do not manufacture route-level assets from placeholder content.
- **CSP is enforced and self-only.** No analytics beacon, third-party image
  service, external font, or wildcard CORS header is allowed in the preview.
- **Promotion is gated.** See the content/index release gate, the future API
  contract, and the reusable portfolio checklist in [`docs/`](./docs/).

## ♿ Accessibility gate

`scripts/a11y.mjs` runs axe (WCAG 2.1 A/AA) over six routes in **both** themes,
and adds assertions axe cannot make on its own: every `<img>` has meaningful or
explicitly decorative alt text and intrinsic `width`/`height`, the skip link is
the first tab stop, and opening the mobile menu moves focus into it while
Escape returns focus to the trigger.

```bash
npm run build
npm install --no-save playwright @axe-core/playwright
npx playwright install chromium
node scripts/a11y.mjs          # CHROMIUM_PATH=… to reuse a preinstalled browser
```

Playwright is intentionally **not** a devDependency, so the production deploy
build never downloads a browser. CI runs it on every push and pull request.

## 🌐 Deploy

Ships as static assets to **Cloudflare Pages** (project `gochujang`, production
branch `main`), which builds with `npm run build` and publishes `/dist`.

- **`public/_headers`** — HSTS, enforced self-only CSP, COOP/CORP, no default CORS,
  `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and
  immutable caching for hashed assets.
- **`public/_redirects`** — canonicalises `www` → apex. It deliberately has
  **no** `/* /index.html 200` catch-all: every real route is a real file, so
  unknown paths return a genuine 404 via `dist/404.html` instead of a 200
  soft-404 carrying the homepage's metadata.

Any static host works (`npm run build` → serve `/dist`), but a host that serves
`404.html` with a 404 status and honours `_headers` is required to keep the
guarantees above.
