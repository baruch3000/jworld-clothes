import { useCallback, useRef, useState } from 'react'
import { Clipboard, ImageIcon, Link2 } from 'lucide-react'

interface ImagePasteZoneProps {
  imageUrl: string
  onImageChange: (url: string) => void
}

export function ImagePasteZone({ imageUrl, onImageChange }: ImagePasteZoneProps) {
  const [urlInput, setUrlInput] = useState('')
  const [pasteHint, setPasteHint] = useState(false)
  const [pasteWarning, setPasteWarning] = useState(false)
  const zoneRef = useRef<HTMLDivElement>(null)

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const blob = item.getAsFile()
          if (!blob) return

          const reader = new FileReader()
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              onImageChange(reader.result)
              setPasteHint(false)
              setPasteWarning(true)
            }
          }
          reader.readAsDataURL(blob)
          return
        }
      }
    },
    [onImageChange]
  )

  const handleUrlPreview = () => {
    if (urlInput.trim()) {
      onImageChange(urlInput.trim())
      setUrlInput('')
      setPasteWarning(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onImageChange(reader.result)
          setPasteWarning(true)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider">
        Product Image
      </label>

      <div
        ref={zoneRef}
        tabIndex={0}
        onPaste={handlePaste}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onFocus={() => setPasteHint(true)}
        onBlur={() => setPasteHint(false)}
        className={`relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center border-2 border-dashed transition ${
          pasteHint
            ? 'border-accent bg-accent/5'
            : 'border-brand-200 bg-brand-50 hover:border-brand-800/30'
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-[200px] max-w-full object-contain p-2"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <Clipboard className="h-8 w-8 text-brand-800/30" />
            <p className="text-sm font-medium text-brand-800/70">
              Press <kbd className="rounded border border-brand-200 bg-white px-1.5 py-0.5 text-xs">Ctrl+V</kbd> to paste image
            </p>
            <p className="text-xs text-brand-800/40">or drag &amp; drop an image file</p>
          </div>
        )}

        {imageUrl && (
          <button
            type="button"
            onClick={() => onImageChange('')}
            className="absolute right-2 top-2 bg-white/90 px-2 py-1 text-xs font-medium shadow-sm hover:bg-white"
          >
            Remove
          </button>
        )}
      </div>

      {pasteWarning && imageUrl.startsWith('data:') && (
        <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Pasted images slow down the site for everyone. Before saving, replace with an image URL
          from the product page (right-click image → Copy image address).
        </p>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-800/40" />
          <input
            type="url"
            placeholder="Or paste image URL..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlPreview())}
            className="w-full border border-brand-200 py-2 pl-10 pr-3 text-sm outline-none focus:border-brand-800"
          />
        </div>
        <button
          type="button"
          onClick={handleUrlPreview}
          className="flex items-center gap-1.5 border border-brand-200 px-3 py-2 text-sm font-medium transition hover:border-brand-800"
        >
          <ImageIcon className="h-4 w-4" />
          Load
        </button>
      </div>
    </div>
  )
}
