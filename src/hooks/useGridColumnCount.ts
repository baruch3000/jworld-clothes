import { useEffect, useState } from 'react'

export function useGridColumnCount(): number {
  const [columns, setColumns] = useState(4)

  useEffect(() => {
    const update = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) setColumns(4)
      else if (window.matchMedia('(min-width: 768px)').matches) setColumns(3)
      else setColumns(2)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return columns
}
