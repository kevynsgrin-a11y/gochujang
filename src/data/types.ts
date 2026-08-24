export type CategoryId =
  | 'fermented-funky'
  | 'charred-smoky'
  | 'noodles-broths'
  | 'rice-bowls'
  | 'small-plates'
  | 'braises-stews'
  | 'sweet-heat'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type RecipeReviewStatus = 'draft' | 'in_review' | 'approved'

export interface RecipeAuthorEvidence {
  name?: string
  profileUrl?: string
  attributedAt?: string
}

export interface RecipeTestCookEvidence {
  tester?: string
  testedAt?: string
  version?: string
  notes?: string
}

export interface RecipeSafetyReviewEvidence {
  reviewer?: string
  credential?: string
  reviewedAt?: string
  scope?: string
}

export interface RecipeEditorialReviewEvidence {
  reviewer?: string
  reviewedAt?: string
  notes?: string
}

export interface RecipeSourceEvidence {
  title?: string
  url?: string
  accessedAt?: string
}

export interface RecipeReviewEvidence {
  author?: RecipeAuthorEvidence
  testCook?: RecipeTestCookEvidence
  foodSafety?: RecipeSafetyReviewEvidence
  culturalReview?: RecipeEditorialReviewEvidence
  editorialReview?: RecipeEditorialReviewEvidence
  sources?: RecipeSourceEvidence[]
}

export interface RecipeReview {
  status: RecipeReviewStatus
  evidence?: RecipeReviewEvidence
}

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
  tags: string[]
  unsplashQuery: string
  ingredients: string[]
  method: string[]
  review?: RecipeReview
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

