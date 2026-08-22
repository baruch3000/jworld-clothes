import type { Category } from '../types/product'

const SHOES_AND_BAGS = ['Shoes', 'Bags'] as const

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
  men: [...SHOES_AND_BAGS],
  women: [...SHOES_AND_BAGS],
  boys: [...BOYS_GIRLS_SHARED, ...SHOES_AND_BAGS],
  girls: [...BOYS_GIRLS_SHARED, ...GIRLS_ONLY, ...SHOES_AND_BAGS],
  teen: [...BOYS_GIRLS_SHARED, ...GIRLS_ONLY, ...SHOES_AND_BAGS],
  baby: [...BABY_ONLY, ...SHOES_AND_BAGS],
  shoes: [...SHOES_AND_BAGS],
  occasions: [...SHOES_AND_BAGS],
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
