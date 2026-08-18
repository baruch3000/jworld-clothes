import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../types/product'
import { fetchCatalogFromServer, saveCatalogToServer } from '../lib/catalogApi'
import { getProducts, saveProducts } from '../lib/storage'

interface CatalogContextValue {
  products: Product[]
  loading: boolean
  syncing: boolean
  syncError: string | null
  refresh: () => Promise<void>
  addProduct: (product: Product) => Promise<void>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  clearAllProducts: () => Promise<void>
  importCatalog: (json: string) => Promise<{ success: boolean; count: number; error?: string }>
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setSyncError(null)
    const cached = getProducts()
    if (cached.length > 0) {
      setProducts(cached)
      setLoading(false)
    } else {
      setLoading(true)
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15_000)

    try {
      const serverProducts = await fetchCatalogFromServer(controller.signal)
      setProducts(serverProducts)
      saveProducts(serverProducts)
    } catch {
      if (cached.length === 0) {
        setSyncError('Could not load products from server.')
      }
    } finally {
      window.clearTimeout(timeout)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const persist = useCallback(async (nextProducts: Product[]) => {
    setProducts(nextProducts)
    saveProducts(nextProducts)
    setSyncing(true)
    setSyncError(null)

    const result = await saveCatalogToServer(nextProducts)

    setSyncing(false)
    if (!result.success) {
      setSyncError(result.error ?? 'Failed to save to server')
    }

    return result
  }, [])

  const addProduct = useCallback(
    async (product: Product) => {
      await persist([product, ...products])
    },
    [persist, products]
  )

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      const next = products.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      )
      await persist(next)
    },
    [persist, products]
  )

  const deleteProduct = useCallback(
    async (id: string) => {
      await persist(products.filter((p) => p.id !== id))
    },
    [persist, products]
  )

  const clearAllProducts = useCallback(async () => {
    await persist([])
  }, [persist])

  const importCatalog = useCallback(
    async (json: string) => {
      try {
        const parsed = JSON.parse(json) as Product[]
        if (!Array.isArray(parsed)) {
          return { success: false, count: 0, error: 'Invalid format: expected an array' }
        }
        const result = await persist(parsed)
        if (!result.success) {
          return { success: false, count: 0, error: result.error }
        }
        return { success: true, count: parsed.length }
      } catch {
        return { success: false, count: 0, error: 'Failed to parse JSON' }
      }
    },
    [persist]
  )

  const value = useMemo(
    () => ({
      products,
      loading,
      syncing,
      syncError,
      refresh,
      addProduct,
      updateProduct,
      deleteProduct,
      clearAllProducts,
      importCatalog,
    }),
    [
      products,
      loading,
      syncing,
      syncError,
      refresh,
      addProduct,
      updateProduct,
      deleteProduct,
      clearAllProducts,
      importCatalog,
    ]
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
