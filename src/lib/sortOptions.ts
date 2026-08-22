import type { SortOption } from '../types/product'

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'biggest_discount', label: 'Biggest Discount' },
]

export function getSortLabel(value: SortOption): string {
  return SORT_OPTIONS.find((opt) => opt.value === value)?.label ?? 'Newest'
}
