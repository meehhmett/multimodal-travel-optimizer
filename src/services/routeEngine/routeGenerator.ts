import type {
  Priority,
  PricingSource,
  RouteDataSource,
  RouteEdge,
  RouteOption,
  TransportType,
  DateWindow,
} from '../../types/route'
import { findNodesByCity, outgoingEdges, type TravelGraph } from '../../algorithms/graph/graph'
import { scoreRoute } from '../../algorithms/scoring/routeScoring'

const minutesBetween = (from: string, to: string) =>
  Math.round((new Date(to).getTime() - new Date(from).getTime()) / 60000)

const hasOvernightWait = (minutes: number) => minutes >= 8 * 60

const summarizeRoute = (
  segments: RouteEdge[],
  dateWindow: DateWindow,
  priority: Priority,
): RouteOption | null => {
  const waits = segments.slice(1).map((segment, index) =>
    minutesBetween(segments[index].arrivalTime, segment.departureTime),
  )
  if (waits.some((wait) => wait < 45)) return null

  const waitingMinutes = waits.reduce((sum, wait) => sum + wait, 0)
  const totalDurationMinutes =
    minutesBetween(segments[0].departureTime, segments[segments.length - 1].arrivalTime)
  const riskScore = Math.round(
    segments.reduce((sum, segment) => sum + segment.transferRisk + (100 - segment.reliabilityScore) * 0.35, 0) +
      waits.filter((wait) => wait < 90).length * 18 +
      waits.filter(hasOvernightWait).length * 8,
  )
  const warnings = [
    ...waits.filter(hasOvernightWait).map(() => 'Overnight wait'),
    ...waits.filter((wait) => wait < 90).map(() => 'Risky short transfer'),
  ]

  const dataSource: RouteDataSource = segments.every((segment) => segment.source === 'live')
    ? 'live'
    : segments.some((segment) => segment.source === 'live')
      ? 'mixed'
      : 'demo'
  const flightPricingSource: PricingSource = segments.some(
    (segment) => segment.transportType === 'flight' && segment.source === 'live',
  )
    ? 'live'
    : 'demo'
  const groundPricingSource: PricingSource = segments.some(
    (segment) => segment.transportType !== 'flight' && segment.source === 'live',
  )
    ? 'live'
    : 'demo'

  const route: Omit<RouteOption, 'labels' | 'overallScore'> = {
    id: `${dateWindow.departureDate}-${dateWindow.returnDate}-${segments.map((segment) => segment.id).join('-')}`,
    segments,
    dateWindow,
    totalPrice: segments.reduce((sum, segment) => sum + segment.price, 0),
    totalDurationMinutes,
    transferCount: Math.max(0, segments.length - 1),
    waitingMinutes,
    riskScore,
    comfortScore: Math.round(segments.reduce((sum, segment) => sum + segment.comfortScore, 0) / segments.length),
    carbonScore: segments.reduce((sum, segment) => sum + segment.carbonScore, 0),
    warnings,
    dataSource,
    localTransferMinutes: segments.reduce((sum, segment) => sum + (segment.localTransferMinutes ?? 0), 0),
    airportDataSource: 'live',
    airportDataProvider: 'OpenFlights',
    flightPricingSource,
    groundPricingSource,
  }

  return { ...route, labels: [], overallScore: scoreRoute(route, priority) }
}

const enrichSegment = (segment: RouteEdge, graph: TravelGraph): RouteEdge => {
  const from = graph.nodes.find((node) => node.id === segment.from)
  const to = graph.nodes.find((node) => node.id === segment.to)
  return {
    ...segment,
    fromName: from?.name ?? segment.from,
    toName: to?.name ?? segment.to,
    fromLatitude: from?.latitude,
    fromLongitude: from?.longitude,
    toLatitude: to?.latitude,
    toLongitude: to?.longitude,
    fromCity: from?.city,
    toCity: to?.city,
  }
}

export const generateRoutes = (
  graph: TravelGraph,
  originCity: string,
  destinationCity: string,
  dateWindow: DateWindow,
  priority: Priority,
  allowedTypes: TransportType[],
  maxTransfers: number,
) => {
  const originIds = new Set(findNodesByCity(graph, originCity).map((node) => node.id))
  const destinationIds = new Set(findNodesByCity(graph, destinationCity).map((node) => node.id))
  const maxSegments = Math.max(1, maxTransfers + 1)
  const candidates: RouteOption[] = []

  const walk = (nodeId: string, path: RouteEdge[], visited: Set<string>) => {
    if (destinationIds.has(nodeId) && path.length > 0) {
      const route = summarizeRoute(path.map((segment) => enrichSegment(segment, graph)), dateWindow, priority)
      if (route) candidates.push(route)
    }
    if (path.length >= maxSegments) return

    outgoingEdges(graph, nodeId)
      .filter((edge) => allowedTypes.includes(edge.transportType))
      .filter((edge) => !visited.has(edge.to))
      .filter((edge) => path.length === 0 || new Date(edge.departureTime) > new Date(path[path.length - 1].arrivalTime))
      .forEach((edge) => walk(edge.to, [...path, edge], new Set([...visited, edge.to])))
  }

  originIds.forEach((originId) => walk(originId, [], new Set([originId])))
  return candidates
}
