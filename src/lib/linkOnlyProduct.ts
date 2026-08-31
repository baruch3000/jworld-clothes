import type { Category, Product } from '../types/product'
import { CATEGORY_LABELS } from '../types/product'
import { getProductCategories } from './productCategories'

export function isLinkOnlyProduct(product: Product): boolean {
  return product.linkOnly === true
}

export function buildLinkOnlyTitle(categories: Category[], subcategory?: string): string {
  const primary = categories[0]
  if (!primary) return 'Store Link'
  const label = CATEGORY_LABELS[primary]
  if (subcategory?.trim()) return `${label} · ${subcategory.trim()}`
  return label
}

export function getLinkOnlyDisplayTitle(product: Product): string {
  if (!isLinkOnlyProduct(product)) return product.title
  return buildLinkOnlyTitle(getProductCategories(product), product.subcategory)
}

export function categoryPlaceholderVariant(category: Category): 0 | 1 | 2 | 3 {
  const map: Partial<Record<Category, 0 | 1 | 2 | 3>> = {
    women: 0,
    men: 1,
    boys: 2,
    girls: 3,
    teen: 0,
    baby: 1,
    shoes: 2,
    occasions: 3,
  }
  return map[category] ?? 0
}

export function categoryGraphicLabel(category: Category): string {
  return CATEGORY_LABELS[category]?.toUpperCase().replace(/\s+/g, ' ') ?? 'SHOP'
}
