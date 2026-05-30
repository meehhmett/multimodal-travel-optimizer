import type { DayNightStatus, WeatherCondition } from '../../../types/route'

export const getDayNightStatus = (dateTime: string): DayNightStatus => {
  // TODO: Replace this with timezone-aware local time once route nodes carry timezone data.
  const hour = new Date(dateTime).getHours()
  return hour >= 6 && hour <= 18 ? 'day' : 'night'
}

export const normalizeWeatherCode = (code?: number): WeatherCondition => {
  if (code === undefined) return 'unknown'
  if (code === 0) return 'sunny'
  if ([1, 2, 3].includes(code)) return 'cloudy'
  if ([45, 48].includes(code)) return 'foggy'
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rainy'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snowy'
  if ([95, 96, 99].includes(code)) return 'stormy'
  return 'unknown'
}

export const nearestHourlyIndex = (times: string[], dateTime: string) => {
  const target = new Date(dateTime).getTime()
  let bestIndex = 0
  let bestDistance = Number.POSITIVE_INFINITY
  times.forEach((time, index) => {
    const distance = Math.abs(new Date(time).getTime() - target)
    if (distance < bestDistance) {
      bestDistance = distance
      bestIndex = index
    }
  })
  return bestIndex
}
