import type { DateWindow, LocationNode, RouteEdge, SearchCriteria } from '../../types/route'
import {
  airportToNode,
  airportsByCity,
  discoverCandidateArrivalAirports,
  distanceKm,
  type OpenFlightsAirport,
} from '../mockData/openFlightsAirports'
import { mockTravelProvider } from './mockTravelProvider'
import { amadeusAirportNodes, amadeusProvider } from './amadeusProvider'
import { googleMapsProvider } from './maps/googleMapsProvider'
import { mockAirportNodes, mockCityNodes } from './maps/mockMapProvider'
import type { CandidateAirport, EngineProvider, ProviderRegistryResult } from './types'

const uniqueById = <T extends { id: string }>(items: T[]) => [...new Map(items.map((item) => [item.id, item])).values()]
const uniqueAirports = <T extends { airport: { iata: string } }>(items: T[]) =>
  [...new Map(items.map((item) => [item.airport.iata, item])).values()]

const cityNode = (city: string): LocationNode => ({
  id: `${city.toLowerCase()}-city-live`,
  name: city,
  city,
  type: 'city',
})

const cityCoordinates: Record<string, { latitude: number; longitude: number }> = {
  Amsterdam: { latitude: 52.3676, longitude: 4.9041 },
  Istanbul: { latitude: 41.0082, longitude: 28.9784 },
  Sofia: { latitude: 42.6977, longitude: 23.3219 },
  Brussels: { latitude: 50.8503, longitude: 4.3517 },
  Eindhoven: { latitude: 51.4416, longitude: 5.4697 },
  Dusseldorf: { latitude: 51.2277, longitude: 6.7735 },
  Cologne: { latitude: 50.9375, longitude: 6.9603 },
}

const minutesAfter = (iso: string, minutes: number) => new Date(new Date(iso).getTime() + minutes * 60000).toISOString()

const accessEdge = (city: string, airport: LocationNode, date: string): RouteEdge => {
  const departureTime = new Date(`${date}T06:00:00.000Z`).toISOString()
  const durationMinutes = city.toLowerCase() === airport.city.toLowerCase() ? 55 : 95
  return {
    id: `access-${city}-${airport.id}-${date}`,
    from: `${city.toLowerCase()}-city-live`,
    to: airport.id,
    transportType: 'local',
    provider: 'Local transfer estimate',
    departureTime,
    arrivalTime: minutesAfter(departureTime, durationMinutes),
    durationMinutes,
    price: durationMinutes > 60 ? 18 : 8,
    comfortScore: 66,
    reliabilityScore: 88,
    transferRisk: 8,
    carbonScore: 4,
    source: 'demo',
    localTransferMinutes: durationMinutes,
  }
}

const estimateArrivalTransferMinutes = (airport: OpenFlightsAirport, destinationCity: string, distanceToDestinationKm: number) => {
  const sameCity = destinationCity.toLowerCase() === airport.city.toLowerCase()
  if (sameCity) return airport.iata === 'AMS' ? 22 : 35
  return Math.round(distanceToDestinationKm * 0.75 + 45)
}

const arrivalTransferEdge = (
  airport: LocationNode,
  city: string,
  date: string,
  transferMinutes: number,
  distanceToDestinationKm: number,
): RouteEdge => {
  const departureTime = new Date(`${date}T13:20:00.000Z`).toISOString()
  const sameCity = city.toLowerCase() === airport.city.toLowerCase()
  return {
    id: `arrival-${airport.id}-${city}-${date}`,
    from: airport.id,
    to: `${city.toLowerCase()}-city-live`,
    transportType: sameCity ? 'local' : 'train',
    provider: googleMapsProvider.isLiveEnabled() ? 'Google Maps transfer estimate' : 'Estimated transfer time',
    departureTime,
    arrivalTime: minutesAfter(departureTime, transferMinutes),
    durationMinutes: transferMinutes,
    price: sameCity ? 6 : Math.round(distanceToDestinationKm * 0.22),
    comfortScore: sameCity ? 70 : 76,
    reliabilityScore: distanceToDestinationKm > 180 ? 82 : 88,
    transferRisk: 9 + Math.round(distanceToDestinationKm / 45),
    carbonScore: sameCity ? 2 : Math.round(distanceToDestinationKm * 0.08),
    source: googleMapsProvider.isLiveEnabled() ? 'live' : 'demo',
    localTransferMinutes: transferMinutes,
  }
}

const candidateFlightEdge = (
  origin: OpenFlightsAirport,
  destination: OpenFlightsAirport,
  date: string,
  destinationDistanceKm: number,
): RouteEdge => {
  const flightDistance = distanceKm(origin, destination)
  const durationMinutes = Math.round(flightDistance / 13.5 + 70)
  const departureTime = new Date(`${date}T08:35:00.000Z`).toISOString()
  const price = Math.round(75 + flightDistance * 0.045 - Math.min(destinationDistanceKm * 0.18, 35))
  return {
    id: `openflights-estimated-flight-${origin.iata}-${destination.iata}-${date}`,
    from: `airport-${origin.iata.toLowerCase()}`,
    to: `airport-${destination.iata.toLowerCase()}`,
    transportType: 'flight',
    provider: `Estimated fare ${origin.iata}-${destination.iata}`,
    departureTime,
    arrivalTime: minutesAfter(departureTime, durationMinutes),
    durationMinutes,
    price,
    comfortScore: 72,
    reliabilityScore: 84,
    transferRisk: 16,
    carbonScore: Math.round(flightDistance * 0.09),
    source: 'demo',
  }
}

const createLiveEngineProvider = async (criteria: SearchCriteria): Promise<ProviderRegistryResult> => {
  const warnings: string[] = []
  if (!criteria.selectedOrigin || !criteria.selectedDestination) {
    return {
      providers: [],
      dataSource: 'demo',
      warnings: ['Select a valid origin and destination to search routes.'],
      candidateAirports: [],
    }
  }
  const originCity = criteria.selectedOrigin.city
  const destinationCity = criteria.selectedDestination.city
  const departureAirports =
    criteria.selectedOrigin.type === 'airport' && criteria.selectedOrigin.code
      ? airportsByCity(originCity).filter((airport) => airport.iata === criteria.selectedOrigin?.code)
      : airportsByCity(originCity)
  const destinationCenter =
    criteria.selectedDestination.latitude !== undefined && criteria.selectedDestination.longitude !== undefined
      ? { latitude: criteria.selectedDestination.latitude, longitude: criteria.selectedDestination.longitude }
      : cityCoordinates[destinationCity] ?? {
    latitude: departureAirports[0]?.latitude ?? 52.3676,
    longitude: departureAirports[0]?.longitude ?? 4.9041,
  }
  const discoveredAirports = uniqueAirports(discoverCandidateArrivalAirports(destinationCenter, criteria.airportRadiusKm))
  const arrivalAirports = discoveredAirports.map((item) => item.airport)
  const candidateAirports: CandidateAirport[] = discoveredAirports.map(({ airport, distanceKm }) => ({
    code: airport.iata,
    name: airport.name,
    city: airport.city,
    country: airport.country,
    distanceToDestinationKm: Math.round(distanceKm),
    estimatedTransferMinutes: estimateArrivalTransferMinutes(airport, destinationCity, distanceKm),
    source: 'OpenFlights',
  }))
  const nodes = uniqueById([
    cityNode(criteria.originCity),
    cityNode(criteria.destinationCity),
    ...mockCityNodes,
    ...mockAirportNodes,
    ...amadeusAirportNodes,
    ...departureAirports.map(airportToNode),
    ...arrivalAirports.map(airportToNode),
  ])

  const edgeCache = new Map<string, RouteEdge[]>()
  let liveEdges = 0

  for (const origin of departureAirports) {
    for (const destination of discoveredAirports) {
      const result = await amadeusProvider.searchFlights({
        origin: origin.iata,
        destination: destination.airport.iata,
        date: criteria.departureDate,
        passengers: criteria.passengerCount,
      })
      warnings.push(...result.warnings)
      liveEdges += result.data.filter((edge) => edge.source === 'live').length
      const fallbackFlight = candidateFlightEdge(origin, destination.airport, criteria.departureDate, destination.distanceKm)
      edgeCache.set(`${origin.iata}-${destination.airport.iata}`, result.data.length ? result.data : [fallbackFlight])
    }
  }

  const liveProvider: EngineProvider = {
    name: 'Live provider registry',
    getNodes: () => nodes,
    getEdges: (window: DateWindow) => [
      ...departureAirports.map((airport) => accessEdge(originCity, airportToNode(airport), window.departureDate)),
      ...discoveredAirports.map(({ airport, distanceKm }) =>
        arrivalTransferEdge(
          airportToNode(airport),
          destinationCity,
          window.departureDate,
          estimateArrivalTransferMinutes(airport, destinationCity, distanceKm),
          distanceKm,
        ),
      ),
      ...[...edgeCache.values()].flat(),
    ],
  }

  const providers = [liveProvider, mockTravelProvider]
  const dataSource = liveEdges > 0 ? 'mixed' : 'mixed'
  if (!amadeusProvider.isLiveEnabled()) {
    warnings.push('Estimated prices are being used until live fare providers are connected.')
  }
  if (!googleMapsProvider.isLiveEnabled()) warnings.push('Transfer times are estimated until live maps data is connected.')
  if (liveEdges === 0) warnings.push('Airport data is live via OpenFlights; prices are estimated.')

  return { providers, dataSource, warnings: [...new Set(warnings)], candidateAirports }
}

export const resolveRouteProviders = async (criteria: SearchCriteria): Promise<ProviderRegistryResult> =>
  createLiveEngineProvider(criteria)
