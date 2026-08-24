# Portfolio launch gate for lightweight niche utilities

## Intent

This reusable P2 control applies the Gochujang lessons across the portfolio without adding cross-site behavioral tracking. It is a pass/fail gate before paid acquisition, cross-site promotion, public accounts, affiliate programs, or advertising.

## Required controls

| Gate | Required evidence | Owner |
| --- | --- | --- |
| Route delivery | Route-specific server/prerendered title, description, canonical, OG/Twitter, semantic H1, and true 404 | Engineering |
| Crawler control | Valid robots file, generated sitemap limited to canonical indexable URLs, and noindex for previews/sample data | Engineering + Editorial |
| Structured data | Schema derives from the same approved content record; no placeholders, invented ratings, authors, dates, or safety claims | Engineering + Editorial |
| Security | HTTPS redirect, HSTS, CSP, anti-framing, nosniff, referrer/permissions policy, scoped CORS, and a documented cross-origin decision | Platform |
| Privacy | Named operator, privacy notice, terms, contact, cookie/analytics inventory, retention, processor list, and data-rights path before collection | Legal + Operator |
| Data features | Versioned API contract, validation, CSRF/origin controls, rate limits, deletion/export, failure states, and abuse logging | Engineering + Privacy |
| Accessibility | Automated WCAG checks, keyboard/focus test, visible focus, contrast check in each theme, meaningful/decorative image semantics, and reduced-motion QA | Engineering + QA |
| Mobile/performance | Responsive QA, no horizontal overflow, route splitting, stable image dimensions, controlled preloads, and lab CWV baseline | Engineering + QA |
| Content truth | Named author/tester/reviewer, sources, change notes, safety/reproducibility evidence, rights-cleared media, and an approval record | Editorial |
| Monetization | Contextual placement, adjacent disclosure, compliant link rel values, consent model for any advertising/measurement, and performance guardrails | Commercial + Legal |
| Operations | Build/release runbook, production verification, monitoring ownership, rollback path, and incident contact | Engineering + Operator |

## Release decision

An owner marks every row `pass`, `not applicable`, or `blocked`. A `blocked` privacy, security, route-delivery, content-truth, or data-feature row prevents public indexing and paid promotion. A preview may ship only when it says what it is, does not collect personal data, has an enforced noindex posture, and contains no unsafe or misleading procedures.

## Portfolio measurement rules

- Use aggregate, purpose-limited measurement only after the relevant privacy notice and consent decision are live.
- Do not share cross-domain identity graphs, browsing histories, or account activity across portfolio sites.
- Measure each promoted property independently: index coverage, crawl errors, CWV, accessibility regressions, content release count, correction rate, revenue disclosure compliance, and user-reported trust issues.
- Re-run the launch gate after a material product, data, monetization, or hosting change.
