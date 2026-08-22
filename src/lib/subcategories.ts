import type { Category } from '../types/product'

const BOYS_GIRLS_SHARED = [
  'Coats & Jackets',
  'Hoodies & Sweatshirts',
  'Jumpers & Cardigans',
  'Shirts',
  'T-Shirts, Tops & Polo Shirts',
] as const

const GIRLS_ONLY = ['Dresses', 'Tops, T-shirts & Blouses'] as const

const BABY_ONLY = ['Babygrows & Rompers'] as const

export const SUBCATEGORIES_BY_CATEGORY: Partial<Record<Category, readonly string[]>> = {
  boys: BOYS_GIRLS_SHARED,
  girls: [...BOYS_GIRLS_SHARED, ...GIRLS_ONLY],
  teen: [...BOYS_GIRLS_SHARED, ...GIRLS_ONLY],
  baby: BABY_ONLY,
}

export function getSubcategoriesForCategories(categories: Category[]): string[] {
  const merged = new Set<string>()
  for (const category of categories) {
    const list = SUBCATEGORIES_BY_CATEGORY[category]
    if (list) list.forEach((item) => merged.add(item))
  }
  return [...merged]
}

export function isSubcategoryValidForCategories(
  subcategory: string | undefined,
  categories: Category[]
): boolean {
  if (!subcategory) return true
  return getSubcategoriesForCategories(categories).includes(subcategory)
}
