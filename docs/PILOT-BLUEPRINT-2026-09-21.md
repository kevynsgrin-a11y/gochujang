# Gochujang Pilot Blueprint — the highest-quality Korean cooking site

Owner directive 2026-09-21: "use Gochujang as a test pilot site to turn it
into the highest quality Korean cooking site as possible, applying modern
cutting edge web build techniques and high resolution visuals concurrent
to applied theming."

## Situation this blueprint resolves

1. **Production is broken**: the 2026-09-20 Cloudflare Pages deployment was
   a buildless direct upload — gochujang.net serves the raw repo (`/robots.txt`
   returns SPA HTML, `/src/main.tsx` serves as `application/octet-stream`).
   Users get a blank page behind the title; Google sees no content.
2. **Two diverged code lines**: `main` (this branch's base) = prerendered
   React 19 + Vite + platform gates, **release-gated noindex** (22 routes,
   empty sitemap by design); `claude/gochujang-visual-overhaul-ux3aaf`
   (GitHub default) = newer pure-SPA design with **unrelated git history**
   (cannot PR into main). The Pages project builds `main` → `dist`.
3. **Zero search presence** (0 GSC impressions two weeks running) — entirely
   explained by (1) + (2).

**The pilot lands on `main`** (only mergeable lineage; every merge triggers
the proper Pages build — fixing production incidentally).

## Architecture decision — extend, don't rewrite

Keep **main's platform**: React 19 + Vite 6 + `scripts/prerender.mjs` +
`verify-build` + `p1p2-verify-platform` + header validation. This is
already the modern stack — and it's *tested*, with the fail-closed release
governance this fleet requires (the kbbqguide pattern: noindex until
explicit launch approvals). Port the visual-overhaul branch's design
language into it as **design tokens**; its SPA-only routing dies (that's
the pattern that makes sites invisible to search).

An Astro/Next rewrite was considered and rejected: it would discard the
platform verification layer for framework fashion while the site is down.

## The four build tracks

### 1. Content engine (the product)

- `src/data/catalog.json` grows into the **Korean culinary knowledge base**:
  - **Ingredient encyclopedia** (the namesake cluster): gochujang (grades,
    mat-goisung aging, heat scale, substitutes, storage), doenjang, ganjang
    (jin/ yang/ soup soy), gochugaru (fine vs coarse, heat grades), kimchi
    varieties, ssamjang, sesame (oil vs seed, toasted), perilla, dashida,
    rice (short-grain varieties), noodles (naengmyeon/ japchae/ kalguksu).
  - **Recipes with full `Recipe` JSON-LD** (the fleet's proven rich-result
    pattern): launch wave = 12 canonical dishes — kimchi-jjigae, bibimbap,
    bulgogi, tteokbokki, japchae, sundubu-jjigae, kimchi-bokkeumbap, galbi,
    haemul-pajeon, baechu-kimchi, miyeokguk, dakgangjeong. Every recipe:
    Korean + romanized + English names, ingredient table with substitutions,
    timed steps, technique callouts, serving/storage notes.
  - **Technique guides**: marinade theory (gochujang base ratios), rice
    mastery, banchan structure of a Korean table, jjigae vs guk vs tang.
- Routing: `/dish/<slug>`, `/ingredient/<slug>`, `/guides/<slug>` — every
  route prerendered (static HTML = SEO + Discover eligibility).
- Editor's voice: one named editorial policy page already exists
  (`EditorialPolicy.tsx`) — extend it; no fabricated nutrition claims.

### 2. Theming system (applied concurrently with visuals)

- **Design tokens** (`src/index.css` CSS custom properties): palette from
  the cuisine itself — gochujang red (#A8231B ±), doenjang amber, sesame
  cream, charcoal banchan stone, perilla green accent; light + dark.
- Typography: a display serif with Hangul coverage (e.g. Gowun Batang /
  Nanum Myeongjo via `@fontsource`) + modern sans body (Geist already in
  the tree), `lang="ko"` spans with correct line-height for Hangul.
- Motion: framer-motion (in tree) used sparingly — page transitions and
  reveal-on-scroll only; no motion above the fold that costs LCP.

### 3. High-resolution visuals (the GscOps visual pipeline)

- Author a **slot manifest** (`data/visual/slot-manifest-gochujang.net.json`
  in GscOps): hero + `og_image` + `schema_image` (the JSON-LD image Google
  requires for rich results) + `in_content` step shots per recipe.
- Style contract locked once: "overhead natural light, ceramic on dark
  wood, steam visible, no text overlays" — versioned so every image
  regenerates coherently (the VISUAL-PIPELINE-2026-09-20 doctrine: frozen
  slot map before any prompt, grade + contract match before placement).
- `astro:assets`-equivalent handling in Vite: `vite-plugin-imagemin`-style
  build step emitting AVIF + WebP + JPEG with explicit width/height (CLS)
  and lazy-loading below the hero; hero images `preload` (LCP budget).

### 4. SEO + launch governance

- Prerendered HTML per route (title ≤ 60, meta description, canonical).
- Sitemap generator flips from "empty by design" to full inventory **only
  when the release gate opens** (same two-approval env contract as today —
  `GOCHUJANG_RELEASE_MODE=public-launch` + indexing approval).
- GA4 `G-RCHCKTCK9K` (already wired) + AdSense `ca-pub-9029421562757873`
  slot-ready containers behind the release gate.
- IndexNow key file at root from day one (fleet key `d390aee0…`).

## Phased roadmap

| Phase | Scope | Gate |
|---|---|---|
| 0 (this PR) | Blueprint + branch-off-main established | merge → Pages rebuild → **production un-broken** (22-route gated site live) |
| 1 | Design tokens + component restyle (port visual-overhaul language) + slot manifest + first 6 heroes | p1p2-verify + a11y + Lighthouse CI |
| 2 | 12 recipes + 6 ingredient pages + full Recipe LD | verify-build sitemap parity |
| 3 | Technique guides + internal-link graph + og images fleet-wide | visual grading ≥ B |
| 4 | **Owner flips release approvals** → sitemap populated → GSC submit + IndexNow → launch | dashboard env |

## Immediate owner actions (outside this repo)

1. Merge this PR (or any push to `main`) → Pages rebuilds → the broken
   direct-upload deployment is superseded and gochujang.net works again.
2. Decide the default branch: `main` (recommended — Pages watches it) vs
   the unrelated-history overhaul branch (would need history surgery).
3. Phase 4: the two release approvals in the Pages env.
