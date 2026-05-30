import { SlidersHorizontal } from 'lucide-react'
import type { SortMode } from '../../types/route'

interface SortControlProps {
  value: SortMode
  onChange: (value: SortMode) => void
}

export function SortControl({ value, onChange }: SortControlProps) {
  return (
    <label className="sort-control">
      <SlidersHorizontal size={17} />
      <select value={value} onChange={(event) => onChange(event.target.value as SortMode)}>
        <option value="balanced">Balanced</option>
        <option value="cheapest">Cheapest</option>
        <option value="fastest">Fastest</option>
        <option value="comfortable">Comfort</option>
        <option value="risk">Low risk</option>
      </select>
    </label>
  )
}
