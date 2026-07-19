# Design spec — the multi-agent design fleet

This site's visual identity was designed top-to-bottom by a fleet of specialist
agents. Each produced a structured spec, synthesized by a design lead into a
single master build spec. These JSON files are the **reference record** of that
process (not imported by the app):

| File            | Author role              | Contents                                                        |
| --------------- | ------------------------ | --------------------------------------------------------------- |
| `market.json`   | Market researcher        | Patterns from award-winning food/restaurant sites; first-impression tactics |
| `brand.json`    | Brand / creative director| Positioning, tagline, story, voice, mood keywords               |
| `ia.json`       | Information architect     | Site map, nav, the "Mise" tracker concept + data model          |
| `content.json`  | Culinary content strategist | 14 dishes, 7 categories, stories, stats, testimonials       |
| `art.json`      | Art director             | The design system: palette (light/dark), fonts, type scale, radii, shadows, gradients, motion |
| `ux.json`       | UX / first-impressions   | Above-the-fold strategy, 5-second test, scroll narrative        |
| `a11y.json`     | Accessibility & perf     | Contrast rules, motion rules, semantic + perf budgets           |
| `visual.json`   | Visual coordinator       | Photo art-direction, image manifest, graphic-asset plan         |
| `spec.json`     | Design lead              | The synthesized master build spec: page blueprints, components, motion, build notes |

`content.json` is the source for `src/data/catalog.json`. The rest informed the
tokens in `src/index.css` + `tailwind.config.js` and the component library.
