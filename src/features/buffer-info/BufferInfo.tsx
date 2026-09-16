import { GridOfCellsSection } from './GridOfCellsSection'
import { TextureMacroSection } from './TextureMacroSection'
import { ChannelsSection } from './ChannelsSection'
import './buffer-info.css'

export function BufferInfo() {
  return (
    <div className="buffer-info">
      <GridOfCellsSection />
      <TextureMacroSection />
      <ChannelsSection />
    </div>
  )
}
