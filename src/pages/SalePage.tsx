import { CatalogPage, isOnSale } from './CatalogPage'

export function SalePage() {
  return (
    <CatalogPage
      title="Sale / Offers"
      subtitle="Exclusive deals and discounted fashion finds"
      presetFilters={{ onSaleOnly: true }}
      filterFn={(products) => products.filter(isOnSale)}
    />
  )
}
