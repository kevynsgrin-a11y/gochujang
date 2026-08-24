# Content and index release gate

## Purpose

Gochujang is currently a controlled, no-collection preview. Every URL remains `noindex`, the sitemap intentionally has no locations, draft procedures are withheld, and recipe rich-result markup is disabled. These are release controls, not a substitute for publishable content.

This gate prevents an attractive food page from being promoted before its evidence, safety, legal, and media rights are real.

## Per-route release record

Every future public page must have one versioned content record that drives visible fields, route metadata, canonical URL, Open Graph/Twitter values, JSON-LD, sitemap `lastmod`, media alt text, and monetization disclosure state. The record must contain actual values, not defaults chosen to satisfy a validator.

Required fields for a public editorial page:

- Canonical route, title, summary, named author/editor, publication date, revision date, primary sources, and corrections contact.
- Rights-cleared, self-hosted media at the approved responsive sizes, with stable crop, meaningful alt text, license/credit record, and an approved 1200 x 630 social image.
- A topic-specific internal-link plan and a meaningful page body. Do not publish a placeholder Journal route merely to fill navigation.

Additional required fields for a public recipe:

- Tester name, test date, reviewer, actual equipment, prep/cook/fermentation time, yield, ingredients by component, and tested method.
- Temperatures and food-safety decision points where relevant; for ferments, temperature range, salt percentage, headspace/burping guidance, storage, and specific discard signs.
- Allergens, tested substitutions, make-ahead/storage guidance, troubleshooting, cultural context, and authoritative sources.
- The complete release evidence required by `src/lib/recipeRelease.ts`.

## Technical promotion sequence

1. Add only approved records to the indexable route registry. A draft stays noindex and its procedure remains absent from the shipped bundle.
2. Generate route-specific title, description, canonical, `og:url`, `og:image`, `twitter:image`, and image dimensions from that record. Use `og:type=article` for an approved dish or article only when the article metadata is real.
3. Emit `Recipe` JSON-LD only for a released recipe record with real author/tester, dates, timing, ingredients, instructions, images, and safety fields. Emit `Article` JSON-LD for a released editorial route. Never invent dates, ratings, or credentials.
4. Generate the sitemap only from canonical, indexable records and use each record's true revision timestamp as `lastmod`. Exclude the Kitchen while it has sample data.
5. Run `npm run build`, the accessibility workflow, mobile/performance checks, rich-result/schema validation, and live header/404 verification.
6. Verify the domain in Google Search Console and Bing Webmaster Tools, submit the generated sitemap, inspect representative URLs, and record coverage weekly. Submission is not a ranking guarantee.

## Media and performance requirements

- Images are root-relative, owned or rights-cleared assets. External random-image services and third-party image fallbacks are prohibited.
- Provide intrinsic dimensions and responsive variants. Preserve an aspect-ratio box and a deterministic local fallback.
- Preload only the actual above-the-fold hero image and only the font subsets used above the fold. Do not preload an asset that is absent from the release.
- Maintain the current route-split loading model. Measure mobile and desktop LCP, CLS, and interaction latency on a representative approved route before broader promotion.

## Monetization and advertising gate

Affiliate links are disabled until an approved editorial recommendation exists. Before the first monetized module, display this exact adjacent disclosure:

> Some links are affiliate links. If you buy through them, Gochujang may earn a commission at no extra cost to you. Recommendations remain editorial and are not purchased rankings.

Paid links use `rel="sponsored nofollow"`. The content record records whether the disclosure is required. Display ads remain prohibited until at least 25 tested, source-backed pages are public, privacy/consent is implemented, and mobile LCP/CLS are measured. When that gate is met, start with one contextual slot below primary content; do not use interstitials, sticky video, or ads inside method steps.

## Exit criteria for leaving controlled preview

- Legal operator/controller, contact/mailing details, jurisdiction, final privacy policy, terms, retention, rights workflow, and vendor inventory are approved and published.
- Every promoted content item has a complete release record and appropriate expert/editorial review.
- Page-level metadata, schema, OG image, sitemap inclusion, and live 404 behavior pass automated and live verification.
- The operator signs the release record. Removing `noindex` is a deliberate change, not a by-product of publishing a file.
