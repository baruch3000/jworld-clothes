import { useEffect, useMemo, useState } from 'react'
import type { Product, ProductFilters, Category } from '../types/product'
import { useCatalog } from '../context/CatalogContext'
import { useCurrency } from '../context/CurrencyContext'
import { filterProducts, DEFAULT_FILTERS, isOnSale } from '../lib/filters'
import { getCatalogDisplayPriceRange } from '../lib/exchangeRates'
import { getAllBrands } from '../lib/storage'
import { ProductGrid } from '../components/products/ProductGrid'
import { FilterSidebar, FilterDrawer, MobileFilterBar } from '../components/filters/FilterPanel'

interface CatalogPageProps {
  title: string
  subtitle?: string
  presetFilters?: Partial<ProductFilters>
  filterFn?: (products: Product[]) => Product[]
}

export function CatalogPage({ title, subtitle, presetFilters, filterFn }: CatalogPageProps) {
  const { products } = useCatalog()
  const { convertPrice, displayCurrency, rates } = useCurrency()
  const priceRange = useMemo(
    () => getCatalogDisplayPriceRange(products, displayCurrency, rates),
    [products, displayCurrency, rates]
  )
  const brands = useMemo(() => getAllBrands(products), [products])

  const [filters, setFilters] = useState<ProductFilters>(() => ({
    ...DEFAULT_FILTERS,
    priceMin: priceRange.min,
    priceMax: priceRange.max,
    ...presetFilters,
  }))
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      ...presetFilters,
      priceMin: priceRange.min,
      priceMax: priceRange.max,
    }))
  }, [presetFilters, priceRange.min, priceRange.max, displayCurrency])

  const baseProducts = useMemo(() => {
    let list = products
    if (filterFn) list = filterFn(list)
    return list
  }, [products, filterFn])

  const filtered = useMemo(
    () => filterProducts(baseProducts, filters, convertPrice),
    [baseProducts, filters, convertPrice]
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-brand-800/60">{subtitle}</p>}
      </div>

      <div className="mb-6 lg:hidden">
        <MobileFilterBar onOpen={() => setDrawerOpen(true)} />
      </div>

      <div className="flex gap-10">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          availableBrands={brands}
          priceRange={priceRange}
          resultCount={filtered.length}
          displayCurrency={displayCurrency}
        />

        <div className="flex-1 min-w-0">
          <ProductGrid products={filtered} />
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
        availableBrands={brands}
        priceRange={priceRange}
        resultCount={filtered.length}
        displayCurrency={displayCurrency}
      />
    </div>
  )
}

export function useCategoryPreset(category: Category) {
  return useMemo(
    () => ({ categories: [category] as Category[] }),
    [category]
  )
}

export { isOnSale }
