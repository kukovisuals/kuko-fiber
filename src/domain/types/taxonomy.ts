export type TaxonomyId =
  | 'buffers'
  | 'neighbors'
  | 'advect-velocity'
  | 'add-forces'
  | 'divergence'
  | 'pressure-solve'
  | 'subtract-gradient'
  | 'advect-dye'

export interface TaxonomyItem {
  id: TaxonomyId
  label: string
}
