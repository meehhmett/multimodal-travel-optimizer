import { SortControl } from '../filters/SortControl'
import { CandidateAirportList } from './CandidateAirportList'
import { RouteCard } from './RouteCard'
import type { CandidateAirport } from '../../services/providers/types'
import type { RouteDataSource, RouteOption, SortMode } from '../../types/route'

interface ResultsPanelProps {
  routes: RouteOption[]
  originCity: string
  destinationCity: string
  sortMode: SortMode
  dataSource: RouteDataSource
  warnings: string[]
  isLoading: boolean
  candidateAirports: CandidateAirport[]
  onSortChange: (value: SortMode) => void
  onOpenDetails: (route: RouteOption) => void
}

export function ResultsPanel({
  routes,
  originCity,
  destinationCity,
  sortMode,
  dataSource,
  warnings,
  isLoading,
  candidateAirports,
  onSortChange,
  onOpenDetails,
}: ResultsPanelProps) {
  return (
    <section className="results-area">
      <nav className="topbar">
        <div>
          <span className="eyebrow">Graph route search</span>
          <h2>{isLoading ? 'Loading providers...' : `${routes.length} ranked route combinations`}</h2>
          <div className="source-row">
            <span className={`source-badge ${dataSource}`}>
              {dataSource === 'demo' ? 'Estimated' : dataSource === 'live' ? 'Live' : 'Mixed sources'}
            </span>
            {warnings.slice(0, 2).map((warning) => (
              <span className="source-warning" key={warning}>{warning}</span>
            ))}
          </div>
        </div>
        <SortControl value={sortMode} onChange={onSortChange} />
      </nav>

      <CandidateAirportList airports={candidateAirports} />

      {routes.length === 0 && !isLoading ? (
        <div className="empty-state">
          <h3>No routes found</h3>
          <p>Try increasing max duration, allowing more transfers, or widening the airport radius.</p>
        </div>
      ) : (
        <div className="route-list">
          {routes.map((route) => (
            <RouteCard
              route={route}
              originCity={originCity}
              destinationCity={destinationCity}
              onOpenDetails={onOpenDetails}
              key={route.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}
