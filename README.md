# Gochujang — _Taste, turned up._

A premium culinary discovery **and** tracking platform. Gochujang reframes the
"boring food tracker" as **"Fermented Editorial"** — an award-winning-restaurant
hero, a food-magazine grid, and a single loud gochujang-crimson ember on warm
charcoal. Discover dishes worth chasing, cook them, and collect them in **Mise**,
a living kitchen dashboard that makes tracking feel like collecting.

> Built as a full front-end overhaul, designed top-to-bottom by a multi-agent
> design fleet (market research → brand → information architecture → content →
> design system → visual art-direction → UX → accessibility → synthesis). The
> resulting master spec lives in [`design/spec/`](./design/spec).

## ✨ Highlights

- **Five routes**: cinematic Home, filterable Explore mosaic, immersive Dish
  detail, the **Mise** tracker dashboard (`/kitchen`), and an About manifesto.
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
- **Accessibility-first** — AA-tuned contrast in both themes, one `<h1>` per
  route, skip link, visible focus, and text equivalents on every data-viz.

## 🧑‍🍳 Tech stack

Vite · React 18 · TypeScript · Tailwind CSS · Framer Motion · React Router ·
self-hosted variable fonts via `@fontsource` · lucide-react icons.

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to /dist
npm run preview  # serve the production build
```

## 🖼️ Imagery — how to plug in real photos

The design layers real food photography **on top of** the guaranteed gradient
art. Photo wiring lives in a single file: **[`src/data/images.ts`](./src/data/images.ts)**.

`IMAGE_MODE` controls the source:

| Mode         | Behavior                                                                 |
| ------------ | ------------------------------------------------------------------------ |
| `'keyword'`  | _(default)_ Real, license-free food photos resolved by keyword per dish. |
| `'unsplash'` | Use curated Unsplash photo ids / URLs from the `PHOTO` map.              |
| `'off'`      | Gradient-only editorial art (the guaranteed baseline).                    |

**To use your own licensed photography:** set `IMAGE_MODE = 'unsplash'`, drop
files in `/public` (e.g. `/photos/galbi.jpg`), and map them in `PHOTO`:

```ts
export const PHOTO: Record<string, string> = {
  'gochujang-galbi': '/photos/galbi.jpg',
  home: '/photos/hero.jpg',
}
```

That's the only file you touch — every slot already has a beautiful fallback.

## 📁 Structure

```
src/
  components/   layout, brand, graphics (SVG), decor, DishCard, StatTile, …
  pages/        Home, Explore, DishDetail, Kitchen, About, NotFound
  data/         catalog (dishes/categories), site config, Mise data, image manifest
  lib/          theme, motion presets, class + unsplash helpers
  index.css     design tokens (CSS variables, light + dark)
tailwind.config.js   type scale, gradients, radii, shadows, keyframes
design/spec/    the multi-agent design fleet's master spec (reference)
```

## 🌐 Deploy

Ships as static assets. `vercel.json` and `public/_redirects` are included for
SPA routing on Vercel / Netlify. Any static host works: `npm run build` → serve
`/dist`.
