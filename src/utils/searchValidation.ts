import type { SearchCriteria } from '../types/route'

export const minAirportRadiusKm = 50
export const maxAirportRadiusKm = 300

export const todayIso = () => {
  const now = new Date()
  const utcToday = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  return utcToday.toISOString().slice(0, 10)
}

export const isValidDateRange = (departureDate: string, returnDate: string) =>
  Boolean(departureDate && returnDate && returnDate >= departureDate)

export const clampSearchCriteria = (criteria: SearchCriteria): SearchCriteria => ({
  ...criteria,
  departureDate: criteria.departureDate < todayIso() ? todayIso() : criteria.departureDate,
  returnDate: criteria.returnDate < criteria.departureDate ? criteria.departureDate : criteria.returnDate,
  passengerCount: Math.max(1, Math.round(criteria.passengerCount || 1)),
  maxTransfers: Math.max(0, Math.round(criteria.maxTransfers || 0)),
  maxTravelHours: Math.max(1, Math.round(criteria.maxTravelHours || 1)),
  airportRadiusKm: Math.min(maxAirportRadiusKm, Math.max(minAirportRadiusKm, Math.round(criteria.airportRadiusKm || 230))),
})

export const validateSearchCriteria = (criteria: SearchCriteria) => {
  const warnings: string[] = []
  if (!criteria.originCity.trim()) warnings.push('Origin is required.')
  if (!criteria.destinationCity.trim()) warnings.push('Destination is required.')
  if (criteria.originCity.trim() && !criteria.selectedOrigin) warnings.push('Please select a valid origin from the list.')
  if (criteria.destinationCity.trim() && !criteria.selectedDestination) {
    warnings.push('Please select a valid destination from the list.')
  }
  if (criteria.selectedOrigin && criteria.selectedDestination && criteria.selectedOrigin.id === criteria.selectedDestination.id) {
    warnings.push('Origin and destination must be different.')
  }
  if (!isValidDateRange(criteria.departureDate, criteria.returnDate)) {
    warnings.push('Return date cannot be before departure date.')
  }
  if (criteria.departureDate < todayIso()) warnings.push('Departure date cannot be before today.')
  if (criteria.returnDate < todayIso()) warnings.push('Return date cannot be before today.')
  if (criteria.passengerCount < 1) warnings.push('Passenger count must be at least 1.')
  if (criteria.maxTransfers < 0) warnings.push('Max transfers cannot be negative.')
  if (criteria.maxTravelHours <= 0) warnings.push('Max duration must be greater than 0.')
  if (criteria.airportRadiusKm < minAirportRadiusKm || criteria.airportRadiusKm > maxAirportRadiusKm) {
    warnings.push(`Airport radius must be between ${minAirportRadiusKm} and ${maxAirportRadiusKm} km.`)
  }
  return warnings
}
