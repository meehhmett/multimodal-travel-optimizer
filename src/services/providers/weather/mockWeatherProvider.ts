import type { WeatherProvider } from './weatherProvider.types'
import { getDayNightStatus } from './weatherUtils'

export const mockWeatherProvider: WeatherProvider = {
  name: 'Mock Weather',
  getWeatherForLocation: async ({ latitude, longitude, dateTime }) => {
    const dayNight = getDayNightStatus(dateTime)
    const seed = Math.abs(Math.round(latitude * 10 + longitude * 10 + new Date(dateTime).getUTCDate()))
    const conditions = ['sunny', 'cloudy', 'rainy', 'foggy'] as const
    return {
      temperatureC: Math.round(8 + (seed % 17) + (dayNight === 'day' ? 3 : -2)),
      condition: conditions[seed % conditions.length],
      precipitationProbability: seed % 4 === 0 ? 55 : 18,
      windSpeed: 8 + (seed % 18),
      source: 'demo',
      label: 'Estimated weather',
    }
  },
}
