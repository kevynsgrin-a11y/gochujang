import type { Dish } from './types'

/*
 * IMAGERY STRATEGY ("Fermented Editorial")
 * ----------------------------------------
 * Every image slot ALWAYS renders a rich, category-tinted gradient + grain
 * behind the photo (see <SmartImage>), so a slot is never broken and the
 * "highly graphic" identity holds even offline.
 *
 * Real photography is layered on top via IMAGE_MODE:
 *   - 'keyword'  → real, license-free food photos resolved by keyword
 *                  (Flickr Creative Commons via loremflickr), stable per dish.
 *                  Loads in the visitor's browser; unified by the site's
 *                  duotone + warm grade + grain so mixed sources read as one shoot.
 *   - 'unsplash' → use a curated Unsplash photo id from PHOTO[] when present.
 *   - 'off'      → gradient-only editorial art (the guaranteed-render baseline).
 *
 * ⭐ To use your OWN licensed photography: set IMAGE_MODE = 'unsplash', drop a
 * file in /public (e.g. /photos/gochujang-galbi.jpg) and map it in PHOTO below,
 * or point PHOTO[id] at any full https URL. That's the only file you touch.
 */
export const IMAGE_MODE: 'keyword' | 'unsplash' | 'off' = 'keyword'

// Optional curated overrides: dish id (or hero slot) → Unsplash photo id OR a
// full URL (e.g. '/photos/your-photo.jpg'). Used when IMAGE_MODE === 'unsplash',
// and always takes precedence for hero slots when present.
export const PHOTO: Record<string, string> = {
  // 'gochujang-galbi': 'photo-1529193591184-b1d58069ecdd',
}

// Deterministic seed from a string (no Math.random → stable per dish/build).
function seed(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h) % 100000
}

function keywordUrl(query: string, id: string, w = 1200, h = 900): string {
  const kw = encodeURIComponent(query.trim().split(/\s+/).slice(0, 4).join(','))
  return `https://loremflickr.com/${w}/${h}/${kw}?lock=${seed(id)}`
}

/** Rich, category-tinted fallback gradients — the editorial art under every photo. */
export const CATEGORY_GRADIENT: Record<string, string> = {
  'fermented-funky': 'linear-gradient(155deg, #3A1C2E 0%, #5E2A3E 45%, #8A3A2C 78%, #241812 100%)',
  'charred-smoky': 'linear-gradient(155deg, #7A1E12 0%, #C63A20 48%, #E8542E 78%, #241812 100%)',
  'noodles-broths': 'linear-gradient(155deg, #4A2A0E 0%, #A6791D 46%, #C9A227 76%, #241812 100%)',
  'rice-bowls': 'linear-gradient(155deg, #1F3A30 0%, #3E7C63 50%, #6FA982 80%, #1c1a14 100%)',
  'small-plates': 'linear-gradient(155deg, #5A1A16 0%, #B5493B 50%, #D9622C 80%, #241812 100%)',
  'braises-stews': 'linear-gradient(155deg, #2A140E 0%, #8C3B24 52%, #C15A2C 82%, #201510 100%)',
  'sweet-heat': 'linear-gradient(155deg, #3A1220 0%, #8C3350 48%, #E0607A 82%, #241318 100%)',
}

export const DEFAULT_GRADIENT = 'linear-gradient(165deg, #292019 0%, #1F1815 55%, #161210 100%)'

export function categoryGradient(categoryId: string): string {
  return CATEGORY_GRADIENT[categoryId] ?? DEFAULT_GRADIENT
}

/** Resolve a dish's photo URL (or undefined → gradient only). */
export function dishPhoto(dish: Dish, w = 1200, h = 900): string | undefined {
  const override = PHOTO[dish.id]
  if (IMAGE_MODE === 'unsplash') return override
  if (IMAGE_MODE === 'keyword') return override ?? keywordUrl(dish.unsplashQuery, dish.id, w, h)
  return override
}

export interface HeroSlot {
  gradient: string
  query: string
  photo?: string
}

export const HERO: Record<string, HeroSlot> = {
  home: {
    gradient:
      'radial-gradient(120% 120% at 78% 88%, #F0873F 0%, #C63A20 42%, #7A1E12 72%, #161210 100%)',
    query: 'grilled korean short ribs char glaze',
    photo: PHOTO['home'],
  },
  spotlight: {
    gradient: 'linear-gradient(160deg, #7A1E12 0%, #C63A20 55%, #D9622C 82%, #292019 100%)',
    query: 'napa cabbage kimchi jar macro',
    photo: PHOTO['spotlight'],
  },
  about: {
    gradient:
      'radial-gradient(120% 120% at 30% 20%, #F0873F 0%, #C63A20 50%, #7A1E12 78%, #161210 100%)',
    query: 'single red chili pepper macro dark',
    photo: PHOTO['about'],
  },
  kitchen: {
    gradient:
      'radial-gradient(120% 120% at 15% 0%, #F0873F 0%, #C63A20 50%, #7A1E12 80%, #161210 100%)',
    query: '',
    photo: PHOTO['kitchen'],
  },
}

/** Resolve a hero slot's photo URL, honoring mode + overrides. */
export function heroPhoto(slot: keyof typeof HERO, w = 1800, h = 1200): string | undefined {
  const s = HERO[slot]
  if (!s) return undefined
  if (s.photo) return s.photo
  if (IMAGE_MODE === 'keyword' && s.query) return keywordUrl(s.query, `hero-${slot}`, w, h)
  return undefined
}
