import type { LocationNode } from '../../types/route'

export interface OpenFlightsAirport {
  id: number
  name: string
  city: string
  country: string
  iata: string
  latitude: number
  longitude: number
}

export const openFlightsAirports: OpenFlightsAirport[] = [
  { id: 1701, name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', iata: 'IST', latitude: 41.2753, longitude: 28.7519 },
  { id: 4317, name: 'Sabiha Gokcen International Airport', city: 'Istanbul', country: 'Turkey', iata: 'SAW', latitude: 40.8986, longitude: 29.3092 },
  { id: 1688, name: 'Esenboga Airport', city: 'Ankara', country: 'Turkey', iata: 'ESB', latitude: 40.1281, longitude: 32.9951 },
  { id: 1706, name: 'Izmir Adnan Menderes Airport', city: 'Izmir', country: 'Turkey', iata: 'ADB', latitude: 38.2924, longitude: 27.1569 },
  { id: 1687, name: 'Antalya Airport', city: 'Antalya', country: 'Turkey', iata: 'AYT', latitude: 36.8987, longitude: 30.8005 },
  { id: 1194, name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', iata: 'AMS', latitude: 52.3086, longitude: 4.7639 },
  { id: 585, name: 'Eindhoven Airport', city: 'Eindhoven', country: 'Netherlands', iata: 'EIN', latitude: 51.4501, longitude: 5.3745 },
  { id: 591, name: 'Rotterdam The Hague Airport', city: 'Rotterdam', country: 'Netherlands', iata: 'RTM', latitude: 51.9569, longitude: 4.4372 },
  { id: 302, name: 'Brussels Airport', city: 'Brussels', country: 'Belgium', iata: 'BRU', latitude: 50.9014, longitude: 4.4844 },
  { id: 304, name: 'Brussels South Charleroi Airport', city: 'Charleroi', country: 'Belgium', iata: 'CRL', latitude: 50.4592, longitude: 4.4538 },
  { id: 345, name: 'Dusseldorf Airport', city: 'Dusseldorf', country: 'Germany', iata: 'DUS', latitude: 51.2895, longitude: 6.7668 },
  { id: 344, name: 'Cologne Bonn Airport', city: 'Cologne', country: 'Germany', iata: 'CGN', latitude: 50.8659, longitude: 7.1427 },
  { id: 373, name: 'Dortmund Airport', city: 'Dortmund', country: 'Germany', iata: 'DTM', latitude: 51.5183, longitude: 7.6122 },
  { id: 340, name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', iata: 'FRA', latitude: 50.0379, longitude: 8.5622 },
  { id: 342, name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'Germany', iata: 'BER', latitude: 52.3667, longitude: 13.5033 },
  { id: 346, name: 'Munich Airport', city: 'Munich', country: 'Germany', iata: 'MUC', latitude: 48.3538, longitude: 11.7861 },
  { id: 3422, name: 'Hamburg Airport', city: 'Hamburg', country: 'Germany', iata: 'HAM', latitude: 53.6304, longitude: 9.9882 },
  { id: 1382, name: 'Paris Charles de Gaulle Airport', city: 'Paris', country: 'France', iata: 'CDG', latitude: 49.0097, longitude: 2.5479 },
  { id: 1386, name: 'Paris Orly Airport', city: 'Paris', country: 'France', iata: 'ORY', latitude: 48.7233, longitude: 2.3794 },
  { id: 1385, name: 'Paris Beauvais Airport', city: 'Beauvais', country: 'France', iata: 'BVA', latitude: 49.4544, longitude: 2.1128 },
  { id: 1399, name: 'Lille Airport', city: 'Lille', country: 'France', iata: 'LIL', latitude: 50.5633, longitude: 3.0869 },
  { id: 1335, name: 'Lyon Saint Exupery Airport', city: 'Lyon', country: 'France', iata: 'LYS', latitude: 45.7256, longitude: 5.0811 },
  { id: 1613, name: 'Vienna International Airport', city: 'Vienna', country: 'Austria', iata: 'VIE', latitude: 48.1103, longitude: 16.5697 },
  { id: 1612, name: 'Salzburg Airport', city: 'Salzburg', country: 'Austria', iata: 'SZG', latitude: 47.7933, longitude: 13.0043 },
  { id: 1678, name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', iata: 'ZRH', latitude: 47.4647, longitude: 8.5492 },
  { id: 1681, name: 'EuroAirport Basel Mulhouse Freiburg', city: 'Basel', country: 'Switzerland', iata: 'BSL', latitude: 47.59, longitude: 7.5292 },
  { id: 1665, name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', iata: 'GVA', latitude: 46.2381, longitude: 6.1089 },
  { id: 1524, name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', iata: 'MXP', latitude: 45.63, longitude: 8.7231 },
  { id: 1525, name: 'Milan Bergamo Airport', city: 'Milan', country: 'Italy', iata: 'BGY', latitude: 45.6739, longitude: 9.7042 },
  { id: 1555, name: 'Rome Fiumicino Airport', city: 'Rome', country: 'Italy', iata: 'FCO', latitude: 41.8003, longitude: 12.2389 },
  { id: 1551, name: 'Venice Marco Polo Airport', city: 'Venice', country: 'Italy', iata: 'VCE', latitude: 45.5053, longitude: 12.3519 },
  { id: 1218, name: 'Barcelona El Prat Airport', city: 'Barcelona', country: 'Spain', iata: 'BCN', latitude: 41.2971, longitude: 2.0785 },
  { id: 1229, name: 'Madrid Barajas Airport', city: 'Madrid', country: 'Spain', iata: 'MAD', latitude: 40.4719, longitude: -3.5626 },
  { id: 1246, name: 'Valencia Airport', city: 'Valencia', country: 'Spain', iata: 'VLC', latitude: 39.4893, longitude: -0.4816 },
  { id: 507, name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', iata: 'LHR', latitude: 51.4700, longitude: -0.4543 },
  { id: 502, name: 'London Gatwick Airport', city: 'London', country: 'United Kingdom', iata: 'LGW', latitude: 51.1537, longitude: -0.1821 },
  { id: 548, name: 'London Stansted Airport', city: 'London', country: 'United Kingdom', iata: 'STN', latitude: 51.8850, longitude: 0.2350 },
  { id: 478, name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom', iata: 'MAN', latitude: 53.3537, longitude: -2.2750 },
  { id: 1195, name: 'Sofia Airport', city: 'Sofia', country: 'Bulgaria', iata: 'SOF', latitude: 42.6967, longitude: 23.4114 },
  { id: 1657, name: 'Bucharest Henri Coanda Airport', city: 'Bucharest', country: 'Romania', iata: 'OTP', latitude: 44.5711, longitude: 26.0850 },
  { id: 1739, name: 'Belgrade Nikola Tesla Airport', city: 'Belgrade', country: 'Serbia', iata: 'BEG', latitude: 44.8184, longitude: 20.3091 },
  { id: 1489, name: 'Budapest Ferenc Liszt Airport', city: 'Budapest', country: 'Hungary', iata: 'BUD', latitude: 47.4298, longitude: 19.2611 },
  { id: 1587, name: 'Prague Vaclav Havel Airport', city: 'Prague', country: 'Czech Republic', iata: 'PRG', latitude: 50.1008, longitude: 14.26 },
  { id: 679, name: 'Warsaw Chopin Airport', city: 'Warsaw', country: 'Poland', iata: 'WAW', latitude: 52.1657, longitude: 20.9671 },
  { id: 669, name: 'Krakow John Paul II Airport', city: 'Krakow', country: 'Poland', iata: 'KRK', latitude: 50.0777, longitude: 19.7848 },
  { id: 3941, name: 'Athens International Airport', city: 'Athens', country: 'Greece', iata: 'ATH', latitude: 37.9364, longitude: 23.9445 },
  { id: 1486, name: 'Thessaloniki Airport', city: 'Thessaloniki', country: 'Greece', iata: 'SKG', latitude: 40.5197, longitude: 22.9709 },
]

const toRad = (value: number) => (value * Math.PI) / 180

export const distanceKm = (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) => {
  const earthRadiusKm = 6371
  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h))
}

export const airportToNode = (airport: OpenFlightsAirport): LocationNode => ({
  id: `airport-${airport.iata.toLowerCase()}`,
  name: airport.name,
  city: airport.city,
  country: airport.country,
  code: airport.iata,
  latitude: airport.latitude,
  longitude: airport.longitude,
  type: 'airport',
})

export const airportsByCity = (city: string) =>
  openFlightsAirports.filter((airport) => airport.city.toLowerCase() === city.trim().toLowerCase())

export const nearbyAirports = (latitude: number, longitude: number, radiusKm: number) =>
  openFlightsAirports
    .map((airport) => ({ airport, distance: distanceKm({ latitude, longitude }, airport) }))
    .filter((item) => item.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .map((item) => item.airport)

export const candidateArrivalAirports = (city: string) => {
  const cityAirports = airportsByCity(city)
  const center = cityAirports[0] ?? openFlightsAirports.find((airport) => airport.city === city)
  if (!center) return []
  return nearbyAirports(center.latitude, center.longitude, city.toLowerCase() === 'amsterdam' ? 230 : 180)
}

export const discoverCandidateArrivalAirports = (
  destination: { latitude: number; longitude: number },
  radiusKm: number,
) =>
  openFlightsAirports
    .map((airport) => ({ airport, distanceKm: distanceKm(destination, airport) }))
    .filter((item) => item.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
