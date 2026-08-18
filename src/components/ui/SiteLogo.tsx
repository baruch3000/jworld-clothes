export function SiteLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const box =
    size === 'lg' ? 'h-12 w-12 rounded-lg' : size === 'sm' ? 'h-8 w-8 rounded-md' : 'h-10 w-10 rounded-lg'
  const text = size === 'lg' ? 'text-base' : size === 'sm' ? 'text-[10px]' : 'text-xs'

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center border border-accent bg-brand-900 font-display font-bold text-accent ${box} ${text}`}
      aria-hidden="true"
    >
      JW
    </span>
  )
}
