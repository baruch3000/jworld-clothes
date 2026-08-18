import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useCatalog } from '../context/CatalogContext'
import { getAllBrands } from '../lib/storage'

export function BrandsPage() {
  const { products } = useCatalog()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [customInput, setCustomInput] = useState('')

  const brands = useMemo(() => getAllBrands(products), [products])

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of products) {
      counts[p.brand] = (counts[p.brand] ?? 0) + 1
    }
    return counts
  }, [products])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return brands
    return brands.filter((b) => b.toLowerCase().includes(q))
  }, [brands, search])

  const goToBrand = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    navigate(`/brands/${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-semibold md:text-4xl">Brands</h1>
      <p className="mt-2 text-brand-800/60">Shop by brand — pick from the list or type any name</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-800/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands..."
            className="w-full border border-brand-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-800"
          />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            goToBrand(customInput)
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Or type a brand name..."
            className="w-full min-w-[200px] border border-brand-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-800 sm:w-64"
          />
          <button
            type="submit"
            disabled={!customInput.trim()}
            className="shrink-0 bg-brand-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-800 disabled:opacity-40"
          >
            Go
          </button>
        </form>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-brand-800/60">No brands match &quot;{search}&quot;</p>
          {search.trim() && (
            <button
              type="button"
              onClick={() => goToBrand(search)}
              className="mt-4 text-sm font-medium text-accent hover:text-accent-hover"
            >
              Search products for &quot;{search.trim()}&quot; →
            </button>
          )}
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((brand) => (
            <Link
              key={brand}
              to={`/brands/${encodeURIComponent(brand)}`}
              className="group border border-brand-200 bg-white p-6 text-center transition hover:border-brand-800 hover:shadow-sm"
            >
              <span className="font-display text-lg font-semibold group-hover:text-accent">
                {brand}
              </span>
              <p className="mt-1 text-xs text-brand-800/50">
                {brandCounts[brand] ?? 0} {(brandCounts[brand] ?? 0) === 1 ? 'item' : 'items'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
