import { cn } from '@/lib/cn'

/**
 * Soft, animated multi-blob gradient backdrop built entirely from palette CSS
 * variables — self-contained, GPU-cheap, and adapts to light/dark + any final
 * palette automatically. Used behind heroes and feature sections.
 */
export function GradientMesh({
  className,
  intensity = 'medium',
  animate = true,
}: {
  className?: string
  intensity?: 'soft' | 'medium' | 'bold'
  animate?: boolean
}) {
  const opacity = intensity === 'soft' ? 0.35 : intensity === 'bold' ? 0.85 : 0.6

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      <div
        className={cn('absolute -left-[10%] -top-[20%] h-[60vh] w-[60vh] rounded-full blur-[90px]', animate && 'animate-float-slow')}
        style={{ background: `radial-gradient(circle, rgb(var(--primary) / ${opacity}), transparent 62%)` }}
      />
      <div
        className={cn('absolute right-[-8%] top-[6%] h-[52vh] w-[52vh] rounded-full blur-[100px]', animate && 'animate-float-slow')}
        style={{ background: `radial-gradient(circle, rgb(var(--accent) / ${opacity}), transparent 60%)`, animationDelay: '-2.5s' }}
      />
      <div
        className={cn('absolute bottom-[-18%] left-[24%] h-[54vh] w-[54vh] rounded-full blur-[110px]', animate && 'animate-float-slow')}
        style={{ background: `radial-gradient(circle, rgb(var(--ember) / ${opacity * 0.85}), transparent 64%)`, animationDelay: '-5s' }}
      />
    </div>
  )
}
