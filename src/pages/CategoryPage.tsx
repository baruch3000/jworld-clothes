import { useParams } from 'react-router-dom'
import { CatalogPage } from './CatalogPage'
import { CATEGORY_LABELS, type Category } from '../types/product'

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const category = (slug ?? 'women') as Category
  const label = CATEGORY_LABELS[category] ?? slug

  return (
    <CatalogPage
      title={label}
      subtitle={`Browse our curated ${label.toLowerCase()} collection`}
      presetFilters={{ categories: [category] }}
    />
  )
}
