# Gochujang · The Seoul Table

A lightweight, static recipe site built from preserved recipe content and shared templates. The current collection contains 14 recipes. All original recipe exports are retained in `source/original-recipes`; they are the recovery baseline.

## Build and preview

Requires Node 24 and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm dev
```

The preview is served at http://127.0.0.1:4173. Vercel builds to `dist`.

## Project map

- `src/content/recipes.json`: preserved ingredients, methods, timing, schema and source hashes.
- `src/content/editorial.json`: short descriptions and curated related recipes for the new interface.
- `src/content/images.json`: reviewed recipe/image associations, alt text and responsive sources.
- `src/styles/site.css`: responsive and print design system.
- `src/scripts/site.js`: search, filters, browser-local saves and ingredient checklists.
- `scripts/build.mjs`: shared templates for home, collection, recipe, approach and 404 pages.
- `public/images/recipes`: AI-generated recipe illustrations, original masters and optimized derivatives. See the image-provenance manifest for prompts and per-image provenance. Masters are excluded from deployment output.

## Recipe preservation

`pnpm test` compares all original recipe schemas, ingredient lists, method blocks and file hashes; it also checks local links, image metadata, canonical URLs and sitemap routes. The recipe import can be reproduced with `pnpm import:recipes`. Source recipe quantities, cooking instructions, timing and notes were not revised during the visual rebuild.

Saved recipes and checked ingredients stay in the visitor's browser, without an account. Images are AI-created illustrations; this is disclosed on the approach page. No invented ratings or kitchen-testing claims are added.

## Publishing

The existing Vercel project and Gochujang domain are retained. Review the preview deployment and run preservation verification before promoting changes. The original deployed output remains recoverable from Git commit `8a60cacd0d5e538e6a12d155744636d89e203be5`.
