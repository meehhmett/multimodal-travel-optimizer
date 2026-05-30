import type { DateWindow, LocationNode, RouteEdge } from '../../types/route'

export interface FlightSearchRequest {
  origin: string
  destination: string
  date: string
  passengers: number
}

export interface NearbyAirportRequest {
  latitude: number
  longitude: number
  radiusKm: number
}

export interface GroundConnectionRequest {
  origin: LocationNode
  destination: LocationNode
  date: string
}

export interface ProviderResult<T> {
  source: 'live' | 'demo'
  data: T
  warnings: string[]
}

export interface TravelDataProvider {
  name: string
  isLiveEnabled(): boolean
  searchFlights(request: FlightSearchRequest): Promise<ProviderResult<RouteEdge[]>>
  searchNearbyAirports(request: NearbyAirportRequest): Promise<ProviderResult<LocationNode[]>>
  searchGroundConnections(request: GroundConnectionRequest): Promise<ProviderResult<RouteEdge[]>>
}

export interface EngineProvider {
  name: string
  getNodes(): LocationNode[]
  getEdges(window: DateWindow): RouteEdge[]
}

export interface ProviderRegistryResult {
  providers: EngineProvider[]
  dataSource: 'live' | 'demo' | 'mixed'
  warnings: string[]
  candidateAirports: CandidateAirport[]
}

export interface CandidateAirport {
  code: string
  name: string
  city: string
  country: string
  distanceToDestinationKm: number
  estimatedTransferMinutes?: number
  source: 'OpenFlights'
}
