import type { RouteOption, SortMode } from '../../types/route'

export const sortRoutes = (routes: RouteOption[], sortMode: SortMode) => {
  const sorters: Record<SortMode, (a: RouteOption, b: RouteOption) => number> = {
    cheapest: (a, b) => a.totalPrice - b.totalPrice,
    fastest: (a, b) => a.totalDurationMinutes - b.totalDurationMinutes,
    balanced: (a, b) => b.overallScore - a.overallScore,
    comfortable: (a, b) => b.comfortScore - a.comfortScore,
    risk: (a, b) => a.riskScore - b.riskScore,
  }

  return [...routes].sort((a, b) => {
    const primary = sorters[sortMode](a, b)
    if (primary !== 0) return primary
    if (a.overallScore !== b.overallScore) return b.overallScore - a.overallScore
    if (a.totalPrice !== b.totalPrice) return a.totalPrice - b.totalPrice
    if (a.totalDurationMinutes !== b.totalDurationMinutes) return a.totalDurationMinutes - b.totalDurationMinutes
    return a.id.localeCompare(b.id)
  })
}
