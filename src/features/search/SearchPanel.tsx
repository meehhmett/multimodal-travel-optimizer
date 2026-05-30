import { transportTypes } from '../../constants/transport'
import { LocationCombobox } from '../../components/ui/LocationCombobox'
import { TransportIcon } from '../../components/ui/TransportIcon'
import { todayIso } from '../../utils/searchValidation'
import type { SearchCriteria, SearchLocation, TransportType } from '../../types/route'

interface SearchPanelProps {
  criteria: SearchCriteria
  validationWarnings: string[]
  isValid: boolean
  isLoading: boolean
  onChange: <K extends keyof SearchCriteria>(key: K, value: SearchCriteria[K]) => void
  onSearch: () => void
  onClear: () => void
}

export function SearchPanel({
  criteria,
  validationWarnings,
  isValid,
  isLoading,
  onChange,
  onSearch,
  onClear,
}: SearchPanelProps) {
  const toggleTransport = (type: TransportType) => {
    const next = criteria.allowedTransportTypes.includes(type)
      ? criteria.allowedTransportTypes.filter((item) => item !== type)
      : [...criteria.allowedTransportTypes, type]
    onChange('allowedTransportTypes', next.length ? next : [type])
  }
  const sameCityDifferentLocation =
    criteria.selectedOrigin &&
    criteria.selectedDestination &&
    criteria.selectedOrigin.city === criteria.selectedDestination.city &&
    criteria.selectedOrigin.id !== criteria.selectedDestination.id

  const selectLocation = (field: 'origin' | 'destination', location: SearchLocation) => {
    if (field === 'origin') {
      onChange('originCity', location.label)
      onChange('selectedOrigin', location)
      return
    }
    onChange('destinationCity', location.label)
    onChange('selectedDestination', location)
  }

  return (
    <section className="panel search-panel">
      <h1>Plan across every mode</h1>
      <div className="form-grid">
        <div>
          <LocationCombobox
            label="Origin"
            value={criteria.originCity}
            selected={criteria.selectedOrigin}
            onInputChange={(value) => {
              onChange('originCity', value)
              onChange('selectedOrigin', undefined)
            }}
            onSelect={(location) => selectLocation('origin', location)}
          />
        </div>
        <div>
          <LocationCombobox
            label="Destination"
            value={criteria.destinationCity}
            selected={criteria.selectedDestination}
            onInputChange={(value) => {
              onChange('destinationCity', value)
              onChange('selectedDestination', undefined)
            }}
            onSelect={(location) => selectLocation('destination', location)}
          />
        </div>
        <label>
          Departure
          <input
            type="date"
            min={todayIso()}
            value={criteria.departureDate}
            onChange={(event) => onChange('departureDate', event.target.value)}
          />
        </label>
        <label>
          Return
          <input
            type="date"
            min={criteria.departureDate > todayIso() ? criteria.departureDate : todayIso()}
            value={criteria.returnDate}
            onChange={(event) => onChange('returnDate', event.target.value)}
          />
        </label>
      </div>

      {validationWarnings.length > 0 && (
        <div className="validation-box">
          {validationWarnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      )}
      {sameCityDifferentLocation && (
        <div className="validation-box info">
          <p>Origin and destination are in the same city. Check that this is intentional.</p>
        </div>
      )}

      <label className="toggle-row">
        <input
          type="checkbox"
          checked={criteria.flexibleDates}
          onChange={(event) => onChange('flexibleDates', event.target.checked)}
        />
        <span>Flexible nearby dates</span>
      </label>

      <div className="control-block">
        <span className="control-label">Priority</span>
        <div className="segmented">
          {(['cheapest', 'fastest', 'balanced', 'comfortable'] as const).map((item) => (
            <button
              type="button"
              className={criteria.priority === item ? 'active' : ''}
              onClick={() => onChange('priority', item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="control-block">
        <span className="control-label">Allowed transport</span>
        <div className="mode-grid">
          {transportTypes.map((type) => (
            <button
              type="button"
              className={criteria.allowedTransportTypes.includes(type) ? 'mode active' : 'mode'}
              onClick={() => toggleTransport(type)}
              title={type}
              key={type}
            >
              <TransportIcon type={type} />
              <span>{type}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="range-grid">
        <label>
          <span>Passengers: {criteria.passengerCount}</span>
          <input
            type="number"
            min="1"
            value={criteria.passengerCount}
            onChange={(event) => onChange('passengerCount', Number(event.target.value))}
          />
        </label>
        <label>
          <span>Max transfers: {criteria.maxTransfers}</span>
          <input
            type="range"
            min="0"
            max="5"
            value={criteria.maxTransfers}
            onChange={(event) => onChange('maxTransfers', Number(event.target.value))}
          />
        </label>
        <label>
          <span>Max travel time: {criteria.maxTravelHours}h</span>
          <input
            type="range"
            min="4"
            max="56"
            value={criteria.maxTravelHours}
            onChange={(event) => onChange('maxTravelHours', Number(event.target.value))}
          />
        </label>
        <label>
          <span>Airport radius: {criteria.airportRadiusKm} km</span>
          <input
            type="range"
            min="50"
            max="300"
            step="10"
            value={criteria.airportRadiusKm}
            onChange={(event) => onChange('airportRadiusKm', Number(event.target.value))}
          />
        </label>
      </div>

      <button type="button" className="search-button" disabled={!isValid || isLoading} onClick={onSearch}>
        {isLoading ? 'Searching...' : 'Search routes'}
      </button>
      <button type="button" className="clear-button" onClick={onClear}>
        Clear filters
      </button>
    </section>
  )
}
