import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProductById } from '../lib/catalogApi'
import { ExternalLink, ArrowLeft } from 'lucide-react'

export function RedirectPage() {
  const { productId } = useParams<{ productId: string }>()
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!productId) {
      setLoading(false)
      return
    }

    fetchProductById(productId)
      .then((product) => {
        setUrl(product?.affiliateUrl ?? null)
      })
      .finally(() => setLoading(false))
  }, [productId])

  useEffect(() => {
    if (url) {
      const timer = setTimeout(() => {
        window.location.replace(url)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [url])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-brand-800/60">Loading...</p>
      </div>
    )
  }

  if (!url) {
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-fade-in">
      <ExternalLink className="mb-4 h-10 w-10 text-accent" />
      <h1 className="font-display text-2xl font-semibold">Redirecting to Merchant</h1>
      <p className="mt-2 max-w-md text-brand-800/60">
        You are being redirected to the merchant site to check the current price and availability.
        Prices may vary from what is shown here.
      </p>
      <a
        href={url}
        rel="noopener noreferrer sponsored"
        className="mt-6 inline-flex items-center gap-2 bg-brand-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-800"
      >
        Continue to Store
        <ExternalLink className="h-4 w-4" />
      </a>
      <Link to="/" className="mt-4 text-sm text-brand-800/50 hover:text-brand-800">
        ← Back to J-World Clothes
      </Link>
    </div>
  )
}
