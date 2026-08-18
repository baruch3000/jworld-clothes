import type { Currency, PriceType, Product } from '../types/product'

export const CURRENCY_LABELS: Record<Currency, string> = {
  USD: '$ USD',
  EUR: '€ EUR',
  ILS: '₪ ILS',
}

export const CURRENCY_LOCALE: Record<Currency, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  ILS: 'he-IL',
}

export function getProductCurrency(product: Product): Currency {
  return product.currency ?? 'USD'
}

export function getPriceType(product: Product): PriceType {
  return product.priceType ?? 'single'
}

export function isPriceRange(product: Product): boolean {
  return getPriceType(product) === 'range' && product.originalPriceMax != null
}

export function formatPrice(amount: number, currency: Currency = 'USD'): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPriceRange(
  min: number,
  max: number,
  currency: Currency = 'USD'
): string {
  if (min === max) return formatPrice(min, currency)
  return `${formatPrice(min, currency)} – ${formatPrice(max, currency)}`
}

export function getEffectivePrice(product: Product): number {
  return product.salePrice ?? product.originalPrice
}

export function getEffectivePriceMax(product: Product): number {
  if (isPriceRange(product)) {
    if (product.salePriceMax != null) return product.salePriceMax
    if (product.salePrice != null && product.originalPriceMax != null) {
      return product.originalPriceMax - (product.originalPrice - product.salePrice)
    }
    return product.originalPriceMax ?? product.originalPrice
  }
  return product.salePrice ?? product.originalPrice
}

export function formatProductPrice(product: Product): string {
  const currency = getProductCurrency(product)

  if (isPriceRange(product)) {
    const max = product.originalPriceMax!
    if (isOnSale(product) && product.salePrice != null) {
      const saleMax = product.salePriceMax ?? product.salePrice
      return formatPriceRange(product.salePrice, saleMax, currency)
    }
    return formatPriceRange(product.originalPrice, max, currency)
  }

  const effective = getEffectivePrice(product)
  return formatPrice(effective, currency)
}

export function formatProductOriginalPrice(product: Product): string | null {
  if (!isOnSale(product)) return null
  const currency = getProductCurrency(product)

  if (isPriceRange(product) && product.originalPriceMax != null) {
    return formatPriceRange(product.originalPrice, product.originalPriceMax, currency)
  }

  return formatPrice(product.originalPrice, currency)
}

export function isOnSale(product: Product): boolean {
  if (product.salePrice == null) return false
  if (isPriceRange(product)) {
    return product.salePrice < product.originalPrice
  }
  return product.salePrice < product.originalPrice
}

export function getDiscountPercent(product: Product): number {
  if (!isOnSale(product) || product.salePrice == null) return 0
  if (product.originalPrice <= 0) return 0
  return Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
}

export function productMatchesPriceFilter(
  product: Product,
  filterMin: number,
  filterMax: number
): boolean {
  const productMin = getEffectivePrice(product)
  const productMax = getEffectivePriceMax(product)
  return productMin <= filterMax && productMax >= filterMin
}

export function getCatalogPriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 500 }
  const mins = products.map(getEffectivePrice)
  const maxs = products.map(getEffectivePriceMax)
  return {
    min: Math.floor(Math.min(...mins)),
    max: Math.ceil(Math.max(...maxs)),
  }
}
