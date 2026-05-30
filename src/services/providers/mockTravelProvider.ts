import type { RouteProvider } from '../../types/route'
import { getMockEdges, mockNodes } from '../mockData/mockNetwork'
import { airportToNode, nearbyAirports } from '../mockData/openFlightsAirports'
import type { FlightSearchRequest, GroundConnectionRequest, NearbyAirportRequest, TravelDataProvider } from './types'

const searchFlights = async ({ origin, destination, date }: FlightSearchRequest) => ({
  source: 'demo' as const,
  data: getMockEdges({ departureDate: date, returnDate: date })
    .filter((edge) => edge.transportType === 'flight')
    .filter((edge) => edge.id.toLowerCase().includes(origin.toLowerCase()) || edge.id.toLowerCase().includes(destination.toLowerCase()))
    .map((edge) => ({ ...edge, source: 'demo' as const })),
  warnings: ['Estimated flight prices are shown until live fare providers are connected.'],
})

const searchNearbyAirports = async ({ latitude, longitude, radiusKm }: NearbyAirportRequest) => ({
  source: 'live' as const,
  data: nearbyAirports(latitude, longitude, radiusKm).map(airportToNode),
  warnings: ['Airport discovery uses live OpenFlights airport data.'],
})

const searchGroundConnections = async ({ date }: GroundConnectionRequest) => ({
  source: 'demo' as const,
  data: getMockEdges({ departureDate: date, returnDate: date })
    .filter((edge) => edge.transportType !== 'flight')
    .map((edge) => ({ ...edge, source: 'demo' as const })),
  warnings: ['Estimated ground transport prices are shown until live fare providers are connected.'],
})

export const mockTravelProvider = {
  name: 'Mock multimodal provider',
  isLiveEnabled: () => false,
  getNodes: () => mockNodes,
  getEdges: (window) => getMockEdges(window).map((edge) => ({ ...edge, source: 'demo' })),
  searchFlights,
  searchNearbyAirports,
  searchGroundConnections,
} satisfies RouteProvider & TravelDataProvider
