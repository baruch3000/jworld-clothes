import type { Product } from '../types/product'

const STORAGE_KEY = 'stylevault_catalog'
const ADMIN_KEY = 'stylevault_admin_auth'
const WISHLIST_KEY = 'stylevault_wishlist'
const CUSTOM_BRANDS_KEY = 'jworld_custom_brands'
export const ADMIN_PASSCODE = 'jworld2026'

export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Product[]
  } catch {
    return []
  }
}

function productsForLocalCache(products: Product[]): Product[] {
  return products.map((product) =>
    product.imageUrl.startsWith('data:')
      ? { ...product, imageUrl: '' }
      : product
  )
}

export function saveProducts(products: Product[]): void {
  try {
    const payload = JSON.stringify(productsForLocalCache(products))
    if (payload.length > 500_000) return
    localStorage.setItem(STORAGE_KEY, payload)
  } catch {
    // Quota exceeded or private mode — site still works from server data
  }
}

export function addProduct(product: Product): void {
  const products = getProducts()
  products.unshift(product)
  saveProducts(products)
}

export function updateProduct(id: string, updates: Partial<Product>): void {
  const products = getProducts().map((p) =>
    p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
  )
  saveProducts(products)
}

export function deleteProduct(id: string): void {
  saveProducts(getProducts().filter((p) => p.id !== id))
}

export function clearAllProducts(): void {
  saveProducts([])
}

export function exportCatalog(): string {
  return JSON.stringify(getProducts(), null, 2)
}

export function importCatalog(json: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(json) as Product[]
    if (!Array.isArray(parsed)) {
      return { success: false, count: 0, error: 'Invalid format: expected an array' }
    }
    saveProducts(parsed)
    return { success: true, count: parsed.length }
  } catch {
    return { success: false, count: 0, error: 'Failed to parse JSON' }
  }
}

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(ADMIN_KEY) === 'true'
}

export function setAdminAuthenticated(value: boolean): void {
  if (value) {
    localStorage.setItem(ADMIN_KEY, 'true')
  } else {
    localStorage.removeItem(ADMIN_KEY)
  }
}

export function getWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function saveWishlist(ids: string[]): void {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids))
}

export function toggleWishlistItem(id: string): string[] {
  const current = getWishlist()
  const next = current.includes(id)
    ? current.filter((i) => i !== id)
    : [...current, id]
  saveWishlist(next)
  return next
}

export function generateId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function getUniqueBrands(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.brand))].sort()
}

export function getCustomBrands(): string[] {
  try {
    const raw = localStorage.getItem(CUSTOM_BRANDS_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function saveCustomBrands(brands: string[]): void {
  localStorage.setItem(CUSTOM_BRANDS_KEY, JSON.stringify(brands))
}

export function addCustomBrand(name: string): void {
  const trimmed = name.trim()
  if (!trimmed) return
  const brands = getCustomBrands()
  if (brands.some((b) => b.toLowerCase() === trimmed.toLowerCase())) return
  saveCustomBrands([...brands, trimmed].sort((a, b) => a.localeCompare(b)))
}

export function removeCustomBrand(name: string): void {
  saveCustomBrands(getCustomBrands().filter((b) => b !== name))
}

export function getAllBrands(products: Product[]): string[] {
  const merged = [...getCustomBrands(), ...getUniqueBrands(products)]
  return [...new Set(merged)].sort((a, b) => a.localeCompare(b))
}
