export type Category =
  | 'men'
  | 'women'
  | 'boys'
  | 'girls'
  | 'teen'
  | 'baby'
  | 'shoes'
  | 'occasions'
  | 'brands'
  | 'sale'

export type Audience = 'men' | 'women' | 'kids' | 'teen' | 'baby' | 'unisex'

export type StockStatus = 'in_stock' | 'out_of_stock'

export type Currency = 'USD' | 'EUR' | 'GBP' | 'ILS'

export type PriceType = 'single' | 'range'

export interface Product {
  id: string
  title: string
  brand: string
  category: Category
  /** Up to 2 categories — product appears in both category pages */
  categories?: Category[]
  audience: Audience
  subcategory?: string
  currency?: Currency
  priceType?: PriceType
  originalPrice: number
  originalPriceMax?: number
  salePrice?: number
  salePriceMax?: number
  sizes: string[]
  imageUrl: string
  affiliateUrl: string
  inStock: boolean
  /** Show "significant discount on merchant site" notice (no fixed amount) */
  merchantDiscount?: boolean
  /** No merchant image/text — graphic card with affiliate link only */
  linkOnly?: boolean
  createdAt: string
  updatedAt: string
}

export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'biggest_discount'

export interface ProductFilters {
  search: string
  categories: Category[]
  sizes: string[]
  brands: string[]
  subcategories: string[]
  priceMin: number
  priceMax: number
  onSaleOnly: boolean
  sort: SortOption
}

export const CATEGORY_LABELS: Record<Category, string> = {
  men: 'Men',
  women: 'Women',
  boys: 'Boys',
  girls: 'Girls',
  teen: 'Teen',
  baby: 'Baby',
  shoes: 'Shoes',
  occasions: 'Occasions / Events',
  brands: 'Brands',
  sale: 'Sale / Offers',
}

export const AUDIENCE_LABELS: Record<Audience, string> = {
  men: 'Men',
  women: 'Women',
  kids: 'Kids',
  teen: 'Teen',
  baby: 'Baby',
  unisex: 'Unisex',
}

export const SIZE_OPTIONS = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  shoes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
  kids: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y', '10Y', '12Y', '14Y', '16Y'],
  teen: ['7', '16'],
  baby: ['0-3M', '3-6M', '6-12M', '12-18M', '18-24M'],
} as const
