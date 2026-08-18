import type { Category } from '../types/product'

export function categoryPagePath(category: Category, subcategory?: string): string {
  if (category === 'sale') return '/sale'
  if (category === 'brands') return '/brands'

  const base = `/category/${category}`
  if (!subcategory) return base
  return `${base}?sub=${encodeURIComponent(subcategory)}`
}
