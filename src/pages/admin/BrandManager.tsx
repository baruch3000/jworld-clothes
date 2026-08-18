import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { addCustomBrand, getCustomBrands, removeCustomBrand } from '../../lib/storage'

export function BrandManager() {
  const [brands, setBrands] = useState(() => getCustomBrands())
  const [newBrand, setNewBrand] = useState('')

  const refresh = () => setBrands(getCustomBrands())

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const name = newBrand.trim()
    if (!name) return
    addCustomBrand(name)
    setNewBrand('')
    refresh()
  }

  const handleRemove = (name: string) => {
    removeCustomBrand(name)
    refresh()
  }

  return (
    <div className="border border-brand-200 bg-white p-5">
      <h3 className="font-display text-lg font-semibold">My Brands</h3>
      <p className="mt-1 text-xs text-brand-800/60">
        Add brand names here — they appear as quick picks when adding products
      </p>

      <form onSubmit={handleAdd} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          placeholder="Type a brand name..."
          className="flex-1 border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-800"
        />
        <button
          type="submit"
          disabled={!newBrand.trim()}
          className="flex items-center gap-1.5 bg-brand-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>

      {brands.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {brands.map((brand) => (
            <span
              key={brand}
              className="inline-flex items-center gap-1.5 border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm"
            >
              {brand}
              <button
                type="button"
                onClick={() => handleRemove(brand)}
                className="text-brand-800/40 hover:text-red-500"
                aria-label={`Remove ${brand}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-xs text-brand-800/40">
          No saved brands yet — type a name above or enter one when adding a product
        </p>
      )}
    </div>
  )
}
