import { isSizeRangeBadge } from '../../lib/productSizes'

interface ProductSizeListProps {
  sizes: string[]
  maxRegular?: number
}

export function ProductSizeList({ sizes, maxRegular = 6 }: ProductSizeListProps) {
  if (sizes.length === 0) return null

  const badges = sizes.filter(isSizeRangeBadge)
  const regular = sizes.filter((size) => !isSizeRangeBadge(size))

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {badges.map((size) => (
        <span
          key={size}
          className="border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-brand-900"
        >
          {size}
        </span>
      ))}
      {regular.slice(0, maxRegular).map((size) => (
        <span
          key={size}
          className="border border-brand-200 px-1.5 py-0.5 text-[10px] font-medium text-brand-800/70"
        >
          {size}
        </span>
      ))}
    </div>
  )
}
