import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { CatalogPage } from './CatalogPage'

export function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''

  const presetFilters = useMemo(() => ({ search: query }), [query])

  return (
    <CatalogPage
      title={query ? `Results for "${query}"` : 'Search'}
      subtitle={query ? `Showing products matching your search` : 'Enter a search term to find products'}
      presetFilters={presetFilters}
    />
  )
}
