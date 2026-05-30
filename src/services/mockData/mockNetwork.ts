import type { DateWindow, LocationNode, RouteEdge, TransportType } from '../../types/route'

export const mockNodes: LocationNode[] = [
  { id: 'ist-city', name: 'Istanbul', city: 'Istanbul', type: 'city' },
  { id: 'ist-air', name: 'Istanbul Airport', city: 'Istanbul', type: 'airport' },
  { id: 'ist-bus', name: 'Esenler Bus Terminal', city: 'Istanbul', type: 'bus_terminal' },
  { id: 'ist-rail', name: 'Halkali Station', city: 'Istanbul', type: 'train_station' },
  { id: 'ist-port', name: 'Yenikapi Ferry Port', city: 'Istanbul', type: 'ferry_port' },
  { id: 'sof-city', name: 'Sofia', city: 'Sofia', type: 'city' },
  { id: 'sof-air', name: 'Sofia Airport', city: 'Sofia', type: 'airport' },
  { id: 'sof-bus', name: 'Sofia Central Bus', city: 'Sofia', type: 'bus_terminal' },
  { id: 'sof-rail', name: 'Sofia Central Station', city: 'Sofia', type: 'train_station' },
  { id: 'bru-air', name: 'Brussels Airport', city: 'Brussels', type: 'airport' },
  { id: 'bru-rail', name: 'Brussels Midi', city: 'Brussels', type: 'train_station' },
  { id: 'ams-city', name: 'Amsterdam', city: 'Amsterdam', type: 'city' },
  { id: 'ams-air', name: 'Schiphol Airport', city: 'Amsterdam', type: 'airport' },
  { id: 'ams-rail', name: 'Amsterdam Centraal', city: 'Amsterdam', type: 'train_station' },
  { id: 'ams-bus', name: 'Amsterdam Sloterdijk', city: 'Amsterdam', type: 'bus_terminal' },
  { id: 'ein-air', name: 'Eindhoven Airport', city: 'Eindhoven', type: 'airport' },
  { id: 'ein-rail', name: 'Eindhoven Centraal', city: 'Eindhoven', type: 'train_station' },
]

const time = (date: string, hhmm: string, addDays = 0) => {
  const next = new Date(`${date}T${hhmm}:00.000Z`)
  next.setUTCDate(next.getUTCDate() + addDays)
  return next.toISOString()
}

const edge = (
  id: string,
  from: string,
  to: string,
  type: TransportType,
  provider: string,
  dep: string,
  arr: string,
  durationMinutes: number,
  price: number,
  comfortScore: number,
  reliabilityScore: number,
  transferRisk: number,
  carbonScore: number,
): RouteEdge => ({
  id,
  from,
  to,
  transportType: type,
  provider,
  departureTime: dep,
  arrivalTime: arr,
  durationMinutes,
  price,
  comfortScore,
  reliabilityScore,
  transferRisk,
  carbonScore,
})

export const getMockEdges = (window: DateWindow) => {
  const d = window.departureDate
  const day = new Date(`${d}T00:00:00Z`).getUTCDate()
  const flexDiscount = day % 3 === 0 ? -28 : day % 2 === 0 ? -12 : 8

  return [
    edge('ist-local-air', 'ist-city', 'ist-air', 'local', 'Metro Istanbul', time(d, '06:15'), time(d, '07:05'), 50, 8, 68, 91, 8, 4),
    edge('ist-local-bus', 'ist-city', 'ist-bus', 'local', 'Metro Istanbul', time(d, '05:50'), time(d, '06:25'), 35, 5, 62, 88, 6, 3),
    edge('ist-local-rail', 'ist-city', 'ist-rail', 'local', 'Marmaray', time(d, '06:05'), time(d, '06:55'), 50, 4, 66, 90, 6, 2),
    edge('ist-local-port', 'ist-city', 'ist-port', 'local', 'Sehir Hatlari', time(d, '06:30'), time(d, '07:05'), 35, 4, 70, 86, 7, 1),
    edge('ist-ams-flight', 'ist-air', 'ams-air', 'flight', 'Anatolia Air', time(d, '09:05'), time(d, '12:45'), 220, 212 + flexDiscount, 78, 89, 16, 155),
    edge('ist-sof-bus', 'ist-bus', 'sof-bus', 'bus', 'BalkanCoach', time(d, '07:10'), time(d, '16:10'), 540, 42, 58, 84, 24, 34),
    edge('ist-sof-train', 'ist-rail', 'sof-rail', 'train', 'Balkan Rail', time(d, '07:40'), time(d, '19:00'), 680, 55, 70, 78, 26, 22),
    edge('ist-burgas-ferry', 'ist-port', 'sof-bus', 'ferry', 'Black Sea Link', time(d, '08:00'), time(d, '18:45'), 645, 63, 72, 73, 30, 18),
    edge('sof-local-air', 'sof-bus', 'sof-air', 'local', 'Sofia Metro', time(d, '17:15'), time(d, '17:50'), 35, 3, 65, 91, 7, 2),
    edge('sof-rail-air', 'sof-rail', 'sof-air', 'local', 'Sofia Metro', time(d, '19:35'), time(d, '20:10'), 35, 3, 65, 91, 7, 2),
    edge('sof-ams-flight', 'sof-air', 'ams-air', 'flight', 'Danube Wings', time(d, '19:25'), time(d, '21:55'), 150, 96 + flexDiscount, 74, 86, 19, 118),
    edge('sof-bru-flight', 'sof-air', 'bru-air', 'flight', 'EuroFly', time(d, '21:20'), time(d, '23:55'), 155, 88 + flexDiscount, 73, 84, 22, 112),
    edge('ist-bru-flight', 'ist-air', 'bru-air', 'flight', 'Anatolia Air', time(d, '10:15'), time(d, '13:55'), 220, 142 + flexDiscount, 77, 88, 17, 150),
    edge('bru-air-rail', 'bru-air', 'bru-rail', 'train', 'Belgian Rail', time(d, '14:35'), time(d, '14:55'), 20, 12, 76, 93, 6, 3),
    edge('bru-ams-train', 'bru-rail', 'ams-rail', 'train', 'EuroCity', time(d, '15:45'), time(d, '18:35'), 170, 46, 82, 91, 11, 18),
    edge('bru-ams-bus', 'bru-rail', 'ams-bus', 'bus', 'Lowlands Bus', time(d, '16:20'), time(d, '19:35'), 195, 24, 62, 83, 16, 24),
    edge('ist-ein-flight', 'ist-air', 'ein-air', 'flight', 'Pegasus Estimate', time(d, '12:10'), time(d, '15:40'), 210, 118 + flexDiscount, 70, 82, 19, 145),
    edge('ein-air-rail', 'ein-air', 'ein-rail', 'local', 'Airport Shuttle', time(d, '16:15'), time(d, '16:40'), 25, 6, 62, 89, 8, 2),
    edge('ein-ams-train', 'ein-rail', 'ams-rail', 'train', 'NS Intercity', time(d, '17:05'), time(d, '18:25'), 80, 23, 79, 92, 8, 9),
    edge('ein-ams-bus', 'ein-air', 'ams-bus', 'bus', 'Airport Express', time(d, '16:25'), time(d, '18:30'), 125, 18, 60, 85, 13, 15),
    edge('ams-air-city', 'ams-air', 'ams-city', 'train', 'NS Sprinter', time(d, '13:20'), time(d, '13:38'), 18, 6, 76, 94, 4, 2),
    edge('ams-rail-city', 'ams-rail', 'ams-city', 'local', 'GVB Tram', time(d, '18:50'), time(d, '19:02'), 12, 3, 68, 92, 4, 1),
    edge('ams-bus-city', 'ams-bus', 'ams-city', 'local', 'GVB Metro', time(d, '19:50'), time(d, '20:05'), 15, 3, 66, 90, 5, 1),
  ]
}
