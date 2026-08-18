import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getWishlist, toggleWishlistItem } from '../lib/storage'

interface WishlistContextValue {
  wishlist: string[]
  toggle: (id: string) => void
  isWishlisted: (id: string) => boolean
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>(() => getWishlist())

  const toggle = useCallback((id: string) => {
    setWishlist(toggleWishlistItem(id))
  }, [])

  const isWishlisted = useCallback(
    (id: string) => wishlist.includes(id),
    [wishlist]
  )

  const value = useMemo(
    () => ({ wishlist, toggle, isWishlisted }),
    [wishlist, toggle, isWishlisted]
  )

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
