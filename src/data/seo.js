/**
 * SINGLE SOURCE OF TRUTH for route metadata.
 *
 * Both the client (usePageMeta) and the build-time prerenderer
 * (scripts/prerender.mjs) derive titles, descriptions, canonicals, social
 * tags, JSON-LD, and the sitemap from this one module — so the raw HTML a
 * crawler sees and the hydrated document a browser sees can never drift.
 *
 * Plain ESM (not TS) so Node can import it directly at build time without a
 * transpile step. The catalog is passed in rather than imported so the same
 * module works under Vite (JSON import) and Node (fs.readFileSync).
 */

export const ORIGIN = 'https://gochujang.net'
export const SITE_NAME = 'Gochujang'

export const DEFAULT_TITLE = 'Gochujang — Cook bold. Track what you love.'
export const DEFAULT_DESCRIPTION =
  'Gochujang is a premium culinary destination for bold, fire-forward cooking — discover standout dishes, master fermentation, and track every bite worth remembering.'

/** Shared social card. Documented as an intentional site-wide asset until owned per-dish photography exists. */
export const DEFAULT_OG_IMAGE = `${ORIGIN}/og.png`

/** Contact addresses verified against the domain's live Cloudflare Email Routing rules. */
export const CONTACT = {
  general: 'hello@gochujang.net',
  security: 'security@gochujang.net',
  corrections: 'hello@gochujang.net',
}

/** Policy version — bump when the substance of a policy page changes. */
export const POLICY_VERSION = '2026-08-18'

function absolute(path) {
  return ORIGIN + (path === '/' ? '/' : path)
}

/**
 * Build the full route table.
 * @param {{dishes: Array<any>, categories: Array<any>}} catalog
 */
export function buildRoutes(catalog) {
  const dishes = catalog.dishes ?? []

  /** @type {Array<any>} */
  const routes = [
    {
      path: '/',
      title: DEFAULT_TITLE,
      // The home route is the one page whose <title> is the brand line itself.
      rawTitle: true,
      description: DEFAULT_DESCRIPTION,
      ogType: 'website',
      indexable: true,
      changefreq: 'weekly',
      priority: '1.0',
      heading: 'Bold flavor, worth chasing.',
      shell: [
        'The culinary discovery platform for cooks who eat with intent — find the dishes that change you, track the ones that stick, and watch your palate get braver.',
      ],
      jsonLd: () => [websiteSchema(), organizationSchema()],
    },
    {
      path: '/explore',
      title: 'Explore dishes',
      description:
        'Filter every dish worth chasing by craving, heat, and time — curated, never dumped.',
      ogType: 'website',
      indexable: true,
      changefreq: 'weekly',
      priority: '0.9',
      heading: 'Every dish worth chasing.',
      shell: [
        'Filter by craving, heat, and time. Curated, never dumped.',
        `${dishes.length} dishes across ${(catalog.categories ?? []).length} flavor categories.`,
      ],
      jsonLd: () => [collectionSchema(dishes), breadcrumbSchema([{ name: 'Explore', path: '/explore' }])],
    },
    {
      path: '/kitchen',
      title: 'The Kitchen',
      description:
        'Mise — batch timers, cooking streaks, and the Flavor Passport. A preview running on sample data; accounts and real tracking are not live yet.',
      ogType: 'website',
      // Explicitly a sample-data preview. Kept reachable for visitors, kept out
      // of the index and the sitemap until it holds real, non-preview content.
      indexable: false,
      heading: 'Your Mise.',
      shell: [
        'Mise is a preview. Everything shown is illustrative sample data — accounts and real tracking are not live yet.',
      ],
      jsonLd: () => [],
    },
    {
      path: '/about',
      title: 'About',
      description:
        'Why Gochujang exists: an editorial culinary destination built for cooks who read menus like novels and remember meals like milestones.',
      ogType: 'website',
      indexable: true,
      changefreq: 'monthly',
      priority: '0.6',
      heading: 'Taste, turned up.',
      shell: [
        'Gochujang starts with a jar of fermented chili paste — proof that patience, heat, and a point of view turn the ordinary into the unforgettable.',
      ],
      jsonLd: () => [breadcrumbSchema([{ name: 'About', path: '/about' }]), organizationSchema()],
    },
    {
      path: '/editorial-policy',
      title: 'Editorial policy',
      description:
        'How Gochujang reviews recipes for ingredient accuracy, food safety, cultural context, and reproducibility — and how we correct errors.',
      ogType: 'website',
      indexable: true,
      changefreq: 'yearly',
      priority: '0.4',
      heading: 'Editorial policy',
      shell: [
        'Every recipe is reviewed for ingredient accuracy, food safety, cultural context, and reproducibility before it is marked tested.',
      ],
      jsonLd: () => [breadcrumbSchema([{ name: 'Editorial policy', path: '/editorial-policy' }])],
    },
    {
      path: '/privacy',
      title: 'Privacy',
      description:
        'What Gochujang collects, what it does not, and how to reach us. Theme preference stays in your browser; site measurement is aggregate and cookieless.',
      ogType: 'website',
      indexable: true,
      changefreq: 'yearly',
      priority: '0.4',
      heading: 'Privacy',
      shell: [
        'Gochujang collects only the information needed to operate an explicitly requested feature.',
      ],
      jsonLd: () => [breadcrumbSchema([{ name: 'Privacy', path: '/privacy' }])],
    },
    {
      path: '/terms',
      title: 'Terms',
      description:
        'The terms that govern use of Gochujang, including recipe disclaimers, food-safety responsibility, and acceptable use.',
      ogType: 'website',
      indexable: true,
      changefreq: 'yearly',
      priority: '0.4',
      heading: 'Terms',
      shell: ['The terms that govern your use of Gochujang.'],
      jsonLd: () => [breadcrumbSchema([{ name: 'Terms', path: '/terms' }])],
    },
    {
      path: '/contact',
      title: 'Contact',
      description:
        'Reach Gochujang: general enquiries, recipe corrections, and security reports.',
      ogType: 'website',
      indexable: true,
      changefreq: 'yearly',
      priority: '0.4',
      heading: 'Contact',
      shell: [`General enquiries and corrections: ${CONTACT.general}.`],
      jsonLd: () => [breadcrumbSchema([{ name: 'Contact', path: '/contact' }])],
    },
  ]

  for (const dish of dishes) {
    routes.push(dishRoute(dish, catalog))
  }

  return routes
}

function dishRoute(dish, catalog) {
  const category = (catalog.categories ?? []).find((c) => c.id === dish.category)
  const path = `/dish/${dish.id}`
  return {
    path,
    title: dish.name,
    description: dish.shortDesc,
    // Dish pages are editorial articles, not collection pages.
    ogType: 'article',
    indexable: true,
    changefreq: 'monthly',
    priority: '0.8',
    heading: dish.name,
    shell: [
      dish.longDesc,
      `Region: ${dish.region}. Serves ${dish.servings}. About ${dish.timeMinutes} minutes. Difficulty: ${dish.difficulty}.`,
      `Ingredients: ${dish.ingredients.join('; ')}.`,
    ],
    // Method steps get real list markup in the prerendered shell.
    steps: dish.method,
    jsonLd: () => [
      recipeSchema(dish, category),
      breadcrumbSchema([
        { name: 'Explore', path: '/explore' },
        ...(category ? [{ name: category.name, path: `/explore?category=${category.id}` }] : []),
        { name: dish.name, path },
      ]),
    ],
  }
}

/* ---------------------------------------------------------------- schema -- */

function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${ORIGIN}/`,
    description: DEFAULT_DESCRIPTION,
  }
}

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${ORIGIN}/`,
    logo: `${ORIGIN}/favicon-32.png`,
    email: CONTACT.general,
  }
}

function collectionSchema(dishes) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Explore dishes',
    url: `${ORIGIN}/explore`,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${ORIGIN}/` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: dishes.length,
      itemListElement: dishes.map((d, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${ORIGIN}/dish/${d.id}`,
        name: d.name,
      })),
    },
  }
}

function breadcrumbSchema(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      ...trail.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: t.name,
        item: absolute(t.path),
      })),
    ],
  }
}

/**
 * Recipe schema built ONLY from fields the catalog actually holds.
 *
 * Deliberately omitted, because inventing them would be a trust defect the
 * audit called out by name: author-as-a-person, datePublished/dateModified,
 * aggregateRating, review, nutrition, and a prep/cook split (the catalog
 * stores one total time, so only totalTime is emitted).
 */
function recipeSchema(dish, category) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: dish.name,
    description: dish.shortDesc,
    url: `${ORIGIN}/dish/${dish.id}`,
    // The publisher is the site itself — an accurate attribution, not a persona.
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    recipeCuisine: 'Korean',
    recipeYield: `${dish.servings} servings`,
    totalTime: `PT${dish.timeMinutes}M`,
    recipeIngredient: dish.ingredients,
    recipeInstructions: dish.method.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text,
    })),
    keywords: dish.tags.join(', '),
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${ORIGIN}/` },
  }
  if (category) schema.recipeCategory = category.name
  if (dish.koreanName) schema.alternateName = dish.koreanName
  return schema
}

/* ----------------------------------------------------------- derivations -- */

/** The exact <title> string for a route (client and prerender must agree). */
export function titleFor(route) {
  return route.rawTitle ? route.title : `${route.title} · ${SITE_NAME}`
}

export function canonicalFor(route) {
  return absolute(route.path)
}

export { absolute }
