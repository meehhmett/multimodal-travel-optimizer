import type { CandidateAirport } from '../../services/providers/types'
import { hours } from '../../utils/formatters'

export function CandidateAirportList({ airports }: { airports: CandidateAirport[] }) {
  if (!airports.length) return null

  return (
    <section className="candidate-airports">
      <div>
        <span className="eyebrow">OpenFlights discovery</span>
        <h3>Candidate arrival airports</h3>
      </div>
      <div className="airport-grid">
        {airports.map((airport) => (
          <article className="airport-chip" key={airport.code}>
            <strong>{airport.code}</strong>
            <span>{airport.name}</span>
            <small>
              {airport.country} · {airport.distanceToDestinationKm} km
              {airport.estimatedTransferMinutes ? ` · ${hours(airport.estimatedTransferMinutes)} transfer` : ''}
            </small>
          </article>
        ))}
      </div>
    </section>
  )
}
