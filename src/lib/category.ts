import type { Category, Audience } from '../types/product'

export function categoryToAudience(category: Category): Audience {
  switch (category) {
    case 'men':
      return 'men'
    case 'women':
      return 'women'
    case 'boys':
    case 'girls':
      return 'kids'
    case 'teen':
      return 'teen'
    case 'baby':
      return 'baby'
    default:
      return 'unisex'
  }
}
