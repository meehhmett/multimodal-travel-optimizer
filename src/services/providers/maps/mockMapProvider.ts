import type { LocationNode, RouteEdge } from '../../../types/route'
import type { GeocodeResult, MapProvider, NearbyHubRequest, TransferEstimateRequest } from './mapProvider.types'
import { airportToNode, distanceKm, nearbyAirports, openFlightsAirports } from '../../mockData/openFlightsAirports'

const cityCoordinates: Record<string, GeocodeResult> = {
  Istanbul: { city: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784 },
  Sofia: { city: 'Sofia', country: 'Bulgaria', latitude: 42.6977, longitude: 23.3219 },
  Brussels: { city: 'Brussels', country: 'Belgium', latitude: 50.8503, longitude: 4.3517 },
  Eindhoven: { city: 'Eindhoven', country: 'Netherlands', latitude: 51.4416, longitude: 5.4697 },
  Dusseldorf: { city: 'Dusseldorf', country: 'Germany', latitude: 51.2277, longitude: 6.7735 },
  Amsterdam: { city: 'Amsterdam', country: 'Netherlands', latitude: 52.3676, longitude: 4.9041 },
}

const cityNode = (city: string): LocationNode => ({
  id: `${city.toLowerCase()}-city-live`,
  name: city,
  city,
  country: cityCoordinates[city]?.country,
  latitude: cityCoordinates[city]?.latitude,
  longitude: cityCoordinates[city]?.longitude,
  type: 'city',
})

export const mockMapProvider: MapProvider = {
  name: 'Mock Maps',
  isLiveEnabled: () => false,
  geocode: async (city) => ({
    source: 'demo',
    data: cityCoordinates[city] ?? null,
    warnings: cityCoordinates[city] ? [] : [`Location data is unavailable for ${city}.`],
  }),
  nearbyTransportHubs: async ({ latitude, longitude, radiusKm }: NearbyHubRequest) => ({
    source: 'live',
    data: nearbyAirports(latitude, longitude, radiusKm).map(airportToNode),
    warnings: [],
  }),
  estimateTransfer: async ({ origin, destination, date }: TransferEstimateRequest) => {
    const from = origin.latitude !== undefined && origin.longitude !== undefined ? origin : cityNode(origin.city)
    const to = destination.latitude !== undefined && destination.longitude !== undefined ? destination : cityNode(destination.city)
    const km =
      from.latitude !== undefined && from.longitude !== undefined && to.latitude !== undefined && to.longitude !== undefined
        ? distanceKm({ latitude: from.latitude, longitude: from.longitude }, { latitude: to.latitude, longitude: to.longitude })
        : 35
    const durationMinutes = Math.max(18, Math.round(km * 1.2 + 18))
    const departure = new Date(`${date}T13:20:00.000Z`)
    const arrival = new Date(departure.getTime() + durationMinutes * 60000)
    const edge: RouteEdge = {
      id: `estimated-transfer-${origin.id}-${destination.id}-${date}`,
      from: origin.id,
      to: destination.id,
      transportType: km > 90 ? 'train' : 'local',
      provider: 'Estimated transfer time',
      departureTime: departure.toISOString(),
      arrivalTime: arrival.toISOString(),
      durationMinutes,
      price: Math.max(4, Math.round(km * 0.18)),
      comfortScore: 70,
      reliabilityScore: 88,
      transferRisk: 8,
      carbonScore: Math.round(km * 0.08),
      source: 'demo',
      localTransferMinutes: durationMinutes,
    }
    return { source: 'demo', data: edge, warnings: [] }
  },
}

export const mockCityNodes = Object.keys(cityCoordinates).map(cityNode)
export const mockAirportNodes = openFlightsAirports.map(airportToNode)
