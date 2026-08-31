import { useMemo, useRef, useState } from 'react'
import type { Category, Product } from '../../types/product'
import { CATEGORY_LABELS } from '../../types/product'
import { useCatalog } from '../../context/CatalogContext'
import { formatProductPrice } from '../../lib/affiliate'
import {
  ASSIGNABLE_CATEGORIES,
  formatProductCategories,
  getProductCategories,
} from '../../lib/productCategories'
import { Pencil, Trash2, ToggleLeft, ToggleRight, X, Check, Search, ExternalLink } from 'lucide-react'
import { LazyImage } from '../../components/ui/LazyImage'
import { ProductPlaceholder } from '../../components/products/ProductPlaceholder'
import { getLinkOnlyDisplayTitle, isLinkOnlyProduct } from '../../lib/linkOnlyProduct'

interface ProductTableProps {
  onEdit: (product: Product) => void
}

export function ProductTable({ onEdit }: ProductTableProps) {
  const { products, updateProduct, deleteProduct } = useCatalog()
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sorted = useMemo(
    () =>
      [...products].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [products]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return sorted.filter((product) => {
      if (categoryFilter !== 'all' && !getProductCategories(product).includes(categoryFilter)) {
        return false
      }
      if (!q) return true
      return (
        product.title.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        (product.subcategory?.toLowerCase().includes(q) ?? false) ||
        getProductCategories(product).some((cat) =>
          CATEGORY_LABELS[cat].toLowerCase().includes(q)
        )
      )
    })
  }, [sorted, search, categoryFilter])

  const cancelPendingDelete = () => {
    if (confirmTimerRef.current) {
      clearTimeout(confirmTimerRef.current)
      confirmTimerRef.current = null
    }
    setPendingDeleteId(null)
  }

  const startDelete = (id: string) => {
    cancelPendingDelete()
    setPendingDeleteId(id)
    confirmTimerRef.current = setTimeout(() => {
      setPendingDeleteId(null)
      confirmTimerRef.current = null
    }, 5000)
  }

  const confirmDelete = async (id: string) => {
    await deleteProduct(id)
    cancelPendingDelete()
  }

  if (products.length === 0) {
    return (
      <p className="py-10 text-center text-brand-800/50">No products yet. Add your first one above!</p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-800/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, brand, or category..."
            className="w-full border border-brand-200 py-2 pl-10 pr-3 text-sm outline-none focus:border-brand-800"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as Category | 'all')}
          className="border border-brand-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-800 sm:w-48"
        >
          <option value="all">All categories</option>
          {ASSIGNABLE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-brand-800/50">
        Showing {filtered.length} of {products.length} products
      </p>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-brand-800/50">No products match your search.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((product) => {
            const isPending = pendingDeleteId === product.id
            const linkOnly = isLinkOnlyProduct(product)
            const displayTitle = getLinkOnlyDisplayTitle(product)
            const primaryCategory = getProductCategories(product)[0] ?? product.category

            return (
              <div
                key={product.id}
                className={`flex flex-wrap items-center gap-3 border border-brand-200 bg-white p-3 transition ${
                  isPending ? 'border-red-300 bg-red-50/40' : linkOnly ? 'border-accent/30 bg-accent/5' : ''
                }`}
              >
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 flex-1 basis-[200px] items-center gap-3 transition hover:opacity-80"
                  title="Open store link"
                >
                  <div className="h-14 w-11 shrink-0 overflow-hidden bg-brand-100">
                    {linkOnly ? (
                      <ProductPlaceholder
                        category={primaryCategory}
                        subcategory={product.subcategory}
                        className="h-full w-full"
                      />
                    ) : (
                      <LazyImage src={product.imageUrl} alt="" className="h-full w-full" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="line-clamp-2 text-sm font-medium leading-snug">{displayTitle}</p>
                      {linkOnly && (
                        <span className="shrink-0 bg-accent px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                          Link
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-brand-800/50">
                      {[
                        product.brand,
                        formatProductCategories(product),
                        product.subcategory,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                </a>

                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {formatProductPrice(product)}
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      product.inStock ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="flex w-full shrink-0 items-center justify-end gap-1 sm:w-auto">
                  {product.affiliateUrl && (
                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center border border-brand-200 transition hover:border-brand-800 hover:text-accent"
                      title="Open store link"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      cancelPendingDelete()
                      onEdit(product)
                    }}
                    className="flex h-8 w-8 items-center justify-center border border-brand-200 transition hover:border-brand-800 hover:text-accent"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => updateProduct(product.id, { inStock: !product.inStock })}
                    className="flex h-8 w-8 items-center justify-center border border-brand-200 transition hover:border-brand-800"
                    title="Toggle stock"
                  >
                    {product.inStock ? (
                      <ToggleRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-red-400" />
                    )}
                  </button>

                  {!isPending ? (
                    <button
                      type="button"
                      onClick={() => startDelete(product.id)}
                      className="flex h-8 w-8 items-center justify-center border border-brand-200 transition hover:border-red-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 animate-fade-in">
                      <span className="px-1.5 text-[11px] font-medium text-red-700">Delete?</span>
                      <button
                        type="button"
                        onClick={() => confirmDelete(product.id)}
                        className="flex h-8 w-8 items-center justify-center bg-red-600 text-white hover:bg-red-700"
                        title="Yes, delete"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelPendingDelete}
                        className="flex h-8 w-8 items-center justify-center border border-brand-200 bg-white hover:bg-brand-50"
                        title="Cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
