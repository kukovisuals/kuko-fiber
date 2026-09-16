import { useEffect, useRef } from 'react'
import type { TaxonomyItem } from '../../domain/types/taxonomy'
import './taxonomy.css'

interface TaxonomyFloatProps {
  item: TaxonomyItem
  onDismiss: () => void
}

export function TaxonomyFloat({ item, onDismiss }: TaxonomyFloatProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (ref.current?.contains(event.target as Node)) return
      onDismiss()
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [onDismiss])

  return (
    <aside className="taxonomy-float" ref={ref}>
      <h2>Taxonomy</h2>
      <section
        className="sidebar__panel sidebar__panel--clickable sidebar__panel--active"
        role="button"
        tabIndex={0}
        aria-pressed
        onClick={onDismiss}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onDismiss()
          }
        }}
      >
        <h2>{item.label}</h2>
      </section>
    </aside>
  )
}
