export const NAV = [
  { label: 'Home', route: '/' },
  { label: 'Explore', route: '/explore' },
  { label: 'Kitchen', route: '/kitchen' },
  { label: 'About', route: '/about' },
] as const

export const BRAND = {
  name: 'Gochujang',
  tagline: 'Taste, turned up.',
  hero: {
    eyebrow: 'A culinary destination, not a database',
    headline: 'Bold flavor,',
    headlineAccent: 'worth chasing.',
    subhead:
      'The culinary discovery platform for cooks who eat with intent — find the dishes that change you, track the ones that stick, and watch your palate get braver.',
    primaryCTA: 'Start cooking',
    secondaryCTA: 'Explore dishes',
  },
  story:
    "Gochujang starts with a jar of fermented chili paste — proof that patience, heat, and a point of view turn the ordinary into the unforgettable. We built Gochujang for the cook who reads menus like novels and remembers meals like milestones. This isn't a shelf of recipes; it's a place to chase flavor with intent — to discover the dish you didn't know you needed, track the ones that changed you, and watch your taste sharpen over time. Global by instinct, bold by design. Bring your appetite. We'll bring the heat.",
} as const

export const VALUE_PROPS = [
  {
    title: 'Discover, never dredge',
    body: 'An editorially-curated feed of standout dishes, techniques, and ingredients across global cuisines — not an endless, undifferentiated database.',
    glyph: 'compass',
  },
  {
    title: 'Track your evolving taste',
    body: 'Save, rate, and organize the meals that matter into a living collection you actually want to revisit.',
    glyph: 'bookmark',
  },
  {
    title: 'Watch your palate grow',
    body: 'Every dish you log sharpens a personal flavor map that surfaces smarter, bolder suggestions over time.',
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
    { label: 'Your Mise', route: '/kitchen' },
    { label: 'Batches', route: '/kitchen' },
    { label: 'Flavor Passport', route: '/kitchen' },
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
