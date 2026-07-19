export type CategoryId =
  | 'fermented-funky'
  | 'charred-smoky'
  | 'noodles-broths'
  | 'rice-bowls'
  | 'small-plates'
  | 'braises-stews'
  | 'sweet-heat'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface Category {
  id: string
  name: string
  accent: string
  blurb: string
}

export interface Dish {
  id: string
  name: string
  koreanName?: string
  category: string
  shortDesc: string
  longDesc: string
  spiceLevel: number // 0-5
  fermentDays: number
  difficulty: Difficulty
  timeMinutes: number
  servings: number
  featured?: boolean
  region: string
  chef: string
  tags: string[]
  unsplashQuery: string
  ingredients: string[]
  method: string[]
}

export interface Stat {
  value: string
  label: string
  caption: string
}

export interface Story {
  title: string
  category: string
  excerpt: string
}

export interface Testimonial {
  name: string
  role: string
  quote: string
}
