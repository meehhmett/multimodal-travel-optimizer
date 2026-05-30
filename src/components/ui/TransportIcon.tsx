import { transportIcons } from '../../constants/transport'
import type { TransportType } from '../../types/route'

export function TransportIcon({ type }: { type: TransportType }) {
  const Icon = transportIcons[type]
  return <Icon size={17} aria-label={type} />
}
