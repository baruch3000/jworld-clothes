import { useMemo } from 'react'
import { useCatalog } from '../context/CatalogContext'
import { useWishlist } from '../context/WishlistContext'
import { ProductGrid } from '../components/products/ProductGrid'
import { Heart } from 'lucide-react'

export function WishlistPage() {
  const { products } = useCatalog()
  const { wishlist } = useWishlist()

  const wishlistedProducts = useMemo(
    () => products.filter((p) => wishlist.includes(p.id)),
    [products, wishlist]
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-6 w-6 text-red-500" />
        <h1 className="font-display text-3xl font-semibold">Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-brand-800/20" />
          <p className="text-brand-800/60">Your wishlist is empty. Save items you love!</p>
        </div>
      ) : (
        <ProductGrid
          products={wishlistedProducts}
          emptyMessage="Some saved items may no longer be available."
        />
      )}
    </div>
  )
}
