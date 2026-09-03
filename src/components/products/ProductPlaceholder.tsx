import type { Category } from '../../types/product'
import {
  categoryGraphicLabel,
  categoryPlaceholderVariant,
} from '../../lib/linkOnlyProduct'

interface ProductPlaceholderProps {
  category: Category
  subcategory?: string
  compact?: boolean
  className?: string
}

const CIRCLE_VARIANTS: Record<
  0 | 1 | 2 | 3,
  { top: string; bottom: string }
> = {
  0: {
    top: 'absolute -right-8 -top-8 h-32 w-32 rounded-full border border-accent/25',
    bottom: 'absolute -bottom-12 -left-12 h-40 w-40 rounded-full border border-white/10',
  },
  1: {
    top: 'absolute -left-8 -top-6 h-28 w-28 rounded-full border border-accent/20',
    bottom: 'absolute -bottom-10 -right-10 h-36 w-36 rounded-full border border-white/10',
  },
  2: {
    top: 'absolute -right-4 top-4 h-24 w-24 rounded-full border border-white/10',
    bottom: 'absolute -bottom-14 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full border border-accent/20',
  },
  3: {
    top: 'absolute -left-6 top-3 h-32 w-32 rounded-full border border-white/10',
    bottom: 'absolute -bottom-10 -right-8 h-40 w-40 rounded-full border border-accent/25',
  },
}

export function ProductPlaceholder({
  category,
  subcategory,
  compact = false,
  className = '',
}: ProductPlaceholderProps) {
  const variant = categoryPlaceholderVariant(category)
  const circles = CIRCLE_VARIANTS[variant]
  const categoryLabel = categoryGraphicLabel(category)

  return (
    <div
      className={`relative h-full w-full overflow-hidden border-l-4 border-accent bg-brand-900 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-900 to-black" />
      <div aria-hidden className={circles.top} />
      <div aria-hidden className={circles.bottom} />
      <div aria-hidden className={`absolute inset-3 border border-accent/20 ${compact ? 'inset-2' : ''}`} />

      <div className={`absolute inset-0 flex flex-col items-center justify-center text-center ${compact ? 'px-2 py-1' : 'px-3'}`}>
        <span className={`font-display font-medium uppercase tracking-[0.2em] text-accent ${compact ? 'text-[9px]' : 'text-[clamp(0.65rem,2.5vw,0.75rem)]'}`}>
          Store Link
        </span>
        <span className={`mt-1.5 font-display font-semibold leading-tight tracking-[0.1em] text-white ${compact ? 'text-sm' : 'text-[clamp(1rem,4vw,1.35rem)]'}`}>
          {categoryLabel}
        </span>
        {subcategory && (
          <span className={`mt-1 line-clamp-2 font-medium uppercase tracking-wider text-white/70 ${compact ? 'px-1 text-[8px]' : 'px-2 text-[10px]'}`}>
            {subcategory}
          </span>
        )}
        <span className={`bg-accent ${compact ? 'mt-2 h-px w-6' : 'mt-4 h-px w-10'}`} />
      </div>
    </div>
  )
}
