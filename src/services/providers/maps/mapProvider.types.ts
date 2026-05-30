import type { LocationNode, RouteEdge } from '../../../types/route'

export interface GeocodeResult {
  city: string
  latitude: number
  longitude: number
  country?: string
}

export interface NearbyHubRequest {
  latitude: number
  longitude: number
  radiusKm: number
}

export interface TransferEstimateRequest {
  origin: LocationNode
  destination: LocationNode
  date: string
}

export interface MapProviderResult<T> {
  source: 'live' | 'demo'
  data: T
  warnings: string[]
}

export interface MapProvider {
  name: string
  isLiveEnabled(): boolean
  geocode(city: string): Promise<MapProviderResult<GeocodeResult | null>>
  nearbyTransportHubs(request: NearbyHubRequest): Promise<MapProviderResult<LocationNode[]>>
  estimateTransfer(request: TransferEstimateRequest): Promise<MapProviderResult<RouteEdge>>
}
