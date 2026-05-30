import type { RouteEdge } from '../../types/route'
import type { FlightSearchRequest, NearbyAirportRequest, TravelDataProvider } from './types'
import { airportToNode, nearbyAirports, openFlightsAirports } from '../mockData/openFlightsAirports'

interface AmadeusTokenResponse {
  access_token: string
}

interface AmadeusFlightOffer {
  id: string
  price: { grandTotal: string }
  validatingAirlineCodes?: string[]
  itineraries: Array<{
    duration: string
    segments: Array<{
      departure: { iataCode: string; at: string }
      arrival: { iataCode: string; at: string }
      carrierCode: string
      duration: string
    }>
  }>
}

const clientId = () => import.meta.env.VITE_AMADEUS_CLIENT_ID as string | undefined
const clientSecret = () => import.meta.env.VITE_AMADEUS_CLIENT_SECRET as string | undefined

class AmadeusHttpError extends Error {
  readonly status: number
  readonly operation: string

  constructor(message: string, status: number, operation: string) {
    super(message)
    this.status = status
    this.operation = operation
  }
}

const debugAmadeus = (message: string, details?: Record<string, unknown>) => {
  if (!import.meta.env.DEV) return
  console.debug('[Amadeus]', message, details)
}

const readErrorBody = async (response: Response) => {
  try {
    return (await response.text()).slice(0, 300)
  } catch {
    return ''
  }
}

const parseDuration = (value: string) => {
  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  return Number(match?.[1] ?? 0) * 60 + Number(match?.[2] ?? 0)
}

const airportNodeId = (iata: string) => `airport-${iata.toLowerCase()}`

const getToken = async () => {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId() ?? '',
    client_secret: clientSecret() ?? '',
  })
  const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!response.ok) {
    debugAmadeus('Token request failed', {
      status: response.status,
      statusText: response.statusText,
      body: await readErrorBody(response),
    })
    throw new AmadeusHttpError('Amadeus token request failed', response.status, 'token')
  }
  const payload = (await response.json()) as AmadeusTokenResponse
  return payload.access_token
}

const normalizeOffer = (offer: AmadeusFlightOffer, index: number): RouteEdge | null => {
  const itinerary = offer.itineraries[0]
  const first = itinerary?.segments[0]
  const last = itinerary?.segments[itinerary.segments.length - 1]
  if (!first || !last) return null
  const stops = Math.max(0, itinerary.segments.length - 1)
  const durationMinutes = parseDuration(itinerary.duration)
  const airline = offer.validatingAirlineCodes?.[0] ?? first.carrierCode

  return {
    id: `amadeus-${offer.id}-${index}`,
    from: airportNodeId(first.departure.iataCode),
    to: airportNodeId(last.arrival.iataCode),
    transportType: 'flight',
    provider: `${airline} via Amadeus`,
    departureTime: new Date(first.departure.at).toISOString(),
    arrivalTime: new Date(last.arrival.at).toISOString(),
    durationMinutes,
    price: Number(offer.price.grandTotal),
    comfortScore: stops === 0 ? 78 : 70,
    reliabilityScore: stops === 0 ? 88 : 81,
    transferRisk: 16 + stops * 14,
    carbonScore: Math.max(80, Math.round(durationMinutes * 0.7)),
    source: 'live',
  }
}

// TODO: Move Amadeus OAuth and Flight Offers calls to a backend/proxy before production.
export const amadeusProvider: TravelDataProvider = {
  name: 'Amadeus',
  isLiveEnabled: () => Boolean(clientId() && clientSecret()),
  searchFlights: async ({ origin, destination, date, passengers }: FlightSearchRequest) => {
    if (!clientId() || !clientSecret()) {
      return { source: 'demo', data: [], warnings: ['Estimated prices are being used until live fare providers are connected.'] }
    }

    try {
      const token = await getToken()
      const params = new URLSearchParams({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: date,
        adults: String(passengers),
        currencyCode: 'EUR',
        max: '5',
      })
      const response = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        debugAmadeus('Flight Offers Search failed', {
          status: response.status,
          statusText: response.statusText,
          origin,
          destination,
          date,
          body: await readErrorBody(response),
        })
        throw new AmadeusHttpError('Amadeus Flight Offers Search failed', response.status, 'flight-offers')
      }
      const payload = await response.json()
      const data = ((payload.data ?? []) as AmadeusFlightOffer[])
        .map(normalizeOffer)
        .filter((edge): edge is RouteEdge => Boolean(edge))
      return { source: 'live', data, warnings: data.length ? [] : ['No live flight fares were returned; estimated pricing is shown.'] }
    } catch (error) {
      if (error instanceof AmadeusHttpError) {
        return {
          source: 'demo',
          data: [],
          warnings: [`Live fare lookup is temporarily unavailable (HTTP ${error.status}); estimated pricing is shown.`],
        }
      }
      debugAmadeus('Flight search failed before receiving an HTTP response', {
        origin,
        destination,
        date,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return { source: 'demo', data: [], warnings: ['Live fare lookup is temporarily unavailable; estimated pricing is shown.'] }
    }
  },
  searchNearbyAirports: async ({ latitude, longitude, radiusKm }: NearbyAirportRequest) => ({
    source: 'live',
    data: nearbyAirports(latitude, longitude, radiusKm).map(airportToNode),
    warnings: ['Using OpenFlights airport database for nearby airport discovery.'],
  }),
  searchGroundConnections: async () => ({ source: 'demo', data: [], warnings: [] }),
}

export const amadeusAirportNodes = openFlightsAirports.map(airportToNode)
