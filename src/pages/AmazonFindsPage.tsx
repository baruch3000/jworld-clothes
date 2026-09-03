import { useEffect, useMemo, useState } from 'react'
import { useCatalog } from '../context/CatalogContext'
import { useCurrency } from '../context/CurrencyContext'
import { filterProducts, DEFAULT_FILTERS } from '../lib/filters'
import { getCatalogDisplayPriceRange } from '../lib/exchangeRates'
import { isAmazonLinkProduct } from '../lib/amazonAffiliate'
import { ProductSortBar } from '../components/filters/ProductSortBar'
import { AmazonFindsSection } from '../components/products/AmazonFindsSection'
import { AmazonAssociateDisclosure } from '../components/legal/AmazonAssociateDisclosure'
import type { ProductFilters } from '../types/product'

export function AmazonFindsPage() {
  const { products } = useCatalog()
  const { convertPrice, displayCurrency, rates } = useCurrency()

  const amazonProducts = useMemo(
    () => products.filter(isAmazonLinkProduct),
    [products]
  )

  const priceRange = useMemo(
    () => getCatalogDisplayPriceRange(amazonProducts, displayCurrency, rates),
    [amazonProducts, displayCurrency, rates]
  )

  const [filters, setFilters] = useState<ProductFilters>(() => ({
    ...DEFAULT_FILTERS,
    priceMin: priceRange.min,
    priceMax: priceRange.max,
  }))

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceMin: priceRange.min,
      priceMax: priceRange.max,
    }))
  }, [priceRange.min, priceRange.max, displayCurrency])

  const filtered = useMemo(
    () => filterProducts(amazonProducts, filters, convertPrice),
    [amazonProducts, filters, convertPrice]
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Amazon Finds
        </h1>
        <p className="mt-2 max-w-2xl text-brand-800/60">
          Curated modest fashion picks on Amazon — graphic cards with your guide price and a direct
          link to the store. Product names and images are not copied from Amazon.
        </p>
        <AmazonAssociateDisclosure className="mt-4 max-w-2xl rounded border border-brand-200 bg-brand-50 px-4 py-3" />
      </div>

      {amazonProducts.length === 0 ? (
        <p className="py-16 text-center text-brand-800/50">
          No Amazon links yet. Add them from Admin → Quick Links.
        </p>
      ) : (
        <>
          <ProductSortBar
            sort={filters.sort}
            onChange={(sort) => setFilters({ ...filters, sort })}
            resultCount={filtered.length}
          />
          <AmazonFindsSection
            products={filtered}
            title="All Amazon Finds"
            showDisclosure={false}
            className="mt-6 border-t-0 pt-0"
          />
          <AmazonAssociateDisclosure className="mt-10 rounded border border-brand-200 bg-brand-50 px-4 py-3" />
        </>
      )}
    </div>
  )
}
