import type { Category, CategoryPlacement, Product } from '../types/product'
import { CATEGORY_LABELS } from '../types/product'

export type { CategoryPlacement }

export const ASSIGNABLE_CATEGORIES = (
  Object.keys(CATEGORY_LABELS) as Category[]
).filter((c) => c !== 'brands' && c !== 'sale')

export function getSubcategoriesFromPlacement(placement: CategoryPlacement): string[] {
  if (placement.subcategories?.length) {
    return [...new Set(placement.subcategories.map((s) => s.trim()).filter(Boolean))]
  }
  if (placement.subcategory?.trim()) return [placement.subcategory.trim()]
  return []
}

export function formatSubcategoriesList(subcategories: string[]): string | undefined {
  if (subcategories.length === 0) return undefined
  return subcategories.join(', ')
}

export function normalizePlacements(
  placements: CategoryPlacement[],
  fallback: Category = 'women'
): CategoryPlacement[] {
  const allowed = new Set<Category>(ASSIGNABLE_CATEGORIES)
  const seen = new Set<Category>()
  const result: CategoryPlacement[] = []

  for (const placement of placements) {
    if (!allowed.has(placement.category) || seen.has(placement.category)) continue
    seen.add(placement.category)
    const subcategories = getSubcategoriesFromPlacement(placement)
    result.push({
      category: placement.category,
      subcategories,
    })
    if (result.length >= 2) break
  }

  return result.length > 0 ? result : [{ category: fallback, subcategories: [] }]
}

export function getCategoryPlacements(product: Product): CategoryPlacement[] {
  if (product.categoryPlacements?.length) {
    return normalizePlacements(product.categoryPlacements, product.category)
  }
  return getProductCategories(product).map((category) => ({
    category,
    subcategories: product.subcategory?.trim() ? [product.subcategory.trim()] : [],
  }))
}

export function getSubcategoriesForCategory(
  product: Product,
  category: Category
): string[] {
  const placement = getCategoryPlacements(product).find((p) => p.category === category)
  if (placement) return getSubcategoriesFromPlacement(placement)
  return product.subcategory?.trim() ? [product.subcategory.trim()] : []
}

export function getSubcategoryForCategory(
  product: Product,
  category: Category
): string | undefined {
  return formatSubcategoriesList(getSubcategoriesForCategory(product, category))
}

export function productMatchesSubcategoryFilter(
  product: Product,
  category: Category,
  subcategories: string[]
): boolean {
  if (subcategories.length === 0) return true
  const productSubs = getSubcategoriesForCategory(product, category)
  return productSubs.some((sub) => subcategories.includes(sub))
}

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
  const labels = getCategoryPlacements(product).map((p) => {
    const label = CATEGORY_LABELS[p.category]
    const subs = formatSubcategoriesList(getSubcategoriesFromPlacement(p))
    return subs ? `${label} · ${subs}` : label
  })
  if (labels.length > 0) return labels.join(' · ')
  return CATEGORY_LABELS[product.category]
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
