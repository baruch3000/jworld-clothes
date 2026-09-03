import { useEffect, useState } from 'react'
import type { Product, Category, Currency, PriceType, CategoryPlacement } from '../../types/product'
import { CATEGORY_LABELS, SIZE_OPTIONS } from '../../types/product'
import { categoryToAudience } from '../../lib/category'
import {
  ASSIGNABLE_CATEGORIES,
  getCategoryPlacements,
  getSubcategoriesFromPlacement,
  normalizePlacements,
} from '../../lib/productCategories'
import { SUBCATEGORIES_BY_CATEGORY } from '../../lib/subcategories'
import { CURRENCY_LABELS } from '../../lib/pricing'
import { buildLinkOnlyTitleFromPlacements } from '../../lib/linkOnlyProduct'
import { generateId, getAllBrands, addCustomBrand } from '../../lib/storage'
import { useCatalog } from '../../context/CatalogContext'
import { parseAffiliateInput } from '../../lib/affiliateLinkParse'
import { isAmazonAffiliateUrl } from '../../lib/amazonAffiliate'
import {
  SIZE_RANGE_BADGES,
} from '../../lib/productSizes'
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
  shortDescription: string
  brand: string
  category: Category
  placements: CategoryPlacement[]
  currency: Currency
  priceType: PriceType
  originalPrice: number
  originalPriceMax?: number
  salePrice?: number
  salePriceMax?: number
  sizes: string[]
  inStock: boolean
  merchantDiscount: boolean
}

const emptyForm = (): LinkQuickFormState => ({
  affiliateUrl: '',
  shortDescription: '',
  brand: '',
  category: 'women',
  placements: [{ category: 'women', subcategories: [] }],
  currency: 'USD',
  priceType: 'single',
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
        shortDescription: editProduct.shortDescription ?? '',
        brand: editProduct.brand,
        category: editProduct.category,
        placements: getCategoryPlacements(editProduct),
        currency: editProduct.currency ?? 'USD',
        priceType: editProduct.priceType ?? 'single',
        originalPrice: editProduct.originalPrice,
        originalPriceMax: editProduct.originalPriceMax,
        salePrice: editProduct.salePrice,
        salePriceMax: editProduct.salePriceMax,
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
      const current = normalizePlacements(prev.placements, prev.category)
      const exists = current.some((p) => p.category === cat)
      const next = exists
        ? current.length === 1
          ? current
          : current.filter((p) => p.category !== cat)
        : current.length >= 2
          ? [current[0], { category: cat, subcategories: [] }]
          : [...current, { category: cat, subcategories: [] }]

      return { ...prev, placements: next, category: next[0].category }
    })
  }

  const togglePlacementSubcategory = (cat: Category, sub: string) => {
    setForm((prev) => ({
      ...prev,
      placements: prev.placements.map((p) => {
        if (p.category !== cat) return p
        const current = getSubcategoriesFromPlacement(p)
        const next = current.includes(sub)
          ? current.filter((item) => item !== sub)
          : [...current, sub]
        return { ...p, subcategories: next, subcategory: undefined }
      }),
    }))
  }

  const clearPlacementSubcategories = (cat: Category) => {
    setForm((prev) => ({
      ...prev,
      placements: prev.placements.map((p) =>
        p.category === cat ? { ...p, subcategories: [], subcategory: undefined } : p
      ),
    }))
  }

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  const selectedPlacements = normalizePlacements(form.placements, form.category)
  const previewTitle = buildLinkOnlyTitleFromPlacements(selectedPlacements)
  const isAmazonUrl = isAmazonAffiliateUrl(form.affiliateUrl)

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

    const isRange = form.priceType === 'range'
    if (!form.originalPrice || form.originalPrice <= 0) return
    if (isRange && (!form.originalPriceMax || form.originalPriceMax < form.originalPrice)) return

    setUrlError(null)

    const now = new Date().toISOString()
    const placements = normalizePlacements(form.placements, form.category)
    const categories = placements.map((p) => p.category)
    const primaryCategory = categories[0]
    const title = buildLinkOnlyTitleFromPlacements(placements)
    const amazonLink = isAmazonAffiliateUrl(url)

    const productData: Product = {
      id: editProduct?.id ?? generateId(),
      title,
      brand: form.brand.trim(),
      category: primaryCategory,
      categories,
      categoryPlacements: placements,
      audience: categoryToAudience(primaryCategory),
      subcategory: getSubcategoriesFromPlacement(placements[0])[0],
      currency: form.currency,
      priceType: form.priceType ?? 'single',
      originalPrice: form.originalPrice,
      originalPriceMax: isRange ? form.originalPriceMax : undefined,
      salePrice: form.salePrice && form.salePrice > 0 ? form.salePrice : undefined,
      salePriceMax: isRange && form.salePriceMax && form.salePriceMax > 0 ? form.salePriceMax : undefined,
      sizes: form.sizes,
      imageUrl: '',
      affiliateUrl: url,
      inStock: form.inStock,
      merchantDiscount: form.merchantDiscount,
      linkOnly: true,
      shortDescription: form.shortDescription.trim() || undefined,
      amazonLink,
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
        {isAmazonUrl && (
          <>
            {' '}
            · This link will appear in the <strong>Amazon Finds</strong> section.
          </>
        )}
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
        {isAmazonUrl && !urlError && (
          <p className="mt-1 text-xs font-medium text-[#C45500]">
            Amazon link detected — add your own short description below (do not copy from Amazon).
          </p>
        )}
        <p className="mt-1 text-xs text-brand-800/50">
          Paste the tracking URL only — we extract the link from HTML but never copy product names.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">
          Short Description{' '}
          <span className="font-normal normal-case text-brand-800/40">
            (optional — your own words, max 120 chars)
          </span>
        </label>
        <input
          type="text"
          maxLength={120}
          value={form.shortDescription}
          onChange={(e) => update('shortDescription', e.target.value)}
          placeholder="e.g. Modest midi dress in neutral tones"
          className="w-full border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-800"
        />
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
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
          Guide Price Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { value: 'single', label: 'Fixed Price' },
              { value: 'range', label: 'Price Range' },
            ] as { value: PriceType; label: string }[]
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                update('priceType', value)
                if (value === 'single') {
                  update('originalPriceMax', undefined)
                  update('salePriceMax', undefined)
                }
              }}
              className={`px-3 py-1.5 text-xs font-medium transition ${
                form.priceType === value
                  ? 'bg-brand-900 text-white'
                  : 'border border-brand-200 bg-white hover:border-brand-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {form.priceType === 'single' ? (
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
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">
              From *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.originalPrice || ''}
              onChange={(e) => update('originalPrice', Number(e.target.value))}
              required
              placeholder="e.g. 10"
              className="w-full border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">
              To *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.originalPriceMax ?? ''}
              onChange={(e) =>
                update('originalPriceMax', e.target.value ? Number(e.target.value) : undefined)
              }
              required
              placeholder="e.g. 30"
              className="w-full border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">
              Sale From — optional
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.salePrice ?? ''}
              onChange={(e) =>
                update('salePrice', e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="Min sale"
              className="w-full border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">
              Sale To — optional
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.salePriceMax ?? ''}
              onChange={(e) =>
                update('salePriceMax', e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="Max sale"
              className="w-full border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-800"
            />
          </div>
        </div>
      )}

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
                selectedPlacements.some((p) => p.category === cat)
                  ? 'bg-brand-900 text-white'
                  : 'border border-brand-200 hover:border-brand-800'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {selectedPlacements.map((placement) => {
        const subcategoryOptions = SUBCATEGORIES_BY_CATEGORY[placement.category] ?? []
        if (subcategoryOptions.length === 0) return null

        return (
          <div key={placement.category}>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
              {CATEGORY_LABELS[placement.category]} — Subcategories{' '}
              <span className="font-normal normal-case text-brand-800/40">(select one or more)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => clearPlacementSubcategories(placement.category)}
                className={`px-3 py-1.5 text-xs font-medium transition ${
                  getSubcategoriesFromPlacement(placement).length === 0
                    ? 'bg-brand-900 text-white'
                    : 'border border-brand-200 hover:border-brand-800'
                }`}
              >
                None
              </button>
              {subcategoryOptions.map((sub) => {
                const selected = getSubcategoriesFromPlacement(placement).includes(sub)
                return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => togglePlacementSubcategory(placement.category, sub)}
                  className={`px-3 py-1.5 text-xs font-medium transition ${
                    selected
                      ? 'bg-brand-900 text-white'
                      : 'border border-brand-200 hover:border-brand-800'
                  }`}
                >
                  {sub}
                </button>
                )
              })}
            </div>
          </div>
        )
      })}

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
          Sizes — optional
        </label>
        <div className="mb-3 flex flex-wrap gap-2">
          {SIZE_RANGE_BADGES.map((badge) => (
            <button
              key={badge}
              type="button"
              onClick={() => toggleSize(badge)}
              className={`px-3 py-2 text-xs font-semibold transition ${
                form.sizes.includes(badge)
                  ? 'bg-accent text-white'
                  : 'border border-accent/40 bg-accent/5 text-brand-900 hover:border-accent'
              }`}
            >
              {badge}
            </button>
          ))}
        </div>
        <p className="mb-2 text-xs text-brand-800/50">
          Use the quick badges when there are too many sizes to list. You can select both Small and Large.
        </p>
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
