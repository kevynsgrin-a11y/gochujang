import type { Dish, RecipeReviewEvidence } from '@/data/types'

/**
 * A recipe is not releasable because it looks complete. It must carry the
 * minimum documentary evidence required by the editorial preview policy.
 *
 * This gate is deliberately conservative: an absent or partial field keeps
 * ingredient quantities and procedures unavailable. Current catalog entries
 * have no approval evidence, so they remain drafts by design.
 */
function hasRequiredEvidence(evidence: RecipeReviewEvidence | undefined): boolean {
  if (!evidence) return false

  const author = evidence.author
  const testCook = evidence.testCook
  const foodSafety = evidence.foodSafety
  const culturalReview = evidence.culturalReview
  const editorialReview = evidence.editorialReview
  const sources = evidence.sources ?? []

  return Boolean(
    author?.name &&
      author.attributedAt &&
      testCook?.tester &&
      testCook.testedAt &&
      testCook.version &&
      foodSafety?.reviewer &&
      foodSafety.reviewedAt &&
      foodSafety.scope &&
      culturalReview?.reviewer &&
      culturalReview.reviewedAt &&
      editorialReview?.reviewer &&
      editorialReview.reviewedAt &&
      sources.length > 0 &&
      sources.every((source) => source.title && source.url && source.accessedAt),
  )
}

export function isRecipeReleaseReady(dish: Dish): boolean {
  return dish.review?.status === 'approved' && hasRequiredEvidence(dish.review.evidence)
}
