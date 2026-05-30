import { transportTypes } from './transport'
import type { SearchCriteria } from '../types/route'

export const defaultCriteria: SearchCriteria = {
  originCity: 'Istanbul',
  destinationCity: 'Amsterdam',
  departureDate: '2026-06-10',
  returnDate: '2026-06-17',
  flexibleDates: true,
  priority: 'balanced',
  passengerCount: 1,
  maxTransfers: 4,
  maxTravelHours: 42,
  airportRadiusKm: 230,
  allowedTransportTypes: transportTypes,
}

export const emptySearchCriteria: SearchCriteria = {
  ...defaultCriteria,
  originCity: '',
  destinationCity: '',
  selectedOrigin: undefined,
  selectedDestination: undefined,
  departureDate: '',
  returnDate: '',
}
