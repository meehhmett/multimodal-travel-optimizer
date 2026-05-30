import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Cloud, CloudFog, CloudRain, CloudSnow, CloudSun, Moon, Sun, Wind, X, Zap } from 'lucide-react'
import { TransportIcon } from '../../components/ui/TransportIcon'
import { openMeteoProvider } from '../../services/providers/weather/openMeteoProvider'
import { getDayNightStatus } from '../../services/providers/weather/weatherUtils'
import { dateLabel, hours, money, timeLabel } from '../../utils/formatters'
import type { RouteEdge, RouteOption, RouteStop, StopWeather, WeatherCondition } from '../../types/route'

const weatherIcons: Record<WeatherCondition, typeof Sun> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  stormy: Zap,
  foggy: CloudFog,
  unknown: CloudSun,
}

const stopKey = (stop: RouteStop) => `${stop.nodeId}-${stop.localTime}`

const segmentStops = (segment: RouteEdge): [RouteStop, RouteStop] => [
  {
    nodeId: segment.from,
    name: segment.fromName ?? segment.from,
    city: segment.fromCity,
    latitude: segment.fromLatitude,
    longitude: segment.fromLongitude,
    localTime: segment.departureTime,
    dayNightStatus: getDayNightStatus(segment.departureTime),
  },
  {
    nodeId: segment.to,
    name: segment.toName ?? segment.to,
    city: segment.toCity,
    latitude: segment.toLatitude,
    longitude: segment.toLongitude,
    localTime: segment.arrivalTime,
    dayNightStatus: getDayNightStatus(segment.arrivalTime),
  },
]

const weatherText = (weather?: StopWeather) => {
  if (!weather) return 'Weather loading'
  if (weather.source === 'unavailable') return 'Forecast unavailable'
  const temperature = weather.temperatureC === undefined ? '' : `${weather.temperatureC}C `
  return `${temperature}${weather.condition}`
}

export function RouteDetailsModal({ route, onClose }: { route: RouteOption; onClose: () => void }) {
  const stops = useMemo(() => route.segments.flatMap(segmentStops), [route])
  const [weatherByStop, setWeatherByStop] = useState<Record<string, StopWeather>>({})

  useEffect(() => {
    let isCurrent = true
    setWeatherByStop({})
    Promise.all(
      stops.map(async (stop) => {
        if (stop.latitude === undefined || stop.longitude === undefined) {
          return [stopKey(stop), { condition: 'unknown', source: 'unavailable' as const }] as const
        }
        const weather = await openMeteoProvider.getWeatherForLocation({
          latitude: stop.latitude,
          longitude: stop.longitude,
          dateTime: stop.localTime,
        })
        return [stopKey(stop), weather] as const
      }),
    ).then((entries) => {
      if (!isCurrent) return
      setWeatherByStop(Object.fromEntries(entries))
    })
    return () => {
      isCurrent = false
    }
  }, [stops])

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close route details">
          <X size={20} />
        </button>
        <div className="modal-header">
          <CalendarDays size={20} />
          <div>
            <h2>Route detail</h2>
            <p>
              {dateLabel(route.dateWindow.departureDate)} to {dateLabel(route.dateWindow.returnDate)}
            </p>
          </div>
        </div>
        <div className="detail-stats">
          <span>{money(route.totalPrice)} total</span>
          <span>{hours(route.totalDurationMinutes)} door to door</span>
          <span>{hours(route.waitingMinutes)} waiting</span>
          <span>{hours(route.localTransferMinutes)} local transfer</span>
          <span>{route.overallScore}/100 score</span>
        </div>
        <div className="source-breakdown">
          <span>Airport data: Live via {route.airportDataProvider ?? 'OpenFlights'}</span>
          <span>Weather: Live via Open-Meteo / Forecast unavailable</span>
          <span>Flight pricing: {route.flightPricingSource === 'live' ? 'Live' : 'Estimated'}</span>
          <span>Ground pricing: {route.groundPricingSource === 'live' ? 'Live' : 'Estimated'}</span>
          <span>Transfer times: {route.groundPricingSource === 'live' ? 'Live' : 'Estimated'}</span>
        </div>
        <div className="rich-timeline">
          {route.segments.map((segment) => {
            const [from, to] = segmentStops(segment)
            return (
              <article className="rich-segment" key={segment.id}>
                <div className="segment-icon">
                  <TransportIcon type={segment.transportType} />
                </div>
                <StopRow stop={from} weather={weatherByStop[stopKey(from)]} />
                <div className="segment-line">
                  <span />
                  <strong>{hours(segment.durationMinutes)}</strong>
                  <small>{segment.provider} · {money(segment.price)}</small>
                </div>
                <StopRow stop={to} weather={weatherByStop[stopKey(to)]} />
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StopRow({ stop, weather }: { stop: RouteStop; weather?: StopWeather }) {
  const DayNightIcon = stop.dayNightStatus === 'day' ? Sun : Moon
  const WeatherIcon = weatherIcons[weather?.condition ?? 'unknown']

  return (
    <div className="stop-row">
      <div>
        <strong>{stop.name}</strong>
        <span>{timeLabel(stop.localTime)}</span>
      </div>
      <div className="stop-meta">
        <span>
          <DayNightIcon size={15} />
          {stop.dayNightStatus === 'day' ? 'Day' : 'Night'}
        </span>
        <span title={weather?.source === 'demo' ? 'Estimated weather' : weather?.source === 'live' ? 'Live weather' : 'Forecast unavailable'}>
          <WeatherIcon size={15} />
          {weatherText(weather)}
        </span>
        {weather?.windSpeed !== undefined && (
          <span>
            <Wind size={15} />
            {Math.round(weather.windSpeed)} km/h
          </span>
        )}
      </div>
    </div>
  )
}
