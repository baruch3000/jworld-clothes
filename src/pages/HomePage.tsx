import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useCatalog } from '../context/CatalogContext'
import { ProductGrid } from '../components/products/ProductGrid'
import { isOnSale } from '../lib/filters'
import { CATEGORY_LABELS, type Category } from '../types/product'
import { WomenCategoryGraphic } from '../components/home/WomenCategoryGraphic'

const FEATURED_CATEGORIES: { key: Category; image?: string; graphic?: boolean }[] = [
  { key: 'women', graphic: true },
  { key: 'men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=400&fit=crop' },
  { key: 'shoes', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=400&fit=crop' },
  { key: 'sale', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop' },
]

export function HomePage() {
  const { products } = useCatalog()
  const saleItems = products.filter(isOnSale).slice(0, 4)
  const newest = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)

  return (
    <div>
      <section className="relative bg-brand-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 md:py-28">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            New Season Collection
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-6xl">
            Discover Your<br />Signature Style
          </h1>
          <p className="mt-4 max-w-lg text-white/70">
            Curated fashion from top brands. Shop the latest trends in Men, Women, Kids &amp; more.
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
          {FEATURED_CATEGORIES.map(({ key, image, graphic }) => (
            <Link
              key={key}
              to={key === 'sale' ? '/sale' : `/category/${key}`}
              className="group relative aspect-[4/3] overflow-hidden"
              aria-label={CATEGORY_LABELS[key]}
            >
              {graphic ? (
                <WomenCategoryGraphic />
              ) : (
                <>
                  <img
                    src={image}
                    alt={CATEGORY_LABELS[key]}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4">
                    <span className="font-display text-lg font-semibold text-white">
                      {CATEGORY_LABELS[key]}
                    </span>
                  </div>
                </>
              )}
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
            <ProductGrid products={saleItems} />
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
        <ProductGrid products={newest} />
      </section>
    </div>
  )
}
