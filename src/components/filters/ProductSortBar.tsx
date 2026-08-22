import { ArrowUpDown } from 'lucide-react'
import type { SortOption } from '../../types/product'
import { SORT_OPTIONS } from '../../lib/sortOptions'

interface ProductSortBarProps {
  sort: SortOption
  onChange: (sort: SortOption) => void
  resultCount: number
}

export function ProductSortBar({ sort, onChange, resultCount }: ProductSortBarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-brand-200 pb-4">
      <p className="text-sm text-brand-800/60">
        {resultCount} {resultCount === 1 ? 'product' : 'products'}
      </p>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-brand-800/40" aria-hidden="true" />
        <label htmlFor="product-sort" className="text-sm font-medium text-brand-800/70">
          Sort by
        </label>
        <select
          id="product-sort"
          value={sort}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="border border-brand-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-800"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
