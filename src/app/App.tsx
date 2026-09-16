import { useCallback, useState } from 'react'
import { taxonomy } from '../domain/manifest/taxonomy'
import type { TaxonomyId } from '../domain/types/taxonomy'
import { ShaderPlane, GridPlane } from '../features/shader-player'
import { TaxonomySidebar, TaxonomyFloat } from '../features/taxonomy'
import { BufferInfo } from '../features/buffer-info'
import { CanvasHost } from './canvas-host/CanvasHost'
import './App.css'

function App() {
  const [activeId, setActiveId] = useState<TaxonomyId | null>(null)
  const dismiss = useCallback(() => setActiveId(null), [])

  const activeItem = taxonomy.find((item) => item.id === activeId) ?? null
  const showBufferInfo = activeId === 'buffers'

  return (
    <div className="flow-fields">
      <header className="flow-fields__header">
        <h1>Flow fields</h1>
      </header>

      <main className="flow-fields__main">
        <div className="content-column">
          <CanvasHost>
            <ShaderPlane />
            {showBufferInfo && <GridPlane />}
          </CanvasHost>
        </div>

        {showBufferInfo && <BufferInfo />}

        {activeItem ? (
          <TaxonomyFloat item={activeItem} onDismiss={dismiss} />
        ) : (
          <TaxonomySidebar items={taxonomy} onSelect={setActiveId} />
        )}
      </main>
    </div>
  )
}

export default App
