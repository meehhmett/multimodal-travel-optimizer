import { Clock, Euro, Gauge, ShieldAlert } from 'lucide-react'
import { TransportIcon } from '../../components/ui/TransportIcon'
import { dateLabel, hours, money } from '../../utils/formatters'
import { RouteTimeline } from './RouteTimeline'
import type { RouteOption } from '../../types/route'

interface RouteCardProps {
  route: RouteOption
  originCity: string
  destinationCity: string
  onOpenDetails: (route: RouteOption) => void
}

export function RouteCard({ route, originCity, destinationCity, onOpenDetails }: RouteCardProps) {
  return (
    <article className="route-card">
      <div className="card-main">
        <div>
          <div className="labels">
            <span className={`source-badge ${route.dataSource}`}>
              {route.dataSource === 'demo' ? 'Estimated' : route.dataSource === 'live' ? 'Live' : 'Mixed sources'}
            </span>
            {route.labels.map((label) => (
              <span key={label}>{label}</span>
            ))}
            <span>
              {dateLabel(route.dateWindow.departureDate)} - {dateLabel(route.dateWindow.returnDate)}
            </span>
          </div>
          <h3>
            {originCity} to {destinationCity}
          </h3>
          <div className="icon-line">
            {route.segments.map((segment) => (
              <TransportIcon type={segment.transportType} key={segment.id} />
            ))}
          </div>
        </div>
        <div className="price">{money(route.totalPrice)}</div>
      </div>

      <div className="metrics">
        <span>
          <Clock size={16} />
          {hours(route.totalDurationMinutes)}
        </span>
        <span>
          <Gauge size={16} />
          {route.transferCount} transfers
        </span>
        <span>
          <ShieldAlert size={16} />
          risk {route.riskScore}
        </span>
        <span>
          <Euro size={16} />
          comfort {route.comfortScore}
        </span>
      </div>

      <RouteTimeline route={route} compact />

      {route.warnings.length > 0 && <p className="warning">{[...new Set(route.warnings)].join(' + ')}</p>}

      <button type="button" className="detail-button" onClick={() => onOpenDetails(route)}>
        View details
      </button>
    </article>
  )
}
