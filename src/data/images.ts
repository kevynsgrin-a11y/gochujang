import type { Dish } from './types'

/**
 * The preview uses the built-in gradient artwork by default. It never requests
 * third-party imagery at runtime. Future photography must be rights-cleared,
 * self-hosted under /public, and represented here with a root-relative path.
 */
export type ImageMode = 'off' | 'local'
export type LocalImagePath = `/${string}`

export const IMAGE_MODE: ImageMode = 'off'

export const PHOTO: Partial<Record<string, LocalImagePath>> = {
  // 'gochujang-galbi': '/photos/gochujang-galbi.jpg',
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

/** Resolve a dish's local photo URL (or undefined → gradient-only artwork). */
export function dishPhoto(dish: Dish, _w = 1200, _h = 900): string | undefined {
  return IMAGE_MODE === 'local' ? PHOTO[dish.id] : undefined
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

/** Resolve a hero slot's local photo URL, honoring the preview release mode. */
export function heroPhoto(slot: keyof typeof HERO, _w = 1800, _h = 1200): string | undefined {
  const s = HERO[slot]
  if (!s) return undefined
  return IMAGE_MODE === 'local' ? s.photo : undefined
}
