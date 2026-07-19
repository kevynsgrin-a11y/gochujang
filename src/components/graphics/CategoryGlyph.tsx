import { cn } from '@/lib/cn'

/**
 * Flat, single-weight category marks on a 32px art grid. Stroke uses
 * currentColor so they inherit ink / accent / duotone context. Decorative:
 * callers provide the accessible label.
 */
export function CategoryGlyph({ id, className }: { id: string; className?: string }) {
  const common = {
    viewBox: '0 0 32 32',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: cn('h-8 w-8', className),
    'aria-hidden': true,
  }
  switch (id) {
    case 'fermented-funky': // jar + rising bubbles
      return (
        <svg {...common}>
          <rect x="9" y="12" width="14" height="15" rx="3" />
          <path d="M11 12v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
          <path d="M13 8V6h6v2" />
          <circle cx="14" cy="19" r="1.2" />
          <circle cx="18.5" cy="22" r="1.4" />
          <circle cx="17" cy="17" r="0.9" />
        </svg>
      )
    case 'charred-smoky': // flame
      return (
        <svg {...common}>
          <path d="M16 5c3 4 1.4 6.2-.4 8.4-1.6 2-2.4 3.6-1.4 5.6.6 1.3 1.9 2 1.9 2" />
          <path d="M16 27c4.4 0 7.5-2.9 7.5-7 0-3.6-2-6-4.4-8.6 1.2 3.2.4 5.6-1 7.4" />
          <path d="M13.5 18.5C11 20 9.5 22.4 9.5 25" />
        </svg>
      )
    case 'noodles-broths': // steaming bowl + strands
      return (
        <svg {...common}>
          <path d="M6 15h20a10 10 0 0 1-20 0Z" />
          <path d="M4 15h24" />
          <path d="M12 8c-.8 1.2-.8 2.4 0 3.6M16 7c-.8 1.2-.8 2.4 0 3.6M20 8c-.8 1.2-.8 2.4 0 3.6" />
        </svg>
      )
    case 'rice-bowls': // stone bowl + grains
      return (
        <svg {...common}>
          <path d="M5 14h22a11 11 0 0 1-22 0Z" />
          <path d="M9 14c0-2.8 3.1-5 7-5s7 2.2 7 5" />
          <path d="M13 11.5l.01 0M16 10.5l.01 0M19 11.5l.01 0" />
        </svg>
      )
    case 'small-plates': // stacked plates
      return (
        <svg {...common}>
          <ellipse cx="16" cy="11" rx="9" ry="3" />
          <path d="M7 11c0 1.7 4 3 9 3s9-1.3 9-3" />
          <path d="M6 16c0 1.7 4.5 3 10 3s10-1.3 10-3" />
          <path d="M6 21c0 1.7 4.5 3 10 3s10-1.3 10-3" />
        </svg>
      )
    case 'braises-stews': // pot with lid + bubbles
      return (
        <svg {...common}>
          <path d="M7 14h18v6a5 5 0 0 1-5 5h-8a5 5 0 0 1-5-5v-6Z" />
          <path d="M5 14h22" />
          <path d="M9 14V9M23 14V9" />
          <path d="M16 6.5v-1.5" />
          <circle cx="14" cy="19" r="0.9" />
          <circle cx="18" cy="20" r="0.9" />
        </svg>
      )
    case 'sweet-heat': // chili + sparkle
      return (
        <svg {...common}>
          <path d="M10 12c5 0 9 3.5 9 8.5 0 3-2 5.5-5 5.5-4 0-7-4-7-9" />
          <path d="M19 12.5c1-2 3-2.5 4.5-2" />
          <path d="M24 8l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="9" />
        </svg>
      )
  }
}
