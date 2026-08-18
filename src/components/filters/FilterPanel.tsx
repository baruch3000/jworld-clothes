import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import type { ProductFilters, SortOption, Currency } from '../../types/product'
import { CATEGORY_LABELS, SIZE_OPTIONS, type Category } from '../../types/product'

interface FilterPanelProps {
  filters: ProductFilters
  onChange: (filters: ProductFilters) => void
  availableBrands: string[]
  availableSubcategories?: string[]
  priceRange: { min: number; max: number }
  resultCount: number
  displayCurrency?: Currency
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'biggest_discount', label: 'Biggest Discount' },
]

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS).filter(
  (c) => c !== 'brands' && c !== 'sale'
) as Category[]

const ALL_SIZES = [
  ...SIZE_OPTIONS.clothing,
  ...SIZE_OPTIONS.shoes,
  ...SIZE_OPTIONS.kids,
  ...SIZE_OPTIONS.baby,
]

function FilterContent({
  filters,
  onChange,
  availableBrands,
  availableSubcategories = [],
  priceRange,
  resultCount,
  displayCurrency = 'USD',
}: FilterPanelProps) {
  const [brandSearch, setBrandSearch] = useState('')
  const [customBrand, setCustomBrand] = useState('')

  const toggleArrayItem = <T extends string>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]

  const clearFilters = () => {
    onChange({
      ...filters,
      categories: [],
      sizes: [],
      brands: [],
      subcategories: [],
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      onSaleOnly: false,
    })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.brands.length > 0 ||
    filters.subcategories.length > 0 ||
    filters.onSaleOnly ||
    filters.priceMin > priceRange.min ||
    filters.priceMax < priceRange.max

  const filteredBrands = availableBrands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  )

  const addCustomBrandFilter = () => {
    const name = customBrand.trim()
    if (!name) return
    if (!filters.brands.includes(name)) {
      onChange({ ...filters, brands: [...filters.brands, name] })
    }
    setCustomBrand('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-800/60">{resultCount} products</p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-accent hover:text-accent-hover"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        <label htmlFor="sort" className="mb-2 block text-xs font-semibold uppercase tracking-wider">
          Sort By
        </label>
        <select
          id="sort"
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value as SortOption })}
          className="w-full border border-brand-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-800"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={filters.onSaleOnly}
            onChange={(e) => onChange({ ...filters, onSaleOnly: e.target.checked })}
            className="h-4 w-4 accent-brand-900"
          />
          <span className="text-sm font-medium">On Sale Only</span>
        </label>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider">Category</h4>
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                onChange({ ...filters, categories: toggleArrayItem(filters.categories, cat) })
              }
              className={`px-2.5 py-1 text-xs font-medium transition ${
                filters.categories.includes(cat)
                  ? 'bg-brand-900 text-white'
                  : 'border border-brand-200 text-brand-800/70 hover:border-brand-800'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {availableSubcategories.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider">Subcategory</h4>
          <div className="flex flex-wrap gap-1.5">
            {availableSubcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    subcategories: toggleArrayItem(filters.subcategories, sub),
                  })
                }
                className={`px-2.5 py-1 text-xs font-medium transition ${
                  filters.subcategories.includes(sub)
                    ? 'bg-brand-900 text-white'
                    : 'border border-brand-200 text-brand-800/70 hover:border-brand-800'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider">Brand</h4>
        <input
          type="text"
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          placeholder="Search brands..."
          className="mb-2 w-full border border-brand-200 px-2 py-1.5 text-sm outline-none focus:border-brand-800"
        />
        <div className="mb-2 flex gap-1">
          <input
            type="text"
            value={customBrand}
            onChange={(e) => setCustomBrand(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomBrandFilter())}
            placeholder="Type brand name..."
            className="w-full border border-brand-200 px-2 py-1.5 text-sm outline-none focus:border-brand-800"
          />
          <button
            type="button"
            onClick={addCustomBrandFilter}
            disabled={!customBrand.trim()}
            className="shrink-0 border border-brand-200 px-2 text-xs font-medium hover:border-brand-800 disabled:opacity-40"
          >
            Add
          </button>
        </div>
        {filters.brands.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {filters.brands.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() =>
                  onChange({ ...filters, brands: filters.brands.filter((b) => b !== brand) })
                }
                className="bg-brand-900 px-2 py-0.5 text-[11px] font-medium text-white"
              >
                {brand} ×
              </button>
            ))}
          </div>
        )}
        <div className="max-h-40 space-y-1 overflow-y-auto">
          {filteredBrands.map((brand) => (
            <label key={brand} className="flex cursor-pointer items-center gap-2 py-0.5">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() =>
                  onChange({ ...filters, brands: toggleArrayItem(filters.brands, brand) })
                }
                className="h-3.5 w-3.5 accent-brand-900"
              />
              <span className="text-sm">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider">Size</h4>
        <div className="flex flex-wrap gap-1">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                onChange({ ...filters, sizes: toggleArrayItem(filters.sizes, size) })
              }
              className={`min-w-[2rem] px-1.5 py-1 text-[11px] font-medium transition ${
                filters.sizes.includes(size)
                  ? 'bg-brand-900 text-white'
                  : 'border border-brand-200 text-brand-800/70 hover:border-brand-800'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider">
          Price Range ({displayCurrency})
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={priceRange.min}
            max={filters.priceMax}
            value={filters.priceMin}
            onChange={(e) =>
              onChange({ ...filters, priceMin: Number(e.target.value) || priceRange.min })
            }
            className="w-full border border-brand-200 px-2 py-1.5 text-sm outline-none focus:border-brand-800"
            placeholder="Min"
          />
          <span className="text-brand-800/40">—</span>
          <input
            type="number"
            min={filters.priceMin}
            max={priceRange.max}
            value={filters.priceMax}
            onChange={(e) =>
              onChange({ ...filters, priceMax: Number(e.target.value) || priceRange.max })
            }
            className="w-full border border-brand-200 px-2 py-1.5 text-sm outline-none focus:border-brand-800"
            placeholder="Max"
          />
        </div>
        <input
          type="range"
          min={priceRange.min}
          max={priceRange.max}
          value={filters.priceMax}
          onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
          className="mt-3 w-full accent-brand-900"
        />
      </div>
    </div>
  )
}

export function FilterSidebar(props: FilterPanelProps) {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-36">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </h3>
        <FilterContent {...props} />
      </div>
    </aside>
  )
}

interface FilterDrawerProps extends FilterPanelProps {
  open: boolean
  onClose: () => void
}

export function FilterDrawer({ open, onClose, ...props }: FilterDrawerProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-brand-50 p-6 animate-fade-in">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </h3>
          <button type="button" onClick={onClose} className="text-sm font-medium">
            Close
          </button>
        </div>
        <FilterContent {...props} />
      </div>
    </div>
  )
}

export function MobileFilterBar({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex items-center gap-2 border border-brand-200 bg-white px-4 py-2.5 text-sm font-medium lg:hidden"
    >
      <SlidersHorizontal className="h-4 w-4" />
      Filters &amp; Sort
    </button>
  )
}
