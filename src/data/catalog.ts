import raw from './catalog.json'
import type { Category, Dish, Stat, Story, Testimonial } from './types'

export const categories = raw.categories as Category[]
export const dishes = raw.dishes as Dish[]
export const stats = raw.stats as Stat[]
export const stories = raw.stories as Story[]
export const testimonials = raw.testimonials as Testimonial[]

export const categoryById = (id: string): Category | undefined =>
  categories.find((c) => c.id === id)

export const categoryName = (id: string): string => categoryById(id)?.name ?? id

export const getDish = (id: string): Dish | undefined => dishes.find((d) => d.id === id)

export const dishesByCategory = (id: string): Dish[] => dishes.filter((d) => d.category === id)

export const featuredDishes = (): Dish[] => dishes.filter((d) => d.featured)

export const relatedDishes = (dish: Dish, limit = 3): Dish[] => {
  const sameCat = dishes.filter((d) => d.id !== dish.id && d.category === dish.category)
  const rest = dishes.filter((d) => d.id !== dish.id && d.category !== dish.category)
  return [...sameCat, ...rest].slice(0, limit)
}

export const SPICE_WORDS = ['No heat', 'Mild', 'Warm', 'Hot', 'Fiery', 'Scorching'] as const
export const spiceWord = (level: number): string => SPICE_WORDS[Math.max(0, Math.min(5, level))]

export const dishCount = dishes.length
export const categoryCount = categories.length
