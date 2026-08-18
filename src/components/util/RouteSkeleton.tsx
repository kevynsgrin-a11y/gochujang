/**
 * Fallback shown while a route's code chunk is in flight.
 *
 * Reserves a full viewport so a lazy route swap cannot collapse the page
 * height and bounce the scroll position — the layout-shift failure mode that
 * usually comes with route-level code splitting.
 */
export function RouteSkeleton() {
  return (
    <div className="grid min-h-[70svh] place-items-center" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-primary motion-reduce:animate-none"
        aria-hidden
      />
    </div>
  )
}
