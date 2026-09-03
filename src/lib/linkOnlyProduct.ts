import type { Category, Product } from '../types/product'
import { CATEGORY_LABELS } from '../types/product'
import {
  formatSubcategoriesList,
  getCategoryPlacements,
  getSubcategoriesForCategory,
  getSubcategoriesFromPlacement,
} from './productCategories'

export function isLinkOnlyProduct(product: Product): boolean {
  return product.linkOnly === true
}

export function buildLinkOnlyTitle(categories: Category[], subcategories?: string[]): string {
  const primary = categories[0]
  if (!primary) return 'Store Link'
  const label = CATEGORY_LABELS[primary]
  const subs = subcategories?.map((s) => s.trim()).filter(Boolean)
  if (subs?.length) return `${label} · ${subs.join(', ')}`
  return label
}

export function buildLinkOnlyTitleFromPlacements(
  placements: { category: Category; subcategories?: string[]; subcategory?: string }[]
): string {
  if (placements.length === 0) return 'Store Link'
  return placements
    .map((p) => buildLinkOnlyTitle([p.category], getSubcategoriesFromPlacement(p)))
    .join(' · ')
}

export function getLinkOnlyDisplayTitle(product: Product, pageCategory?: Category): string {
  if (!isLinkOnlyProduct(product)) return product.title

  const placements = getCategoryPlacements(product)
  if (pageCategory) {
    const placement = placements.find((p) => p.category === pageCategory)
    if (placement) {
      return buildLinkOnlyTitle(
        [placement.category],
        getSubcategoriesFromPlacement(placement)
      )
    }
  }

  return buildLinkOnlyTitleFromPlacements(placements)
}

export function getLinkOnlyPlaceholderCategory(
  product: Product,
  pageCategory?: Category
): Category {
  if (pageCategory && getCategoryPlacements(product).some((p) => p.category === pageCategory)) {
    return pageCategory
  }
  return getCategoryPlacements(product)[0]?.category ?? product.category
}

export function getLinkOnlyPlaceholderSubcategory(
  product: Product,
  pageCategory?: Category
): string | undefined {
  const category = getLinkOnlyPlaceholderCategory(product, pageCategory)
  return formatSubcategoriesList(getSubcategoriesForCategory(product, category))
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
    bags: 3,
    occasions: 3,
  }
  return map[category] ?? 0
}

export function categoryGraphicLabel(category: Category): string {
  return CATEGORY_LABELS[category]?.toUpperCase().replace(/\s+/g, ' ') ?? 'SHOP'
}
