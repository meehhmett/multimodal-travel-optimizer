import type { DataSource, WeatherCondition } from '../../../types/route'

export interface WeatherRequest {
  latitude: number
  longitude: number
  dateTime: string
}

export interface WeatherData {
  temperatureC?: number
  condition: WeatherCondition
  precipitationProbability?: number
  windSpeed?: number
  source: DataSource | 'unavailable'
  label: string
}

export interface WeatherProvider {
  name: string
  getWeatherForLocation(request: WeatherRequest): Promise<WeatherData>
}
