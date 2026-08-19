import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProductById } from '../lib/catalogApi'
import { ArrowLeft } from 'lucide-react'

/** Legacy /go/:id links — redirect immediately without an interstitial page. */
export function RedirectPage() {
  const { productId } = useParams<{ productId: string }>()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!productId) {
      setFailed(true)
      return
    }

    fetchProductById(productId)
      .then((product) => {
        if (product?.affiliateUrl) {
          window.location.replace(product.affiliateUrl)
          return
        }
        setFailed(true)
      })
      .catch(() => setFailed(true))
  }, [productId])

  if (failed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-2xl font-semibold">Product Not Found</h1>
        <p className="mt-2 text-brand-800/60">This link may be expired or invalid.</p>
        <Link to="/" className="mt-6 flex items-center gap-2 text-sm font-medium text-accent">
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-brand-800/60">Redirecting to store...</p>
    </div>
  )
}
