import type { RouteProvider, SearchCriteria, SortMode } from '../../types/route'
import { generateDateWindows } from '../../algorithms/dateFlexibility/generateDateWindows'
import { buildGraph } from '../../algorithms/graph/graph'
import { labelRoutes } from '../../algorithms/scoring/routeScoring'
import { sortRoutes } from '../../algorithms/scoring/routeSorting'
import { filterRoutes } from './routeFilters'
import { generateRoutes } from './routeGenerator'

const routeSignature = (route: { segments: { from: string; to: string; transportType: string }[] }) =>
  route.segments.map((segment) => `${segment.from}:${segment.to}:${segment.transportType}`).join('|')

const dedupeRoutes = <T extends { segments: { from: string; to: string; transportType: string }[]; overallScore: number }>(
  routes: T[],
) => {
  const bestBySignature = new Map<string, T>()
  routes.forEach((route) => {
    const key = routeSignature(route)
    const current = bestBySignature.get(key)
    if (!current || route.overallScore > current.overallScore) bestBySignature.set(key, route)
  })
  return [...bestBySignature.values()]
}

export const optimizeRoutes = (
  criteria: SearchCriteria,
  providers: RouteProvider[],
  sortMode: SortMode = criteria.priority,
) => {
  const windows = generateDateWindows(criteria.departureDate, criteria.returnDate, criteria.flexibleDates)
  const routes = windows.flatMap((window) => {
    const nodes = providers.flatMap((provider) => provider.getNodes())
    const edges = providers.flatMap((provider) => provider.getEdges(window))
    return generateRoutes(
      buildGraph(nodes, edges),
      criteria.originCity,
      criteria.destinationCity,
      window,
      criteria.priority,
      criteria.allowedTransportTypes,
      criteria.maxTransfers,
    )
  })

  const filtered = sortRoutes(filterRoutes(dedupeRoutes(routes), criteria), sortMode).slice(0, 12)

  return labelRoutes(filtered)
}
