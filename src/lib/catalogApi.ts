import type { Product } from '../types/product'
import { ADMIN_PASSCODE } from './storage'

export async function fetchCatalogFromServer(
  signal?: AbortSignal
): Promise<Product[]> {
  const response = await fetch(`/api/catalog.php?t=${Date.now()}`, {
    cache: 'no-store',
    signal,
  })
  if (!response.ok) {
    throw new Error(`Could not load catalog (${response.status})`)
  }
  const data = await response.json()
  if (!Array.isArray(data)) {
    throw new Error('Invalid catalog format')
  }
  return data as Product[]
}

export async function saveCatalogToServer(
  products: Product[]
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const response = await fetch('/api/catalog.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: ADMIN_PASSCODE, products }),
    })

    const data = (await response.json()) as {
      success?: boolean
      count?: number
      error?: string
    }

    if (!response.ok || !data.success) {
      return { success: false, error: data.error ?? 'Server save failed' }
    }

    return { success: true, count: data.count ?? products.length }
  } catch {
    return {
      success: false,
      error: 'Could not reach server. Upload api/catalog.php to Hostinger.',
    }
  }
}

export async function fetchProductById(productId: string): Promise<Product | null> {
  const products = await fetchCatalogFromServer()
  return products.find((p) => p.id === productId) ?? null
}
