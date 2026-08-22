import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink, RefreshCw, Search, Trash2 } from 'lucide-react'
import type { Product } from '../../types/product'
import { useCatalog } from '../../context/CatalogContext'
import { fetchClickStats, type ClickStatsMap } from '../../lib/clickApi'

type LinkSort = 'newest' | 'oldest' | 'most_clicks' | 'least_clicks'

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

function truncateUrl(url: string, max = 72): string {
  if (url.length <= max) return url
  return `${url.slice(0, max - 3)}...`
}

export function LinkManager() {
  const { products, deleteProduct } = useCatalog()
  const [stats, setStats] = useState<ClickStatsMap>({})
  const [loadingStats, setLoadingStats] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<LinkSort>('newest')
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
      list = list.filter(({ product }) => product.affiliateUrl.toLowerCase().includes(q))
    }

    list.sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return new Date(a.product.createdAt).getTime() - new Date(b.product.createdAt).getTime()
        case 'most_clicks':
          return b.clicks - a.clicks || new Date(b.product.createdAt).getTime() - new Date(a.product.createdAt).getTime()
        case 'least_clicks':
          return a.clicks - b.clicks || new Date(b.product.createdAt).getTime() - new Date(a.product.createdAt).getTime()
        case 'newest':
        default:
          return new Date(b.product.createdAt).getTime() - new Date(a.product.createdAt).getTime()
      }
    })

    return list
  }, [products, search, sort, stats])

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

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-800/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by URL..."
            className="w-full border border-brand-200 py-2 pl-10 pr-3 text-sm outline-none focus:border-brand-800"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as LinkSort)}
          className="border border-brand-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-800"
        >
          <option value="newest">Newest added</option>
          <option value="oldest">Oldest first</option>
          <option value="most_clicks">Most clicks</option>
          <option value="least_clicks">Least clicks</option>
        </select>
      </div>

      <div className="overflow-x-auto border border-brand-200">
        <table className="min-w-full text-sm">
          <thead className="bg-brand-50 text-left text-xs uppercase tracking-wider text-brand-800/60">
            <tr>
              <th className="px-4 py-3 font-semibold">Affiliate Link</th>
              <th className="px-4 py-3 font-semibold">Added</th>
              <th className="px-4 py-3 font-semibold">Clicks</th>
              <th className="px-4 py-3 font-semibold">Last Click</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100 bg-white">
            {rows.map(({ product, clicks, lastClickAt }) => (
              <tr key={product.id} className="align-top">
                <td className="px-4 py-3">
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1 break-all text-accent hover:text-accent-hover"
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
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <p className="py-6 text-center text-sm text-brand-800/50">No links match your search.</p>
      )}

      <p className="text-xs text-brand-800/50">
        Deleting a link removes the product from the store. Click stats are stored in{' '}
        <code>click-stats.json</code> on the server.
      </p>
    </div>
  )
}
