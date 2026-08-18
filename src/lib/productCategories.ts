import type { Category, Product } from '../types/product'
import { CATEGORY_LABELS } from '../types/product'

export const ASSIGNABLE_CATEGORIES = (
  Object.keys(CATEGORY_LABELS) as Category[]
).filter((c) => c !== 'brands' && c !== 'sale')

export function getProductCategories(product: Product): Category[] {
  const fromList = product.categories?.filter(
    (c) => c !== 'brands' && c !== 'sale'
  )
  if (fromList && fromList.length > 0) return fromList
  if (product.category === 'brands' || product.category === 'sale') {
    return []
  }
  return [product.category]
}

export function productInCategory(product: Product, category: Category): boolean {
  return getProductCategories(product).includes(category)
}

export function formatProductCategories(product: Product): string {
  const labels = getProductCategories(product).map((c) => CATEGORY_LABELS[c])
  return labels.length > 0 ? labels.join(' · ') : CATEGORY_LABELS[product.category]
}

export function normalizeProductCategories(
  categories: Category[],
  fallback: Category = 'women'
): Category[] {
  const allowed = new Set<Category>(ASSIGNABLE_CATEGORIES)
  const unique = categories.filter(
    (c, i, arr) => allowed.has(c) && arr.indexOf(c) === i
  )
  if (unique.length === 0) return [fallback]
  return unique.slice(0, 2)
}
