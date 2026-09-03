import type { Product, ProductFilters, Currency } from '../types/product'
import {
  getEffectivePrice,
  getEffectivePriceMax,
  getDiscountPercent,
  getProductCurrency,
  isOnSale,
  productMatchesPriceFilter,
  getCatalogPriceRange,
} from './pricing'
import { getProductCategories, getCategoryPlacements, getSubcategoriesFromPlacement, productInCategory, productMatchesSubcategoryFilter } from './productCategories'

export { getEffectivePrice, getDiscountPercent, isOnSale, getCatalogPriceRange as getPriceRange }

export type PriceConvertFn = (amount: number, from: Currency) => number

export function filterProducts(
  products: Product[],
  filters: ProductFilters,
  convertPrice?: PriceConvertFn
): Product[] {
  let result = [...products]

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase().trim()
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        getProductCategories(p).some((c) => c.toLowerCase().includes(q)) ||
        getCategoryPlacements(p).some((pl) =>
          getSubcategoriesFromPlacement(pl).some((sub) => sub.toLowerCase().includes(q))
        ) ||
        (p.subcategory?.toLowerCase().includes(q) ?? false)
    )
  }

  if (filters.categories.length > 0) {
    result = result.filter((p) =>
      filters.categories.some((cat) => productInCategory(p, cat))
    )
  }

  if (filters.sizes.length > 0) {
    result = result.filter((p) => filters.sizes.some((s) => p.sizes.includes(s)))
  }

  if (filters.brands.length > 0) {
    result = result.filter((p) => filters.brands.includes(p.brand))
  }

  if (filters.subcategories.length > 0) {
    result = result.filter((p) => {
      const placements = getCategoryPlacements(p)

      if (filters.categories.length > 0) {
        return filters.categories.some((cat) =>
          productInCategory(p, cat) &&
          productMatchesSubcategoryFilter(p, cat, filters.subcategories)
        )
      }

      return placements.some((pl) =>
        getSubcategoriesFromPlacement(pl).some((sub) => filters.subcategories.includes(sub))
      ) || (p.subcategory != null && filters.subcategories.includes(p.subcategory))
    })
  }

  result = result.filter((p) => {
    if (!convertPrice) {
      return productMatchesPriceFilter(p, filters.priceMin, filters.priceMax)
    }
    const currency = getProductCurrency(p)
    const min = convertPrice(getEffectivePrice(p), currency)
    const max = convertPrice(getEffectivePriceMax(p), currency)
    return min <= filters.priceMax && max >= filters.priceMin
  })

  if (filters.onSaleOnly) {
    result = result.filter(isOnSale)
  }

  switch (filters.sort) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'price_asc':
      result.sort((a, b) => {
        if (convertPrice) {
          return (
            convertPrice(getEffectivePrice(a), getProductCurrency(a)) -
            convertPrice(getEffectivePrice(b), getProductCurrency(b))
          )
        }
        return getEffectivePrice(a) - getEffectivePrice(b)
      })
      break
    case 'price_desc':
      result.sort((a, b) => {
        if (convertPrice) {
          return (
            convertPrice(getEffectivePrice(b), getProductCurrency(b)) -
            convertPrice(getEffectivePrice(a), getProductCurrency(a))
          )
        }
        return getEffectivePrice(b) - getEffectivePrice(a)
      })
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
  subcategories: [],
  priceMin: 0,
  priceMax: 500,
  onSaleOnly: false,
  sort: 'newest',
}
