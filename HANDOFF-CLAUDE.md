# HANDOFF → Claude: gochujang — implementation-vs-design-spec audit + test backfill

**Created:** 2026-10-02 by ZCode (fleet audit 2026-10-01). **Branch:** `handoff/claude-audit`
(cut from `claude/gochujang-visual-overhaul-ux3aaf`, the checkout's working branch).
**The loop:** you audit + advise → write `RECOMMENDATIONS-CLAUDE.md` (spec at bottom) →
Kevyn feeds it to ZCode for execution. You advise; you do not execute, merge, or deploy.

## What this build is

gochujang.net — "Taste, turned up." A premium culinary discovery + tracking platform:
"Fermented Editorial" concept — award-restaurant hero, food-magazine grid, single
gochujang-crimson ember on warm charcoal. Discover dishes, cook them, collect them in
**Mise**, a living kitchen dashboard that reframes food tracking as collecting.
The README says the front-end overhaul was "designed top-to-bottom by a multi-agent
design fleet (market research → brand → IA → content → design system → visual
art-direction → UX → accessibility → synthesis)" with the **master spec in
`design/spec/`**.

## Where the intent lives

`design/spec/` (the master spec — the source of truth this audit is measured against),
`README.md`, and the prior `gochujang-visual-audit.md` sitting in the ZCode workspace
root (fleet-audit context).

## Verified current status

Work-in-progress on the visual-overhaul branch (not yet merged). **Zero tests.**
TypeScript + Tailwind site; the design fleet's spec is unusually complete, which makes
a conformance audit genuinely tractable here.

## The audit ask

1. **Spec conformance**: walk `design/spec/` section by section (brand, IA, content,
   design system, art direction, UX, accessibility) and score the implementation
   against each — implemented / partial / missing / diverged. The deliverable is a
   conformance table with file:line evidence.
2. **Mise (the tracking feature)**: the only stateful part of an otherwise editorial
   site — where does collection state live (localStorage?), what's the durability story,
   and what would a data-integrity suite pin?
3. **Accessibility conformance**: the design fleet included an accessibility pass —
   verify the implementation honors it (contrast tokens, focus states, motion
   preferences). This is a spec claim; test it.
4. **Test strategy**: for a content-forward site, spec the data-integrity suite
   (recipe/dish data shape, internal links, image references — ScamWire's
   `test/data-integrity.test.mjs` and kbbqguide's suite are the fleet patterns) plus
   any Mise logic tests. Name files + asserts.
5. **Merge readiness**: what remains between this branch and main? List the gaps as
   execution items.

## Fleet constraints

Live site — no deploys. Never merge. Secrets via vault. tsx + node:assert (or vitest if
the repo already prefers it — check and match).

## Deliverable spec

`RECOMMENDATIONS-CLAUDE.md` in repo root (this branch): `## Verdict` · `## Findings`
(P1/P2/P3 + the conformance table) · `## Execution plan` (ordered; branch names, test
files, verification commands) · `## Operator decisions needed`.
