/**
 * Tiny classnames joiner — no dependency, handles conditional/falsey values.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
