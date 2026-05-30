import { TransportIcon } from '../../components/ui/TransportIcon'
import { hours, money, timeLabel } from '../../utils/formatters'
import type { RouteOption } from '../../types/route'

export function RouteTimeline({ route, compact = false }: { route: RouteOption; compact?: boolean }) {
  return (
    <ol className={compact ? 'timeline compact' : 'timeline'}>
      {route.segments.map((segment) => (
        <li key={segment.id}>
          <div className="dot">
            <TransportIcon type={segment.transportType} />
          </div>
          <div>
            <strong>{segment.provider}</strong>
            <span>
              {timeLabel(segment.departureTime)} - {timeLabel(segment.arrivalTime)} · {hours(segment.durationMinutes)} ·{' '}
              {money(segment.price)}
              {segment.localTransferMinutes ? ` · transfer ${hours(segment.localTransferMinutes)}` : ''}
            </span>
          </div>
        </li>
      ))}
    </ol>
  )
}
