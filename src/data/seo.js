/**
 * Single source of truth for route metadata.
 *
 * The current release is a controlled preview. It deliberately has no
 * indexable URLs and emits only generic page-level structured data. Recipe
 * rich-result markup is prohibited until each recipe has documented testing,
 * food-safety review, media rights, and editorial approval.
 */

export const ORIGIN = 'https://gochujang.net'
export const SITE_NAME = 'Gochujang'
export const RELEASE_MODE = 'controlled-preview'
export const PREVIEW_ROBOTS = 'noindex, nofollow, noarchive'

export const DEFAULT_TITLE = 'Gochujang — Controlled preview'
export const DEFAULT_DESCRIPTION =
  'A controlled, no-collection culinary preview. Recipe drafts are not kitchen-tested and are not food-safety guidance.'

/** Shared social card until rights-cleared, release-approved media exists. */
export const DEFAULT_OG_IMAGE = `${ORIGIN}/og.png`

/** The only public contact channel verified for the current preview. */
export const CONTACT = {
  general: 'hello@gochujang.net',
  security: 'hello@gochujang.net',
  corrections: 'hello@gochujang.net',
}

/** Bump when the preview notice materially changes. */
export const POLICY_VERSION = '2026-08-24'

/**
 * Cloudflare Pages serves directory routes with a trailing slash. Keep route
 * registry keys slash-free and normalize browser pathnames before lookups.
 */
export function normalizePath(path) {
  const raw = String(path || '/')
  const boundary = raw.search(/[?#]/)
  const pathname = boundary === -1 ? raw : raw.slice(0, boundary)
  const suffix = boundary === -1 ? '' : raw.slice(boundary)
  const normalizedPathname = pathname.replace(/\/+$/, '') || '/'
  return normalizedPathname + suffix
}

function absolute(path) {
  const normalized = normalizePath(path)
  const boundary = normalized.search(/[?#]/)
  const pathname = boundary === -1 ? normalized : normalized.slice(0, boundary)
  const suffix = boundary === -1 ? '' : normalized.slice(boundary)
  return ORIGIN + (pathname === '/' ? '/' : `${pathname}/`) + suffix
}

/**
 * @param {{dishes: Array<any>, categories: Array<any>}} catalog
 */
export function buildRoutes(catalog) {
  const dishes = catalog.dishes ?? []
  const routes = [
    {
      path: '/',
      title: DEFAULT_TITLE,
      rawTitle: true,
      description: DEFAULT_DESCRIPTION,
      ogType: 'website',
      indexable: false,
      heading: 'Bold flavor, under review.',
      shell: [
        'This controlled preview is intentionally not indexed. Its dish pages are editorial drafts, not kitchen-tested recipes or food-safety guidance.',
      ],
    },
    {
      path: '/explore',
      title: 'Explore draft dishes',
      description:
        'Browse Gochujang editorial recipe drafts in a controlled, non-indexable preview. They are not kitchen-tested guidance.',
      ogType: 'website',
      indexable: false,
      heading: 'Explore draft dishes.',
      shell: [
        `${dishes.length} editorial drafts are shown for review only. Do not rely on a draft as tested cooking or fermentation guidance.`,
      ],
    },
    {
      path: '/kitchen',
      title: 'The Kitchen preview',
      description:
        'Mise is a no-collection preview with illustrative sample data. Accounts, tracking, and record keeping are not live.',
      ogType: 'website',
      indexable: false,
      heading: 'The Kitchen preview.',
      shell: [
        'Everything shown is illustrative sample data. Accounts, tracking, timers, and record keeping are unavailable in this release.',
      ],
    },
    {
      path: '/about',
      title: 'About this preview',
      description:
        'About Gochujang’s controlled culinary preview and the release conditions required before public indexing.',
      ogType: 'website',
      indexable: false,
      heading: 'A culinary preview, under review.',
      shell: [
        'Gochujang is being evaluated as a privacy-first culinary utility. This release is controlled and intentionally non-indexable.',
      ],
    },
    {
      path: '/editorial-policy',
      title: 'Editorial preview policy',
      description:
        'The release standard for Gochujang recipe and editorial claims. Current drafts have not completed that review.',
      ogType: 'website',
      indexable: false,
      heading: 'Editorial preview policy.',
      shell: [
        'This page describes the standard required before a draft can be represented as an approved recipe. It does not claim that the current drafts have completed it.',
      ],
    },
    {
      path: '/privacy',
      title: 'Privacy preview notice',
      description:
        'A status notice for Gochujang’s current no-collection preview. It is not a final privacy policy.',
      ogType: 'website',
      indexable: false,
      heading: 'Privacy preview notice.',
      shell: [
        'This is a no-collection preview. It does not offer accounts, a contact form, or newsletter signup, and it is not a final privacy policy.',
      ],
    },
    {
      path: '/terms',
      title: 'Preview terms notice',
      description:
        'A status notice for use of the current no-collection Gochujang preview; final terms have not been published.',
      ogType: 'website',
      indexable: false,
      heading: 'Preview terms notice.',
      shell: ['Final terms of use have not been published for this controlled preview.'],
    },
    {
      path: '/contact',
      title: 'Contact the preview',
      description:
        'Contact Gochujang’s controlled preview for feedback, factual corrections, food-safety concerns, or trust questions.',
      ogType: 'website',
      indexable: false,
      heading: 'Contact the preview.',
      shell: [`For preview feedback or a factual concern, email ${CONTACT.general}.`],
    },
  ]

  for (const dish of dishes) routes.push(dishRoute(dish))
  return routes
}

function dishRoute(dish) {
  const path = `/dish/${dish.id}`
  return {
    path,
    title: `${dish.name} draft`,
    description: `${dish.name} is an editorial recipe draft in a controlled preview. It is not kitchen-tested or food-safety guidance.`,
    ogType: 'article',
    indexable: false,
    heading: `${dish.name} — draft`,
    shell: [
      'This dish is an editorial draft shown for review. It is not kitchen-tested, and it must not be used as a validated cooking or food-safety procedure.',
    ],
  }
}

/* -------------------------------------------------------------- schema -- */

function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${ORIGIN}/`,
    description: DEFAULT_DESCRIPTION,
  }
}

function webPageSchema(route) {
  const url = canonicalFor(route)
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: titleFor(route),
    description: route.description,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${ORIGIN}/`,
    },
  }
}

function breadcrumbSchema(route) {
  if (route.path === '/') return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: route.title, item: canonicalFor(route) },
    ],
  }
}

/** Generic preview metadata only. Recipe, Organization, review, and rating markup are not allowed. */
export function structuredDataFor(route) {
  const schemas = [webPageSchema(route)]
  if (route.path === '/') schemas.unshift(websiteSchema())
  const breadcrumb = breadcrumbSchema(route)
  if (breadcrumb) schemas.push(breadcrumb)
  return schemas
}

/** The exact <title> string for a route. */
export function titleFor(route) {
  return route.rawTitle ? route.title : `${route.title} · ${SITE_NAME}`
}

export function canonicalFor(route) {
  return absolute(route.path)
}

export { absolute }
