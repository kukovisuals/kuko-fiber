import type { TaxonomyId, TaxonomyItem } from '../../domain/types/taxonomy'
import './taxonomy.css'

interface TaxonomySidebarProps {
  items: readonly TaxonomyItem[]
  onSelect: (id: TaxonomyId) => void
}

export function TaxonomySidebar({ items, onSelect }: TaxonomySidebarProps) {
  return (
    <aside className="sidebar">
      <h2>Taxonomy</h2>
      {items.map((item) => (
        <section
          key={item.id}
          className="sidebar__panel sidebar__panel--clickable"
          role="button"
          tabIndex={0}
          onClick={() => onSelect(item.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelect(item.id)
            }
          }}
        >
          <h2>{item.label}</h2>
        </section>
      ))}
    </aside>
  )
}
