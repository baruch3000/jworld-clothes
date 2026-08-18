import { useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { CatalogPage } from './CatalogPage'

export function BrandDetailPage() {
  const { brand } = useParams<{ brand: string }>()
  const decoded = decodeURIComponent(brand ?? '')

  const presetFilters = useMemo(
    () => ({ brands: decoded ? [decoded] : [] }),
    [decoded]
  )

  return (
    <CatalogPage
      title={decoded}
      subtitle={`All products from ${decoded}`}
      presetFilters={presetFilters}
    />
  )
}
