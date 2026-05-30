export type TransportType =
  | 'flight'
  | 'bus'
  | 'train'
  | 'ferry'
  | 'rideshare'
  | 'local'

export type NodeType = 'city' | 'airport' | 'train_station' | 'bus_terminal' | 'ferry_port'
export type Priority = 'cheapest' | 'fastest' | 'balanced' | 'comfortable'
export type SortMode = Priority | 'risk'
export type DataSource = 'live' | 'demo'
export type RouteDataSource = DataSource | 'mixed'
export type PricingSource = 'live' | 'demo'

export interface LocationNode {
  id: string
  name: string
  city: string
  type: NodeType
  latitude?: number
  longitude?: number
  country?: string
  code?: string
}

export interface RouteEdge {
  id: string
  from: string
  to: string
  transportType: TransportType
  provider: string
  departureTime: string
  arrivalTime: string
  durationMinutes: number
  price: number
  comfortScore: number
  reliabilityScore: number
  transferRisk: number
  carbonScore: number
  source?: DataSource
  localTransferMinutes?: number
  fromName?: string
  toName?: string
  fromLatitude?: number
  fromLongitude?: number
  toLatitude?: number
  toLongitude?: number
  fromCity?: string
  toCity?: string
}

export type DayNightStatus = 'day' | 'night'
export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy' | 'unknown'

export interface StopWeather {
  temperatureC?: number
  condition: WeatherCondition
  precipitationProbability?: number
  windSpeed?: number
  source: DataSource | 'unavailable'
}

export interface RouteStop {
  nodeId: string
  name: string
  city?: string
  latitude?: number
  longitude?: number
  localTime: string
  dayNightStatus: DayNightStatus
  weather?: StopWeather
}

export interface SearchCriteria {
  originCity: string
  destinationCity: string
  selectedOrigin?: SearchLocation
  selectedDestination?: SearchLocation
  departureDate: string
  returnDate: string
  flexibleDates: boolean
  priority: Priority
  passengerCount: number
  maxTransfers: number
  maxTravelHours: number
  airportRadiusKm: number
  allowedTransportTypes: TransportType[]
}

export interface SearchLocation {
  id: string
  label: string
  city: string
  country: string
  type: NodeType
  code?: string
  latitude?: number
  longitude?: number
}

export interface DateWindow {
  departureDate: string
  returnDate: string
}

export interface RouteOption {
  id: string
  segments: RouteEdge[]
  dateWindow: DateWindow
  totalPrice: number
  totalDurationMinutes: number
  transferCount: number
  waitingMinutes: number
  riskScore: number
  comfortScore: number
  carbonScore: number
  overallScore: number
  labels: string[]
  warnings: string[]
  dataSource: RouteDataSource
  localTransferMinutes: number
  airportDataSource?: 'live'
  airportDataProvider?: string
  flightPricingSource?: PricingSource
  groundPricingSource?: PricingSource
  weatherDataSource?: RouteDataSource
}

export interface RouteProvider {
  name: string
  getNodes(): LocationNode[]
  getEdges(window: DateWindow): RouteEdge[]
}
