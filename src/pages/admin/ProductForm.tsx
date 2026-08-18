import { useState, useEffect } from 'react'
import type { Product, Category, Currency, PriceType } from '../../types/product'
import { CATEGORY_LABELS, SIZE_OPTIONS } from '../../types/product'
import { categoryToAudience } from '../../lib/category'
import { CURRENCY_LABELS } from '../../lib/pricing'
import { ImagePasteZone } from './ImagePasteZone'
import { generateId, getAllBrands, addCustomBrand } from '../../lib/storage'
import { useCatalog } from '../../context/CatalogContext'
import { Zap } from 'lucide-react'

const CATEGORIES = Object.keys(CATEGORY_LABELS).filter(
  (c) => c !== 'brands' && c !== 'sale'
) as Category[]

const ALL_SIZE_PILLS = [
  ...SIZE_OPTIONS.clothing,
  ...SIZE_OPTIONS.shoes,
  ...SIZE_OPTIONS.kids,
  ...SIZE_OPTIONS.baby,
]

interface ProductFormProps {
  editProduct?: Product | null
  onSaved: () => void
  onCancel?: () => void
}

const CURRENCIES: Currency[] = ['USD', 'EUR', 'ILS']

const emptyForm = (): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> => ({
  title: '',
  brand: '',
  category: 'women',
  audience: 'women',
  currency: 'USD',
  priceType: 'single',
  originalPrice: 0,
  originalPriceMax: undefined,
  salePrice: undefined,
  salePriceMax: undefined,
  sizes: [],
  imageUrl: '',
  affiliateUrl: '',
  inStock: true,
  merchantDiscount: true,
})

export function ProductForm({ editProduct, onSaved, onCancel }: ProductFormProps) {
  const { products, addProduct, updateProduct } = useCatalog()
  const savedBrands = getAllBrands(products)

  const [form, setForm] = useState(emptyForm())
  const [savedFlash, setSavedFlash] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  useEffect(() => {
    if (editProduct) {
      setForm({
        title: editProduct.title,
        brand: editProduct.brand,
        category: editProduct.category,
        audience: editProduct.audience,
        currency: editProduct.currency ?? 'USD',
        priceType: editProduct.priceType ?? 'single',
        originalPrice: editProduct.originalPrice,
        originalPriceMax: editProduct.originalPriceMax,
        salePrice: editProduct.salePrice,
        salePriceMax: editProduct.salePriceMax,
        sizes: editProduct.sizes,
        imageUrl: editProduct.imageUrl,
        affiliateUrl: editProduct.affiliateUrl,
        inStock: editProduct.inStock,
        merchantDiscount: editProduct.merchantDiscount !== false,
        subcategory: editProduct.subcategory,
      })
    } else {
      setForm(emptyForm())
    }
  }, [editProduct])

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  const handleBrandInput = (value: string) => {
    update('brand', value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.brand || !form.affiliateUrl || !form.imageUrl) return
    if (!form.originalPrice || form.originalPrice <= 0) return

    if (form.imageUrl.startsWith('data:') && form.imageUrl.length > 50_000) {
      setImageError(
        'Image is too large for the server. Use an image URL from the product page instead of pasting.'
      )
      return
    }
    setImageError(null)

    const isRange = form.priceType === 'range'
    if (isRange && (!form.originalPriceMax || form.originalPriceMax < form.originalPrice)) return

    const now = new Date().toISOString()
    const productData: Product = {
      ...form,
      currency: form.currency ?? 'USD',
      priceType: form.priceType ?? 'single',
      audience: categoryToAudience(form.category),
      originalPriceMax: isRange ? form.originalPriceMax : undefined,
      salePrice: form.salePrice && form.salePrice > 0 ? form.salePrice : undefined,
      salePriceMax:
        isRange && form.salePriceMax && form.salePriceMax > 0 ? form.salePriceMax : undefined,
      id: editProduct?.id ?? generateId(),
      createdAt: editProduct?.createdAt ?? now,
      updatedAt: now,
    }

    if (editProduct) {
      await updateProduct(editProduct.id, productData)
    } else {
      await addProduct(productData)
    }

    addCustomBrand(form.brand)

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
          <Zap className="h-5 w-5 text-accent" />
          {editProduct ? 'Edit Product' : 'Quick Add Product'}
        </h2>
        {savedFlash && (
          <span className="animate-fade-in text-sm font-medium text-green-600">Saved!</span>
        )}
      </div>

      <ImagePasteZone
        imageUrl={form.imageUrl}
        onImageChange={(url) => {
          update('imageUrl', url)
          setImageError(null)
        }}
      />
      {imageError && (
        <p className="text-sm text-red-600">{imageError}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">
            Product Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            required
            autoFocus={!editProduct}
            placeholder="e.g. Slim Fit Linen Blazer"
            className="w-full border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-800"
          />
        </div>

        <div className="relative sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">
            Brand *
          </label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => handleBrandInput(e.target.value)}
            required
            placeholder="Type any brand name..."
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
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">
            Affiliate / Source URL *
          </label>
          <input
            type="url"
            value={form.affiliateUrl}
            onChange={(e) => update('affiliateUrl', e.target.value)}
            required
            placeholder="Your affiliate link (Amazon, AliExpress, etc.)"
            className="w-full border border-brand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-800"
          />
        </div>

        <div className="sm:col-span-2 space-y-4 rounded border border-brand-200 bg-brand-50/50 p-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
              Currency
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CURRENCIES.map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => update('currency', cur)}
                  className={`px-3 py-1.5 text-xs font-medium transition ${
                    (form.currency ?? 'USD') === cur
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
              Price Type
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
                    (form.priceType ?? 'single') === value
                      ? 'bg-brand-900 text-white'
                      : 'border border-brand-200 bg-white hover:border-brand-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {(form.priceType ?? 'single') === 'single' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">
                  Price *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.originalPrice || ''}
                  onChange={(e) => update('originalPrice', Number(e.target.value))}
                  required
                  className="w-full border border-brand-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-800"
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
                  className="w-full border border-brand-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-800"
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
                  placeholder="Min price"
                  className="w-full border border-brand-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-800"
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
                  placeholder="Max price"
                  className="w-full border border-brand-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-800"
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
                  className="w-full border border-brand-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-800"
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
                  className="w-full border border-brand-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-800"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
          Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => update('category', cat)}
              className={`px-3 py-1.5 text-xs font-medium transition ${
                form.category === cat
                  ? 'bg-brand-900 text-white'
                  : 'border border-brand-200 hover:border-brand-800'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
          Sizes Available
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

      <div className="space-y-3">
        <label className="flex cursor-pointer items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={form.merchantDiscount !== false}
            onClick={() => update('merchantDiscount', form.merchantDiscount === false)}
            className={`relative h-6 w-11 rounded-full transition ${
              form.merchantDiscount !== false ? 'bg-accent' : 'bg-brand-200'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                form.merchantDiscount !== false ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </button>
          <span className="text-sm font-medium">
            Show &quot;significant discount on merchant site&quot; notice
          </span>
        </label>
        <p className="text-xs text-brand-800/50">
          No fixed amount — tells visitors extra savings may apply at checkout (amount varies).
        </p>

        <label className="flex cursor-pointer items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={form.inStock}
            onClick={() => update('inStock', !form.inStock)}
            className={`relative h-6 w-11 rounded-full transition ${
              form.inStock ? 'bg-green-500' : 'bg-brand-200'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                form.inStock ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </button>
          <span className="text-sm font-medium">
            {form.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-brand-900 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          {editProduct ? 'Update Product' : 'Add Product'}
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
