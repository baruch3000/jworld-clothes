import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink, RefreshCw, Search, Trash2 } from 'lucide-react'
import type { Product } from '../../types/product'
import { useCatalog } from '../../context/CatalogContext'
import { fetchClickStats, type ClickStatsMap } from '../../lib/clickApi'
import { getLinkOnlyDisplayTitle, isLinkOnlyProduct } from '../../lib/linkOnlyProduct'
import { getProductCategories } from '../../lib/productCategories'
import { ProductPlaceholder } from '../../components/products/ProductPlaceholder'
import { LazyImage } from '../../components/ui/LazyImage'

type SortColumn = 'title' | 'link' | 'added' | 'clicks' | 'lastClick'
type SortDirection = 'asc' | 'desc'

interface LinkRow {
  product: Product
  clicks: number
  lastClickAt: string | null
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function truncateUrl(url: string, max = 56): string {
  if (url.length <= max) return url
  return `${url.slice(0, max - 3)}...`
}

function SortableHeader({
  label,
  column,
  activeColumn,
  direction,
  onSort,
  className = '',
}: {
  label: string
  column: SortColumn
  activeColumn: SortColumn
  direction: SortDirection
  onSort: (column: SortColumn) => void
  className?: string
}) {
  const isActive = activeColumn === column
  const Icon = !isActive ? ArrowUpDown : direction === 'asc' ? ArrowUp : ArrowDown

  return (
    <th className={`px-4 py-3 font-semibold ${className}`}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className="inline-flex items-center gap-1.5 uppercase tracking-wider transition hover:text-brand-900"
      >
        {label}
        <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-brand-900' : 'opacity-40'}`} />
      </button>
    </th>
  )
}

const DEFAULT_DIRECTION: Record<SortColumn, SortDirection> = {
  title: 'asc',
  link: 'asc',
  added: 'desc',
  clicks: 'desc',
  lastClick: 'desc',
}

export function LinkManager() {
  const { products, deleteProduct } = useCatalog()
  const [stats, setStats] = useState<ClickStatsMap>({})
  const [loadingStats, setLoadingStats] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState<SortColumn>('added')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortColumn(column)
    setSortDirection(DEFAULT_DIRECTION[column])
  }

  const loadStats = useCallback(async () => {
    setLoadingStats(true)
    setStatsError(null)
    try {
      const next = await fetchClickStats()
      setStats(next)
    } catch {
      setStatsError('Could not load click stats from server.')
    } finally {
      setLoadingStats(false)
    }
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats, products.length])

  const rows = useMemo<LinkRow[]>(() => {
    const q = search.trim().toLowerCase()
    let list = products
      .filter((product) => product.affiliateUrl.trim())
      .map((product) => ({
        product,
        clicks: stats[product.id]?.clicks ?? 0,
        lastClickAt: stats[product.id]?.lastClickAt ?? null,
      }))

    if (q) {
      list = list.filter(
        ({ product }) =>
          product.affiliateUrl.toLowerCase().includes(q) ||
          product.title.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q)
      )
    }

    const dir = sortDirection === 'asc' ? 1 : -1

    list.sort((a, b) => {
      switch (sortColumn) {
        case 'title':
          return dir * a.product.title.localeCompare(b.product.title, undefined, { sensitivity: 'base' })
        case 'link':
          return dir * a.product.affiliateUrl.localeCompare(b.product.affiliateUrl, undefined, { sensitivity: 'base' })
        case 'clicks':
          return dir * (a.clicks - b.clicks) || b.product.title.localeCompare(a.product.title)
        case 'lastClick': {
          const aTime = a.lastClickAt ? new Date(a.lastClickAt).getTime() : 0
          const bTime = b.lastClickAt ? new Date(b.lastClickAt).getTime() : 0
          return dir * (aTime - bTime)
        }
        case 'added':
        default:
          return dir * (new Date(a.product.createdAt).getTime() - new Date(b.product.createdAt).getTime())
      }
    })

    return list
  }, [products, search, sortColumn, sortDirection, stats])

  const totalClicks = useMemo(
    () => rows.reduce((sum, row) => sum + row.clicks, 0),
    [rows]
  )

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
    await loadStats()
  }

  if (products.length === 0) {
    return (
      <p className="py-10 text-center text-brand-800/50">
        No affiliate links yet. Add a product with a link to see it here.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-brand-800/70">
            {rows.length} links · {totalClicks} total clicks
          </p>
          {statsError && <p className="mt-1 text-xs text-red-600">{statsError}</p>}
        </div>
        <button
          type="button"
          onClick={loadStats}
          disabled={loadingStats}
          className="flex items-center gap-1.5 border border-brand-200 px-3 py-1.5 text-xs font-medium transition hover:border-brand-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      <div className="relative min-w-[220px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-800/40" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product name, brand, or URL..."
          className="w-full border border-brand-200 py-2 pl-10 pr-3 text-sm outline-none focus:border-brand-800"
        />
      </div>

      <div className="overflow-x-auto border border-brand-200">
        <table className="min-w-full text-sm">
          <thead className="bg-brand-50 text-left text-xs text-brand-800/60">
            <tr>
              <SortableHeader
                label="Product"
                column="title"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Affiliate Link"
                column="link"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Added"
                column="added"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Clicks"
                column="clicks"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                label="Last Click"
                column="lastClick"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
              />
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100 bg-white">
            {rows.map(({ product, clicks, lastClickAt }) => {
              const displayTitle = getLinkOnlyDisplayTitle(product)
              const linkOnly = isLinkOnlyProduct(product)
              const primaryCategory = getProductCategories(product)[0] ?? product.category

              return (
              <tr key={product.id} className={`align-middle ${linkOnly ? 'bg-accent/5' : ''}`}>
                <td className="px-4 py-3">
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-[180px] items-center gap-3 transition hover:opacity-80"
                    title={displayTitle}
                  >
                    <div className="h-16 w-12 shrink-0 overflow-hidden bg-brand-100">
                      {linkOnly ? (
                        <ProductPlaceholder
                          category={primaryCategory}
                          subcategory={product.subcategory}
                          className="h-full w-full"
                        />
                      ) : (
                        <LazyImage
                          src={product.imageUrl}
                          alt={displayTitle}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="line-clamp-2 text-sm font-medium leading-snug text-brand-900">
                          {displayTitle}
                        </p>
                        {linkOnly && (
                          <span className="shrink-0 bg-accent px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                            Link only
                          </span>
                        )}
                      </div>
                      {product.brand.trim() && (
                        <p className="mt-0.5 text-xs text-brand-800/50">{product.brand}</p>
                      )}
                    </div>
                  </a>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-xs items-start gap-1 break-all text-accent hover:text-accent-hover"
                    title={product.affiliateUrl}
                  >
                    {truncateUrl(product.affiliateUrl)}
                    <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  </a>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-brand-800/70">
                  {formatDate(product.createdAt)}
                </td>
                <td className="px-4 py-3 font-semibold">{clicks}</td>
                <td className="whitespace-nowrap px-4 py-3 text-brand-800/70">
                  {lastClickAt ? formatDate(lastClickAt) : '—'}
                </td>
                <td className="px-4 py-3">
                  {pendingDeleteId === product.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => confirmDelete(product.id)}
                        className="bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={cancelPendingDelete}
                        className="text-xs text-brand-800/60 hover:text-brand-900"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startDelete(product.id)}
                      className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <p className="py-6 text-center text-sm text-brand-800/50">No links match your search.</p>
      )}

      <p className="text-xs text-brand-800/50">
        Click a column header to sort. Click again to reverse order. Deleting a link removes the
        product from the store.
      </p>
    </div>
  )
}
