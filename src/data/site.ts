export const NAV = [
  { label: 'Home', route: '/' },
  { label: 'Explore', route: '/explore' },
  { label: 'Kitchen', route: '/kitchen' },
  { label: 'About', route: '/about' },
] as const

/**
 * This is deliberately a narrow, factual description of the current release.
 * It is not a privacy policy or a claim about the host's edge configuration.
 */
export const PREVIEW_STATUS = {
  label: 'No-collection preview',
  description:
    'This preview does not offer accounts, a contact form, or newsletter signup. The application is not asking visitors to submit personal information.',
} as const

/** The only public contact channel approved for this preview. */
export const PUBLIC_CONTACT = 'hello@gochujang.net'

export const BRAND = {
  name: 'Gochujang',
  tagline: 'Taste, turned up.',
  hero: {
    eyebrow: 'Controlled culinary preview',
    headline: 'Bold flavor,',
    headlineAccent: 'worth chasing.',
    subhead:
      'Explore editorial dish drafts in a controlled preview. Recipe procedures, accounts, and personal tracking are unavailable until documented release review is complete.',
    primaryCTA: 'Browse draft dishes',
    secondaryCTA: 'Preview status',
  },
  story:
    'Gochujang starts with a jar of fermented chili paste — proof that patience, heat, and a point of view can transform the ordinary. This controlled preview is evaluating a privacy-first culinary utility: a focused way to explore dish ideas and establish the evidence required before any recipe procedure is released. The current collection is editorial draft material, not a finished recipe service. Global by instinct, bold by design — and explicit about what is not ready.',
} as const

export const VALUE_PROPS = [
  {
    title: 'Discover, never dredge',
    body: 'An editorially-curated feed of standout dishes, techniques, and ingredients across global cuisines — not an endless, undifferentiated database.',
    glyph: 'compass',
  },
  {
    title: 'Tracking, under review',
    body: 'Saving, rating, and personal collections are not available in this no-collection preview.',
    glyph: 'bookmark',
  },
  {
    title: 'Sample data, clearly marked',
    body: 'The Kitchen demonstrates a possible future interface with illustrative data only; it does not store visitor activity.',
    glyph: 'trending',
  },
  {
    title: 'A feed that feels designed',
    body: 'Every screen reads like a premium food magazine spread — clear, technique-forward, and respectful of your time.',
    glyph: 'sparkle',
  },
] as const

// Mono-caps trend terms for the Flavor Pulse marquee.
export const FLAVOR_PULSE = [
  'Gochujang butter',
  'Black garlic',
  'Koji-cured',
  'Chili crisp',
  'Doenjang caramel',
  'Perilla oil',
  'Rosé tteokbokki',
  'Fish-sauce caramel',
  'Smash ferments',
  'Scorpion honey',
  'Charred scallion',
  'Sesame praline',
]

export const FOOTER_LINKS = {
  Explore: [
    { label: 'All dishes', route: '/explore' },
    { label: 'Fermented & Funky', route: '/explore?category=fermented-funky' },
    { label: 'Charred & Smoky', route: '/explore?category=charred-smoky' },
    { label: 'Sweet Heat', route: '/explore?category=sweet-heat' },
  ],
  Kitchen: [
    { label: 'Kitchen preview', route: '/kitchen' },
    { label: 'Sample batches', route: '/kitchen' },
    { label: 'Sample passport', route: '/kitchen' },
  ],
  Company: [
    { label: 'About', route: '/about' },
    { label: 'Editorial policy', route: '/editorial-policy' },
    { label: 'Contact', route: '/contact' },
  ],
  Legal: [
    { label: 'Privacy', route: '/privacy' },
    { label: 'Terms', route: '/terms' },
  ],
} as const
