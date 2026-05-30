import { openFlightsAirports } from '../services/mockData/openFlightsAirports'
import type { SearchLocation } from '../types/route'

const cityLocations: SearchLocation[] = [
  { id: 'city-istanbul', label: 'Istanbul, Turkey', city: 'Istanbul', country: 'Turkey', type: 'city', latitude: 41.0082, longitude: 28.9784 },
  { id: 'city-amsterdam', label: 'Amsterdam, Netherlands', city: 'Amsterdam', country: 'Netherlands', type: 'city', latitude: 52.3676, longitude: 4.9041 },
  { id: 'city-ankara', label: 'Ankara, Turkey', city: 'Ankara', country: 'Turkey', type: 'city', latitude: 39.9334, longitude: 32.8597 },
  { id: 'city-izmir', label: 'Izmir, Turkey', city: 'Izmir', country: 'Turkey', type: 'city', latitude: 38.4237, longitude: 27.1428 },
  { id: 'city-antalya', label: 'Antalya, Turkey', city: 'Antalya', country: 'Turkey', type: 'city', latitude: 36.8969, longitude: 30.7133 },
  { id: 'city-sofia', label: 'Sofia, Bulgaria', city: 'Sofia', country: 'Bulgaria', type: 'city', latitude: 42.6977, longitude: 23.3219 },
  { id: 'city-brussels', label: 'Brussels, Belgium', city: 'Brussels', country: 'Belgium', type: 'city', latitude: 50.8503, longitude: 4.3517 },
  { id: 'city-charleroi', label: 'Charleroi, Belgium', city: 'Charleroi', country: 'Belgium', type: 'city', latitude: 50.4108, longitude: 4.4446 },
  { id: 'city-eindhoven', label: 'Eindhoven, Netherlands', city: 'Eindhoven', country: 'Netherlands', type: 'city', latitude: 51.4416, longitude: 5.4697 },
  { id: 'city-dusseldorf', label: 'Dusseldorf, Germany', city: 'Dusseldorf', country: 'Germany', type: 'city', latitude: 51.2277, longitude: 6.7735 },
  { id: 'city-cologne', label: 'Cologne, Germany', city: 'Cologne', country: 'Germany', type: 'city', latitude: 50.9375, longitude: 6.9603 },
  { id: 'city-paris', label: 'Paris, France', city: 'Paris', country: 'France', type: 'city', latitude: 48.8566, longitude: 2.3522 },
  { id: 'city-vienna', label: 'Vienna, Austria', city: 'Vienna', country: 'Austria', type: 'city', latitude: 48.2082, longitude: 16.3738 },
  { id: 'city-zurich', label: 'Zurich, Switzerland', city: 'Zurich', country: 'Switzerland', type: 'city', latitude: 47.3769, longitude: 8.5417 },
  { id: 'city-milan', label: 'Milan, Italy', city: 'Milan', country: 'Italy', type: 'city', latitude: 45.4642, longitude: 9.19 },
  { id: 'city-rome', label: 'Rome, Italy', city: 'Rome', country: 'Italy', type: 'city', latitude: 41.9028, longitude: 12.4964 },
  { id: 'city-barcelona', label: 'Barcelona, Spain', city: 'Barcelona', country: 'Spain', type: 'city', latitude: 41.3874, longitude: 2.1686 },
  { id: 'city-madrid', label: 'Madrid, Spain', city: 'Madrid', country: 'Spain', type: 'city', latitude: 40.4168, longitude: -3.7038 },
  { id: 'city-london', label: 'London, United Kingdom', city: 'London', country: 'United Kingdom', type: 'city', latitude: 51.5072, longitude: -0.1276 },
  { id: 'city-budapest', label: 'Budapest, Hungary', city: 'Budapest', country: 'Hungary', type: 'city', latitude: 47.4979, longitude: 19.0402 },
  { id: 'city-prague', label: 'Prague, Czech Republic', city: 'Prague', country: 'Czech Republic', type: 'city', latitude: 50.0755, longitude: 14.4378 },
  { id: 'city-athens', label: 'Athens, Greece', city: 'Athens', country: 'Greece', type: 'city', latitude: 37.9838, longitude: 23.7275 },
]

const hubLocations: SearchLocation[] = [
  { id: 'hub-sofia-bus', label: 'Sofia Bus Terminal, Bulgaria', city: 'Sofia', country: 'Bulgaria', type: 'bus_terminal', latitude: 42.7114, longitude: 23.3217 },
  { id: 'hub-brussels-midi', label: 'Brussels Midi, Belgium', city: 'Brussels', country: 'Belgium', type: 'train_station', latitude: 50.8357, longitude: 4.3365 },
  { id: 'hub-amsterdam-centraal', label: 'Amsterdam Centraal, Netherlands', city: 'Amsterdam', country: 'Netherlands', type: 'train_station', latitude: 52.3791, longitude: 4.8994 },
  { id: 'hub-dusseldorf-hbf', label: 'Dusseldorf Hbf, Germany', city: 'Dusseldorf', country: 'Germany', type: 'train_station', latitude: 51.2203, longitude: 6.7946 },
  { id: 'hub-vienna-hbf', label: 'Vienna Hbf, Austria', city: 'Vienna', country: 'Austria', type: 'train_station', latitude: 48.185, longitude: 16.3768 },
  { id: 'hub-budapest-keleti', label: 'Budapest Keleti, Hungary', city: 'Budapest', country: 'Hungary', type: 'train_station', latitude: 47.5003, longitude: 19.0839 },
]

const airportLocations: SearchLocation[] = openFlightsAirports.map((airport) => ({
  id: `airport-${airport.iata.toLowerCase()}`,
  label: `${airport.iata} ${airport.name}, ${airport.country}`,
  city: airport.city,
  country: airport.country,
  type: 'airport',
  code: airport.iata,
  latitude: airport.latitude,
  longitude: airport.longitude,
}))

export const knownLocations = [...cityLocations, ...airportLocations, ...hubLocations]

export const searchKnownLocations = (query: string) => {
  const value = query.trim().toLowerCase()
  if (!value) return []
  return knownLocations
    .filter((location) =>
      [location.label, location.city, location.country, location.code ?? ''].some((item) =>
        item.toLowerCase().includes(value),
      ),
    )
    .slice(0, 6)
}
