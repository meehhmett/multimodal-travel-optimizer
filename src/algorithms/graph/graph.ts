import type { LocationNode, RouteEdge } from '../../types/route'

export interface TravelGraph {
  nodes: LocationNode[]
  edges: RouteEdge[]
}

export const buildGraph = (nodes: LocationNode[], edges: RouteEdge[]): TravelGraph => ({ nodes, edges })

export const findNodesByCity = (graph: TravelGraph, city: string) =>
  graph.nodes.filter((node) => node.city.toLowerCase() === city.trim().toLowerCase())

export const outgoingEdges = (graph: TravelGraph, nodeId: string) =>
  graph.edges.filter((edge) => edge.from === nodeId)
