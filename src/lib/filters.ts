import type { Product, ProductFilters } from '../types/product'
import {
  getEffectivePrice,
  getDiscountPercent,
  isOnSale,
  productMatchesPriceFilter,
  getCatalogPriceRange,
} from './pricing'

export { getEffectivePrice, getDiscountPercent, isOnSale, getCatalogPriceRange as getPriceRange }

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products]

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase().trim()
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subcategory?.toLowerCase().includes(q) ?? false)
    )
  }

  if (filters.categories.length > 0) {
    result = result.filter((p) => filters.categories.includes(p.category))
  }

  if (filters.sizes.length > 0) {
    result = result.filter((p) => filters.sizes.some((s) => p.sizes.includes(s)))
  }

  if (filters.brands.length > 0) {
    result = result.filter((p) => filters.brands.includes(p.brand))
  }

  result = result.filter((p) =>
    productMatchesPriceFilter(p, filters.priceMin, filters.priceMax)
  )

  if (filters.onSaleOnly) {
    result = result.filter(isOnSale)
  }

  switch (filters.sort) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'price_asc':
      result.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b))
      break
    case 'price_desc':
      result.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a))
      break
    case 'biggest_discount':
      result.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a))
      break
  }

  return result
}

export const DEFAULT_FILTERS: ProductFilters = {
  search: '',
  categories: [],
  sizes: [],
  brands: [],
  priceMin: 0,
  priceMax: 500,
  onSaleOnly: false,
  sort: 'newest',
}
