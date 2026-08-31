import { useState } from 'react'
import {
  isAdminAuthenticated,
  setAdminAuthenticated,
  ADMIN_PASSCODE,
} from '../../lib/storage'
import { useCatalog } from '../../context/CatalogContext'
import { ProductForm } from './ProductForm'
import { ProductTable } from './ProductTable'
import { BrandManager } from './BrandManager'
import { LinkManager } from './LinkManager'
import { LinkQuickForm } from './LinkQuickForm'
import type { Product } from '../../types/product'
import { Download, Upload, LogOut, Shield, Package, Trash2, Link2, LayoutGrid, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode === ADMIN_PASSCODE) {
      setAdminAuthenticated(true)
      onLogin()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-brand-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-6 flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-accent" />
          <h1 className="font-display text-xl font-semibold">Admin Access</h1>
        </div>
        <p className="mb-4 text-center text-sm text-brand-800/60">
          J-World Clothes — enter passcode to manage products, images &amp; links
        </p>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          autoFocus
          className="mb-4 w-full border border-brand-200 px-4 py-3 text-center text-sm outline-none focus:border-brand-800"
        />
        {error && (
          <p className="mb-3 text-center text-sm text-red-500">Invalid passcode</p>
        )}
        <button
          type="submit"
          className="w-full bg-brand-900 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          Enter Dashboard
        </button>
        <Link
          to="/"
          className="mt-4 block text-center text-sm text-brand-800/50 hover:text-brand-800"
        >
          ← Back to Store
        </Link>
      </form>
    </div>
  )
}

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated)
  const { products, importCatalog, clearAllProducts, syncing, syncError, loading } = useCatalog()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [importMessage, setImportMessage] = useState<string | null>(null)
  const [confirmClearAll, setConfirmClearAll] = useState(false)
  const [activeTab, setActiveTab] = useState<'products' | 'quickLinks' | 'links'>('products')
  const [editingLink, setEditingLink] = useState<Product | null>(null)

  const handleEditProduct = (product: Product) => {
    if (product.linkOnly) {
      setActiveTab('quickLinks')
      setEditingLink(product)
      setEditingProduct(null)
    } else {
      setActiveTab('products')
      setEditingProduct(product)
      setEditingLink(null)
    }
  }

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-brand-800/60">Loading catalog...</p>
      </div>
    )
  }

  const handleExport = () => {
    const json = JSON.stringify(products, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jworld-catalog-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const text = await file.text()
      const result = await importCatalog(text)
      if (result.success) {
        setImportMessage(`Imported ${result.count} products successfully`)
      } else {
        setImportMessage(result.error ?? 'Import failed')
      }
      setTimeout(() => setImportMessage(null), 3000)
    }
    input.click()
  }

  const handleClearAll = async () => {
    if (!confirmClearAll) {
      setConfirmClearAll(true)
      setTimeout(() => setConfirmClearAll(false), 8000)
      return
    }
    await clearAllProducts()
    setEditingProduct(null)
    setConfirmClearAll(false)
    setImportMessage('All products deleted')
    setTimeout(() => setImportMessage(null), 3000)
  }

  const handleLogout = () => {
    setAdminAuthenticated(false)
    setAuthenticated(false)
  }

  return (
    <div className="min-h-screen bg-brand-50">
      <header className="border-b border-brand-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-accent" />
            <h1 className="font-display text-xl font-semibold">Admin Dashboard</h1>
            <span className="hidden rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium sm:inline">
              {products.length} products
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden text-sm text-brand-800/60 hover:text-brand-900 sm:inline"
            >
              View Store
            </Link>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={products.length === 0}
              className={`flex items-center gap-1.5 border px-3 py-1.5 text-xs font-medium transition disabled:opacity-40 ${
                confirmClearAll
                  ? 'border-red-600 bg-red-600 text-white hover:bg-red-700'
                  : 'border-red-200 text-red-600 hover:border-red-400'
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {confirmClearAll ? 'Confirm Delete All' : 'Delete All'}
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 border border-brand-200 px-3 py-1.5 text-xs font-medium transition hover:border-brand-800"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button
              type="button"
              onClick={handleImport}
              className="flex items-center gap-1.5 border border-brand-200 px-3 py-1.5 text-xs font-medium transition hover:border-brand-800"
            >
              <Upload className="h-3.5 w-3.5" />
              Import
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-800/60 hover:text-red-500"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {importMessage && (
        <div className="bg-green-50 px-4 py-2 text-center text-sm text-green-700 animate-fade-in">
          {importMessage}
        </div>
      )}

      {syncing && (
        <div className="bg-blue-50 px-4 py-2 text-center text-sm text-blue-700">
          Saving to server...
        </div>
      )}

      {syncError && (
        <div className="bg-red-50 px-4 py-2 text-center text-sm text-red-700">
          {syncError}
        </div>
      )}

      {!syncError && !syncing && (
        <div className="bg-green-50/80 px-4 py-2 text-center text-xs text-green-800">
          Products are saved on the server — visible to all visitors worldwide
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 rounded border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <strong>Safe updates:</strong> Your products live in <code className="text-xs">catalog.json</code> on the server.
          When updating the site design, upload only <strong>index.html</strong> and <strong>assets/</strong> —
          do <strong>not</strong> delete or replace <code className="text-xs">catalog.json</code>,{' '}
          <code className="text-xs">click-stats.json</code>, or <code className="text-xs">api/</code>.
        </div>

        <div className="mb-6 rounded border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-brand-800/70">
          <strong>Rakuten / Linkshare workflow:</strong>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>
              Use the <strong>LinkGenerator bookmarklet</strong> in your browser on a merchant product page
              (installed once from Rakuten Advertising → APIs → Manage Tokens).
            </li>
            <li>Copy the generated HTML or link and paste it below in{' '}
            <strong>Affiliate / Source URL</strong> when adding a product.</li>
            <li>J-World saves the tracking URL in your catalog — no Rakuten token is stored on this site.</li>
          </ol>
          <p className="mt-2 text-xs text-brand-800/55">
            If you click <strong>Update token</strong> in Rakuten, you must drag the bookmarklet to your
            bookmarks bar again. Existing products in the store keep working; only new link generation
            needs the new bookmarklet.
          </p>
        </div>

        <div className="mb-6 rounded border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-brand-800/70">
          <strong>Your links:</strong> Demo products use sample merchant URLs (Zara, Nike, etc.) for preview only.
          To use your own affiliate links — click <strong>Edit</strong> on a product, or add a new one and paste your link in{' '}
          <strong>Affiliate / Source URL</strong>. Paste images with <strong>Ctrl+V</strong> in the image area.
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-brand-200 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
              activeTab === 'products'
                ? 'bg-brand-900 text-white'
                : 'border border-brand-200 text-brand-800/70 hover:border-brand-800'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Products
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('quickLinks')
              setEditingLink(null)
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
              activeTab === 'quickLinks'
                ? 'bg-brand-900 text-white'
                : 'border border-brand-200 text-brand-800/70 hover:border-brand-800'
            }`}
          >
            <Zap className="h-4 w-4" />
            Quick Links
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('links')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
              activeTab === 'links'
                ? 'bg-brand-900 text-white'
                : 'border border-brand-200 text-brand-800/70 hover:border-brand-800'
            }`}
          >
            <Link2 className="h-4 w-4" />
            Links &amp; Clicks
          </button>
        </div>

        {activeTab === 'products' ? (
        <div className="grid gap-8 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <div className="space-y-6 xl:sticky xl:top-24 xl:max-h-[calc(100vh-6.5rem)] xl:overflow-y-auto xl:overscroll-y-contain xl:pr-1">
              <BrandManager />
              <div className="border border-brand-200 bg-white p-6">
                <ProductForm
                  editProduct={editingProduct}
                  onSaved={() => setEditingProduct(null)}
                  onCancel={() => setEditingProduct(null)}
                />
              </div>
            </div>
          </div>

          <div className="min-w-0 xl:col-span-3">
            <div className="border border-brand-200 bg-white p-4 sm:p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">
                Product Catalog ({products.length})
              </h2>
              <ProductTable onEdit={handleEditProduct} />
            </div>
          </div>
        </div>
        ) : activeTab === 'quickLinks' ? (
          <div className="mx-auto max-w-2xl border border-brand-200 bg-white p-6">
            <LinkQuickForm
              editProduct={editingLink}
              onSaved={() => setEditingLink(null)}
              onCancel={() => setEditingLink(null)}
            />
          </div>
        ) : (
          <div className="border border-brand-200 bg-white p-4 sm:p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">Affiliate Links &amp; Click Stats</h2>
            <LinkManager />
          </div>
        )}
      </div>
    </div>
  )
}
