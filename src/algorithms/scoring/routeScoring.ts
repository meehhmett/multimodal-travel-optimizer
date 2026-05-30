import type { Priority, RouteOption } from '../../types/route'

const clamp = (value: number) => Math.max(0, Math.min(100, value))

export const scoreRoute = (route: Omit<RouteOption, 'overallScore' | 'labels'>, priority: Priority) => {
  const priceScore = clamp(100 - route.totalPrice / 6)
  const timeScore = clamp(100 - route.totalDurationMinutes / 12)
  const comfortScore = route.comfortScore
  const riskScore = clamp(100 - route.riskScore)
  const carbonScore = clamp(100 - route.carbonScore / 5)
  const transferPenalty = Math.min(20, route.localTransferMinutes / 18)

  const weights = {
    cheapest: { priceScore: 0.45, timeScore: 0.18, comfortScore: 0.12, riskScore: 0.15, carbonScore: 0.1 },
    fastest: { priceScore: 0.12, timeScore: 0.48, comfortScore: 0.13, riskScore: 0.17, carbonScore: 0.1 },
    balanced: { priceScore: 0.26, timeScore: 0.25, comfortScore: 0.19, riskScore: 0.2, carbonScore: 0.1 },
    comfortable: { priceScore: 0.15, timeScore: 0.16, comfortScore: 0.44, riskScore: 0.18, carbonScore: 0.07 },
  }[priority]

  return Math.round(
    priceScore * weights.priceScore +
      timeScore * weights.timeScore +
      comfortScore * weights.comfortScore +
      riskScore * weights.riskScore +
      carbonScore * weights.carbonScore -
      transferPenalty,
  )
}

export const labelRoutes = (routes: RouteOption[]) => {
  if (!routes.length) return []
  const cheapest = Math.min(...routes.map((item) => item.totalPrice))
  const fastest = Math.min(...routes.map((item) => item.totalDurationMinutes))
  const lowestRisk = Math.min(...routes.map((item) => item.riskScore))
  const bestOverall = Math.max(...routes.map((item) => item.overallScore))

  return routes.map((route) => {
    const labels = new Set(route.labels)
    if (route.totalPrice === cheapest) labels.add('Cheapest')
    if (route.totalDurationMinutes === fastest) labels.add('Fastest')
    if (route.riskScore === lowestRisk) labels.add('Low Risk')
    if (route.overallScore === bestOverall) labels.add('Balanced')
    return { ...route, labels: [...labels].slice(0, 2) }
  })
}
