import type { TaxonomyItem } from '../types/taxonomy'

export const taxonomy: readonly TaxonomyItem[] = [
  { id: 'buffers', label: 'Buffers' },
  { id: 'neighbors', label: 'Neighbors' },
  { id: 'advect-velocity', label: 'Advect Velocity' },
  { id: 'add-forces', label: 'Add Forces' },
  { id: 'divergence', label: 'Divergence' },
  { id: 'pressure-solve', label: 'Pressure Solve' },
  { id: 'subtract-gradient', label: 'Subtract Gradient' },
  { id: 'advect-dye', label: 'Advect Dye' },
]
