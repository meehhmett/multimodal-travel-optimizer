import type { RouteEdge } from '../../../types/route'
import type { GeocodeResult, MapProvider, NearbyHubRequest, TransferEstimateRequest } from './mapProvider.types'
import { mockMapProvider } from './mockMapProvider'

const googleMapsKey = () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined

// TODO: Move Google Maps calls to a backend/proxy before production so API keys are not exposed in the browser.
export const googleMapsProvider: MapProvider = {
  name: 'Google Maps',
  isLiveEnabled: () => Boolean(googleMapsKey()),
  geocode: async (city) => {
    if (!googleMapsKey()) {
      return { ...(await mockMapProvider.geocode(city)), warnings: ['Location data is estimated until live maps data is connected.'] }
    }
    try {
      const params = new URLSearchParams({ address: city, key: googleMapsKey() ?? '' })
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`)
      if (!response.ok) throw new Error('Google geocoding failed')
      const payload = await response.json()
      const result = payload.results?.[0]
      if (!result) throw new Error('Google geocoding returned no result')
      const data: GeocodeResult = {
        city,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        country: result.address_components?.find((item: { types: string[] }) => item.types.includes('country'))?.long_name,
      }
      return { source: 'live', data, warnings: [] }
    } catch {
      return { ...(await mockMapProvider.geocode(city)), warnings: ['Live maps data is unavailable; estimated location data is shown.'] }
    }
  },
  nearbyTransportHubs: async (request: NearbyHubRequest) => ({
    ...(await mockMapProvider.nearbyTransportHubs(request)),
    warnings: googleMapsKey() ? ['Nearby hubs use live OpenFlights airport data.'] : ['Nearby hubs use live OpenFlights airport data.'],
  }),
  estimateTransfer: async (request: TransferEstimateRequest) => {
    if (!googleMapsKey()) {
      return { ...(await mockMapProvider.estimateTransfer(request)), warnings: ['Transfer times are estimated until live maps data is connected.'] }
    }
    try {
      const params = new URLSearchParams({
        origins: `${request.origin.latitude},${request.origin.longitude}`,
        destinations: `${request.destination.latitude},${request.destination.longitude}`,
        mode: 'transit',
        key: googleMapsKey() ?? '',
      })
      const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?${params}`)
      if (!response.ok) throw new Error('Google distance matrix failed')
      const payload = await response.json()
      const value = payload.rows?.[0]?.elements?.[0]
      if (!value?.duration?.value) throw new Error('Google transfer estimate missing duration')
      const fallback = await mockMapProvider.estimateTransfer(request)
      const edge: RouteEdge = {
        ...fallback.data,
        durationMinutes: Math.round(value.duration.value / 60),
        localTransferMinutes: Math.round(value.duration.value / 60),
        source: 'live',
        provider: 'Google Maps transit estimate',
      }
      return { source: 'live', data: edge, warnings: [] }
    } catch {
      return { ...(await mockMapProvider.estimateTransfer(request)), warnings: ['Live transfer times are unavailable; estimated transfer times are shown.'] }
    }
  },
}
