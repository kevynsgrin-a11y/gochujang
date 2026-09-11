import raw from './ingredient-nutrition.json'

/**
 * Ingredient nutrition reference data, built at commit time by
 * scripts/build-ingredient-nutrition.mjs from the TrueAPI portfolio
 * ingredient dictionary (USDA FoodData Central values resolved offline).
 * Per-100 g reference values for raw ingredients — never a per-serving
 * analysis of a dish — and unresolved entries carry no numbers by design.
 */
export interface IngredientNutritionEntry {
  sourceLines: string[]
  resolved: boolean
  fdcId?: number | null
  fdcName?: string | null
  dataType?: string | null
  confidence?: number | null
  per100g?: Record<string, number>
}

export interface IngredientNutritionData {
  version: number
  generatedBy: string
  dictionarySource: string
  dictionaryFetchedAt: string | null
  fdcAttribution: { text: string; url: string }
  counts: {
    ingredientNames: number
    sourceLines: number
    resolved: number
    unresolved: number
  }
  ingredients: Record<string, IngredientNutritionEntry>
}

export const ingredientNutritionData = raw as unknown as IngredientNutritionData

export const FDC_ATTRIBUTION = ingredientNutritionData.fdcAttribution

// Quantity-stripping normalizer: mirrors the build-time copy in
// scripts/build-ingredient-nutrition.mjs (which asserts every catalog line
// lands on a dictionary key at build time).
const QUANTITY = /^(?:\d+(?:\s+\d+\/\d+|\.\d+)?|\d+\/\d+)\s+/
const UNITS = new Set([
  'block', 'blocks', 'can', 'cans', 'clove', 'cloves', 'cup', 'cups',
  'lb', 'lbs', 'oz', 'tbsp', 'tsp', 'thumb', 'thumbs', 'portion', 'portions',
  'slice', 'slices', 'large', 'small', 'bunch', 'bunches', 'head', 'heads',
])

/** Strip quantities, units, preparations, and parentheticals from an ingredient line. */
export function normalizeIngredientLine(line: string): string {
  let s = String(line).trim()
  s = s.replace(/\s*\([^)]*\)\s*/g, ' ').trim()
  s = s.replace(/,.*$/, '').trim()
  let prev: string | null = null
  while (prev !== s) {
    prev = s
    const q = s.match(QUANTITY)
    if (q) s = s.slice(q[0].length)
    const first = s.split(' ')[0]
    if (UNITS.has(first.toLowerCase()) && s.split(' ').length > 1) {
      s = s.slice(first.length).trim()
    }
  }
  return s.replace(/\s+/g, ' ').trim()
}

/** Look up the nutrition entry for a raw ingredient line (undefined when unverified). */
export function nutritionForLine(line: string): IngredientNutritionEntry | undefined {
  const name = normalizeIngredientLine(line)
  const entry = ingredientNutritionData.ingredients[name]
  return entry?.resolved ? entry : undefined
}

const CORE_NUTRIENTS: ReadonlyArray<readonly [string, string]> = [
  ['kcal', 'kcal'],
  ['protein_g', 'protein'],
  ['fat_g', 'fat'],
  ['carbs_g', 'carbs'],
]

/** "333 kcal, 10 g protein, 0 g fat, 76.7 g carbs per 100 g" — only nutrients present. */
export function formatPer100g(entry: IngredientNutritionEntry): string {
  const per100g = entry.per100g
  if (!per100g) return ''
  const parts: string[] = []
  for (const [key, label] of CORE_NUTRIENTS) {
    const value = per100g[key]
    if (value == null) continue
    parts.push(key === 'kcal' ? `${value} kcal` : `${value} g ${label}`)
  }
  return parts.length > 0 ? `${parts.join(', ')} per 100 g` : ''
}
