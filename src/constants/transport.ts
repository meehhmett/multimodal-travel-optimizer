import { Bus, Car, MapPinned, Plane, Ship, Train } from 'lucide-react'
import type { TransportType } from '../types/route'

export const transportTypes: TransportType[] = ['flight', 'bus', 'train', 'ferry', 'rideshare', 'local']

export const transportIcons: Record<TransportType, typeof Plane> = {
  flight: Plane,
  bus: Bus,
  train: Train,
  ferry: Ship,
  rideshare: Car,
  local: MapPinned,
}
