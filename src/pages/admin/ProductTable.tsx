import { useRef, useState } from 'react'
import type { Product } from '../../types/product'
import { useCatalog } from '../../context/CatalogContext'
import { formatProductPrice } from '../../lib/affiliate'
import { CATEGORY_LABELS } from '../../types/product'
import { Pencil, Trash2, ToggleLeft, ToggleRight, X, Check } from 'lucide-react'
import { LazyImage } from '../../components/ui/LazyImage'

interface ProductTableProps {
  onEdit: (product: Product) => void
}

export function ProductTable({ onEdit }: ProductTableProps) {
  const { products, updateProduct, deleteProduct } = useCatalog()
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sorted = [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
  }

  if (products.length === 0) {
    return (
      <p className="py-10 text-center text-brand-800/50">No products yet. Add your first one above!</p>
    )
  }

  return (
    <div className="space-y-2">
      {sorted.map((product) => {
        const isPending = pendingDeleteId === product.id

        return (
          <div
            key={product.id}
            className={`flex flex-wrap items-center gap-3 border border-brand-200 bg-white p-3 transition ${
              isPending ? 'border-red-300 bg-red-50/40' : ''
            }`}
          >
            <div className="flex min-w-0 flex-1 basis-[200px] items-center gap-3">
              <div className="h-14 w-11 shrink-0 overflow-hidden bg-brand-100">
                <LazyImage src={product.imageUrl} alt="" className="h-full w-full" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium leading-snug">{product.title}</p>
                <p className="mt-0.5 text-xs text-brand-800/50">
                  {product.brand} · {CATEGORY_LABELS[product.category]}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <span className="text-sm font-semibold whitespace-nowrap">
                {formatProductPrice(product)}
              </span>
              <span
                className={`text-[11px] font-medium ${
                  product.inStock ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="flex w-full shrink-0 items-center justify-end gap-1 sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  cancelPendingDelete()
                  onEdit(product)
                }}
                className="flex h-8 w-8 items-center justify-center border border-brand-200 transition hover:border-brand-800 hover:text-accent"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => updateProduct(product.id, { inStock: !product.inStock })}
                className="flex h-8 w-8 items-center justify-center border border-brand-200 transition hover:border-brand-800"
                title="Toggle stock"
              >
                {product.inStock ? (
                  <ToggleRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ToggleLeft className="h-4 w-4 text-red-400" />
                )}
              </button>

              {!isPending ? (
                <button
                  type="button"
                  onClick={() => startDelete(product.id)}
                  className="flex h-8 w-8 items-center justify-center border border-brand-200 transition hover:border-red-400 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ) : (
                <div className="flex items-center gap-1 animate-fade-in">
                  <span className="px-1.5 text-[11px] font-medium text-red-700">Delete?</span>
                  <button
                    type="button"
                    onClick={() => confirmDelete(product.id)}
                    className="flex h-8 w-8 items-center justify-center bg-red-600 text-white hover:bg-red-700"
                    title="Yes, delete"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelPendingDelete}
                    className="flex h-8 w-8 items-center justify-center border border-brand-200 bg-white hover:bg-brand-50"
                    title="Cancel"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
