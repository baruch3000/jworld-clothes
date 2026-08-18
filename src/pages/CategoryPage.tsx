import { useParams, useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { CatalogPage } from './CatalogPage'
import { CATEGORY_LABELS, type Category } from '../types/product'
import { isSubcategoryValidForCategories } from '../lib/subcategories'

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const category = (slug ?? 'women') as Category
  const label = CATEGORY_LABELS[category] ?? slug
  const subParam = searchParams.get('sub') ?? undefined
  const subcategory =
    subParam && isSubcategoryValidForCategories(subParam, [category]) ? subParam : undefined

  const presetFilters = useMemo(
    () => ({
      categories: [category] as Category[],
      subcategories: subcategory ? [subcategory] : [],
    }),
    [category, subcategory]
  )

  const subtitle = subcategory
    ? `${label} · ${subcategory}`
    : `Browse our curated ${label.toLowerCase()} collection`

  return (
    <CatalogPage
      title={subcategory ?? label}
      subtitle={subtitle}
      presetFilters={presetFilters}
    />
  )
}
