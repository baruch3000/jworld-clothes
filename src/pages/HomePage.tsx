import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useCatalog } from '../context/CatalogContext'
import { InterleavedProductGrid } from '../components/products/InterleavedProductGrid'
import { AmazonFindsSection } from '../components/products/AmazonFindsSection'
import { isOnSale } from '../lib/filters'
import { isAmazonLinkProduct } from '../lib/amazonAffiliate'
import { CATEGORY_LABELS } from '../types/product'
import { CategoryGraphicTile } from '../components/home/CategoryGraphicTile'
import { GRAPHIC_CATEGORY_TILES } from '../components/home/categoryGraphics'

export function HomePage() {
  const { products } = useCatalog()
  const saleItems = products.filter((p) => isOnSale(p) && !p.linkOnly).slice(0, 8)
  const newest = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12)
  const amazonFinds = [...products]
    .filter(isAmazonLinkProduct)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  return (
    <div>
      <section className="relative bg-brand-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 md:py-28">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            Modest Fashion, Top Brands
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
            Style You Love.<br />Standards You Keep.
          </h1>
          <p className="mt-4 max-w-lg text-white/70">
            The first dedicated platform for modest fashion from well-known international brands —
            for Men, Women, Kids, Teen &amp; Baby.
          </p>
          <Link
            to="/category/women"
            className="mt-8 inline-flex items-center gap-2 bg-white px-8 py-3 text-sm font-semibold text-brand-900 transition hover:bg-brand-100"
          >
            Shop Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-center font-display text-2xl font-semibold md:text-3xl">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {GRAPHIC_CATEGORY_TILES.map(({ key, label, variant }) => (
            <Link
              key={key}
              to={`/category/${key}`}
              className="group relative aspect-[4/3] overflow-hidden"
              aria-label={CATEGORY_LABELS[key]}
            >
              <CategoryGraphicTile label={label} variant={variant} />
            </Link>
          ))}
        </div>
      </section>

      {saleItems.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-display text-2xl font-semibold md:text-3xl">On Sale Now</h2>
              <Link to="/sale" className="text-sm font-medium text-accent hover:text-accent-hover">
                View All →
              </Link>
            </div>
            <InterleavedProductGrid products={saleItems} />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">New Arrivals</h2>
          <Link to="/category/women" className="text-sm font-medium text-accent hover:text-accent-hover">
            Browse All →
          </Link>
        </div>
        <InterleavedProductGrid products={newest} />
      </section>

      {amazonFinds.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-2 flex items-end justify-between">
              <h2 className="font-display text-2xl font-semibold md:text-3xl">Amazon Finds</h2>
              <Link to="/amazon-finds" className="text-sm font-medium text-accent hover:text-accent-hover">
                View All →
              </Link>
            </div>
            <AmazonFindsSection
              products={amazonFinds}
              hideTitle
              showDisclosure={true}
              className="mt-6 border-t-0 pt-0"
            />
          </div>
        </section>
      )}
    </div>
  )
}
