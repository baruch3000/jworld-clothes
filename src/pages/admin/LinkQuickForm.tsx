import { useEffect, useState } from 'react'
import type { Product, Category, Currency } from '../../types/product'
import { CATEGORY_LABELS, SIZE_OPTIONS } from '../../types/product'
import { categoryToAudience } from '../../lib/category'
import {
  ASSIGNABLE_CATEGORIES,
  getProductCategories,
  normalizeProductCategories,
} from '../../lib/productCategories'
import {
  getSubcategoriesForCategories,
  isSubcategoryValidForCategories,
} from '../../lib/subcategories'
import { CURRENCY_LABELS } from '../../lib/pricing'
import { buildLinkOnlyTitle } from '../../lib/linkOnlyProduct'
import { generateId, getAllBrands, addCustomBrand } from '../../lib/storage'
import { useCatalog } from '../../context/CatalogContext'
import { parseAffiliateInput } from '../../lib/affiliateLinkParse'
import { Link2 } from 'lucide-react'

const CATEGORIES = ASSIGNABLE_CATEGORIES

const ALL_SIZE_PILLS = [
  ...SIZE_OPTIONS.clothing,
  ...SIZE_OPTIONS.shoes,
  ...SIZE_OPTIONS.kids,
  ...SIZE_OPTIONS.teen,
  ...SIZE_OPTIONS.baby,
]

const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'ILS']

interface LinkQuickFormState {
  affiliateUrl: string
  brand: string
  category: Category
  categories: Category[]
  subcategory?: string
  currency: Currency
  originalPrice: number
  salePrice?: number
  sizes: string[]
  inStock: boolean
  merchantDiscount: boolean
}

const emptyForm = (): LinkQuickFormState => ({
  affiliateUrl: '',
  brand: '',
  category: 'women',
  categories: ['women'],
  currency: 'USD',
  originalPrice: 0,
  sizes: [],
  inStock: true,
  merchantDiscount: true,
})

interface LinkQuickFormProps {
  editProduct?: Product | null
  onSaved: () => void
  onCancel?: () => void
}

export function LinkQuickForm({ editProduct, onSaved, onCancel }: LinkQuickFormProps) {
  const { products, addProduct, updateProduct } = useCatalog()
  const savedBrands = getAllBrands(products)
  const [form, setForm] = useState(emptyForm())
  const [savedFlash, setSavedFlash] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)

  const update = <K extends keyof LinkQuickFormState>(key: K, value: LinkQuickFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (editProduct?.linkOnly) {
      setForm({
        affiliateUrl: editProduct.affiliateUrl,
        brand: editProduct.brand,
        category: editProduct.category,
        categories: getProductCategories(editProduct),
        subcategory: editProduct.subcategory,
        currency: editProduct.currency ?? 'USD',
        originalPrice: editProduct.originalPrice,
        salePrice: editProduct.salePrice,
        sizes: editProduct.sizes,
        inStock: editProduct.inStock,
        merchantDiscount: editProduct.merchantDiscount !== false,
      })
    } else if (!editProduct) {
      setForm(emptyForm())
    }
  }, [editProduct])

  const extractUrlOnly = (raw: string): string | null => {
    const parsed = parseAffiliateInput(raw)
    return parsed?.url ?? null
  }

  const handleAffiliatePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text')
    const url = extractUrlOnly(pasted)
    if (!url) return
    e.preventDefault()
    update('affiliateUrl', url)
    setUrlError(null)
  }

  const handleAffiliateBlur = (raw: string) => {
    const url = extractUrlOnly(raw)
    if (url) {
      update('affiliateUrl', url)
      setUrlError(null)
    }
  }

  const toggleCategory = (cat: Category) => {
    setForm((prev) => {
      const current = normalizeProductCategories(
        prev.categories?.length ? prev.categories : [prev.category],
        prev.category
      )
      const next = current.includes(cat)
        ? current.length === 1
          ? current
          : current.filter((c) => c !== cat)
        : current.length >= 2
          ? [current[0], cat]
          : [...current, cat]
      const subcategory = isSubcategoryValidForCategories(prev.subcategory, next)
        ? prev.subcategory
        : undefined
      return { ...prev, categories: next, category: next[0], subcategory }
    })
  }

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  const selectedCategories = normalizeProductCategories(
    form.categories?.length ? form.categories : [form.category],
    form.category
  )
  const subcategoryOptions = getSubcategoriesForCategories(selectedCategories)
  const previewTitle = buildLinkOnlyTitle(selectedCategories, form.subcategory)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = extractUrlOnly(form.affiliateUrl) ?? form.affiliateUrl.trim()
    if (!url) {
      setUrlError('Enter a valid affiliate URL.')
      return
    }

    try {
      new URL(url)
    } catch {
      setUrlError('Enter a valid affiliate URL.')
      return
    }

    if (!form.originalPrice || form.originalPrice <= 0) return

    setUrlError(null)

    const now = new Date().toISOString()
    const categories = normalizeProductCategories(
      form.categories?.length ? form.categories : [form.category],
      form.category
    )
    const primaryCategory = categories[0]
    const title = buildLinkOnlyTitle(categories, form.subcategory)

    const productData: Product = {
      id: editProduct?.id ?? generateId(),
      title,
      brand: form.brand.trim(),
      category: primaryCategory,
      categories,
      audience: categoryToAudience(primaryCategory),
      subcategory: form.subcategory,
      currency: form.currency,
      priceType: 'single',
      originalPrice: form.originalPrice,
      salePrice: form.salePrice && form.salePrice > 0 ? form.salePrice : undefined,
      sizes: form.sizes,
      imageUrl: '',
      affiliateUrl: url,
      inStock: form.inStock,
      merchantDiscount: form.merchantDiscount,
      linkOnly: true,
      createdAt: editProduct?.createdAt ?? now,
      updatedAt: now,
    }

    if (editProduct) {
      await updateProduct(editProduct.id, productData)
    } else {
      await addProduct(productData)
    }

    if (form.brand.trim()) {
      addCustomBrand(form.brand.trim())
    }

    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2000)

    if (!editProduct) {
      setForm(emptyForm())
    }
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          <Link2 className="h-5 w-5 text-accent" />
          {editProduct ? 'Edit Quick Link' : 'Quick Add Link'}
        </h2>
        {savedFlash && (
          <span className="animate-fade-in text-sm font-medium text-green-600">Saved!</span>
        )}
      </div>

      <p className="rounded border border-accent/30 bg-accent/5 px-3 py-2 text-xs leading-relaxed text-brand-800/70">
        No merchant images or product names — only your affiliate link, price, and category.
        The store shows a graphic card with an auto-generated label:{' '}
        <strong>{previewTitle}</strong>
      </p>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">
          Affiliate URL *
        </label>
        <input
          type="url"
          value={form.affiliateUrl}
          onChange={(e) => {
            update('affiliateUrl', e.target.value)
            setUrlError(null)
          }}
          onPaste={handleAffiliatePaste}
          onBlur={(e) => handleAffiliateBlur(e.target.value)}
          required
          placeholder="https://..."
          className="w-full border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-800"
        />
        {urlError && <p className="mt-1 text-xs text-red-600">{urlError}</p>}
        <p className="mt-1 text-xs text-brand-800/50">
          Paste the tracking URL only — we extract the link from HTML but never copy product names.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">
            Guide Price *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.originalPrice || ''}
            onChange={(e) => update('originalPrice', Number(e.target.value))}
            required
            className="w-full border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-800"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">
            Sale Price — optional
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.salePrice ?? ''}
            onChange={(e) =>
              update('salePrice', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-800"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">Currency</label>
        <div className="flex flex-wrap gap-1.5">
          {CURRENCIES.map((cur) => (
            <button
              key={cur}
              type="button"
              onClick={() => update('currency', cur)}
              className={`px-3 py-1.5 text-xs font-medium transition ${
                form.currency === cur
                  ? 'bg-brand-900 text-white'
                  : 'border border-brand-200 bg-white hover:border-brand-800'
              }`}
            >
              {CURRENCY_LABELS[cur]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">
          Brand <span className="font-normal normal-case text-brand-800/40">(optional, your label)</span>
        </label>
        <input
          type="text"
          value={form.brand}
          onChange={(e) => update('brand', e.target.value)}
          placeholder="Optional neutral label"
          className="w-full border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-800"
        />
        {savedBrands.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {savedBrands.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => update('brand', b)}
                className={`px-2.5 py-1 text-xs font-medium transition ${
                  form.brand === b
                    ? 'bg-brand-900 text-white'
                    : 'border border-brand-200 text-brand-800/70 hover:border-brand-800'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
          Categories * <span className="font-normal normal-case text-brand-800/40">(up to 2)</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium transition ${
                selectedCategories.includes(cat)
                  ? 'bg-brand-900 text-white'
                  : 'border border-brand-200 hover:border-brand-800'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {subcategoryOptions.length > 0 && (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
            Subcategory <span className="font-normal normal-case text-brand-800/40">(recommended)</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => update('subcategory', undefined)}
              className={`px-3 py-1.5 text-xs font-medium transition ${
                !form.subcategory
                  ? 'bg-brand-900 text-white'
                  : 'border border-brand-200 hover:border-brand-800'
              }`}
            >
              None
            </button>
            {subcategoryOptions.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => update('subcategory', sub)}
                className={`px-3 py-1.5 text-xs font-medium transition ${
                  form.subcategory === sub
                    ? 'bg-brand-900 text-white'
                    : 'border border-brand-200 hover:border-brand-800'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
          Sizes — optional
        </label>
        <div className="flex flex-wrap gap-1">
          {ALL_SIZE_PILLS.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`min-w-[2.25rem] px-2 py-1.5 text-xs font-medium transition ${
                form.sizes.includes(size)
                  ? 'bg-brand-900 text-white'
                  : 'border border-brand-200 hover:border-brand-800'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.merchantDiscount}
            onChange={(e) => update('merchantDiscount', e.target.checked)}
            className="h-4 w-4 accent-brand-900"
          />
          Store discount notice
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => update('inStock', e.target.checked)}
            className="h-4 w-4 accent-brand-900"
          />
          In stock
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-brand-900 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          {editProduct ? 'Update Link' : 'Add Link'}
        </button>
        {editProduct && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-brand-200 px-6 py-3 text-sm font-medium transition hover:border-brand-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
