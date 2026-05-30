import { ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { knownLocations, searchKnownLocations } from '../../constants/knownLocations'
import type { SearchLocation } from '../../types/route'

interface LocationComboboxProps {
  label: string
  value: string
  selected?: SearchLocation
  onInputChange: (value: string) => void
  onSelect: (location: SearchLocation) => void
}

const locationSubtitle = (location: SearchLocation) =>
  location.code
    ? `${location.label.replace(`${location.code} `, '')}`
    : `${location.type.replace('_', ' ')} · ${location.country}`

export function LocationCombobox({ label, value, selected, onInputChange, onSelect }: LocationComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const suggestions = value.trim() ? searchKnownLocations(value) : knownLocations
  const grouped = useMemo(
    () =>
      Object.entries(
        suggestions.reduce<Record<string, SearchLocation[]>>((groups, location) => {
          groups[location.country] = [...(groups[location.country] ?? []), location]
          return groups
        }, {}),
      ),
    [suggestions],
  )

  const choose = (location: SearchLocation) => {
    onSelect(location)
    setIsOpen(false)
    setActiveIndex(0)
  }

  return (
    <label className="combobox-field">
      {label}
      <div className="combobox-control">
        <input
          value={value}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            onInputChange(event.target.value)
            setIsOpen(true)
            setActiveIndex(0)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsOpen(false)
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1))
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActiveIndex((index) => Math.max(index - 1, 0))
            }
            if (event.key === 'Enter' && isOpen && suggestions[activeIndex]) {
              event.preventDefault()
              choose(suggestions[activeIndex])
            }
          }}
        />
        <button type="button" aria-label={`Open ${label} locations`} onClick={() => setIsOpen((open) => !open)}>
          <ChevronDown size={16} />
        </button>
      </div>
      {selected && <span className="selected-location">Selected: {selected.label}</span>}
      {isOpen && suggestions.length > 0 && (
        <div className="location-menu" role="listbox">
          {value.trim()
            ? suggestions.map((location, index) => (
                <button
                  type="button"
                  className={index === activeIndex ? 'active' : ''}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(location)}
                  key={location.id}
                >
                  <strong>{location.city}</strong>
                  <span>{locationSubtitle(location)}</span>
                </button>
              ))
            : grouped.map(([country, locations]) => (
                <div className="location-group" key={country}>
                  <span>{country}</span>
                  {locations.map((location) => (
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => choose(location)}
                      key={location.id}
                    >
                      <strong>{location.city}</strong>
                      <span>{location.code ? `${location.label.split(',')[0]}` : location.type.replace('_', ' ')}</span>
                    </button>
                  ))}
                </div>
              ))}
        </div>
      )}
    </label>
  )
}
