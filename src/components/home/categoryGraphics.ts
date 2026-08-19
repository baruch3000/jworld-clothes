import type { Category } from '../../types/product'

export const GRAPHIC_CATEGORY_TILES: {
  key: Category
  label: string
  variant: 0 | 1 | 2 | 3
}[] = [
  { key: 'women', label: 'WOMEN', variant: 0 },
  { key: 'men', label: 'MEN', variant: 1 },
  { key: 'boys', label: 'BOYS', variant: 2 },
  { key: 'girls', label: "GIRL'S", variant: 3 },
]
