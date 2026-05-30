import type { WeatherProvider } from './weatherProvider.types'
import { mockWeatherProvider } from './mockWeatherProvider'
import { nearestHourlyIndex, normalizeWeatherCode } from './weatherUtils'

interface OpenMeteoHourly {
  time: string[]
  temperature_2m?: number[]
  precipitation_probability?: number[]
  weather_code?: number[]
  wind_speed_10m?: number[]
}

interface OpenMeteoResponse {
  hourly?: OpenMeteoHourly
}

const isForecastDateSupported = (dateTime: string) => {
  const now = new Date()
  const target = new Date(dateTime)
  const days = (target.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
  return days >= -1 && days <= 16
}

export const openMeteoProvider: WeatherProvider = {
  name: 'Open-Meteo',
  getWeatherForLocation: async ({ latitude, longitude, dateTime }) => {
    if (!isForecastDateSupported(dateTime)) {
      return {
        ...(await mockWeatherProvider.getWeatherForLocation({ latitude, longitude, dateTime })),
        source: 'demo',
        label: 'Forecast unavailable',
      }
    }

    try {
      const params = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        hourly: 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m',
        forecast_days: '16',
        timezone: 'auto',
      })
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
      if (!response.ok) throw new Error(`Open-Meteo HTTP ${response.status}`)
      const payload = (await response.json()) as OpenMeteoResponse
      const hourly = payload.hourly
      if (!hourly?.time.length) throw new Error('Open-Meteo missing hourly data')
      const index = nearestHourlyIndex(hourly.time, dateTime)
      return {
        temperatureC: Math.round(hourly.temperature_2m?.[index] ?? 0),
        condition: normalizeWeatherCode(hourly.weather_code?.[index]),
        precipitationProbability: hourly.precipitation_probability?.[index],
        windSpeed: hourly.wind_speed_10m?.[index],
        source: 'live',
        label: 'Live weather',
      }
    } catch {
      return {
        ...(await mockWeatherProvider.getWeatherForLocation({ latitude, longitude, dateTime })),
        source: 'demo',
        label: 'Estimated weather',
      }
    }
  },
}
