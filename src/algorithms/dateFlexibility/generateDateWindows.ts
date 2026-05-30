import type { DateWindow } from '../../types/route'

const toUtcDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10)

const todayIso = () => {
  const now = new Date()
  return toIsoDate(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())))
}

const addDays = (value: string, days: number) => {
  const date = toUtcDate(value)
  date.setUTCDate(date.getUTCDate() + days)
  return toIsoDate(date)
}

export const generateDateWindows = (
  departureDate: string,
  returnDate: string,
  flexible: boolean,
  flexDays = 2,
  minDate = todayIso(),
): DateWindow[] => {
  const safeReturnDate = returnDate < departureDate ? departureDate : returnDate
  if (!flexible) {
    return departureDate < minDate ? [] : [{ departureDate, returnDate: safeReturnDate }].filter(
      (window) => window.returnDate >= window.departureDate && window.returnDate >= minDate,
    )
  }

  const seen = new Set<string>()
  const windows: DateWindow[] = []

  for (let departureOffset = -flexDays; departureOffset <= flexDays; departureOffset += 1) {
    for (let returnOffset = -flexDays; returnOffset <= flexDays; returnOffset += 1) {
      const nextDeparture = addDays(departureDate, departureOffset)
      const nextReturn = addDays(safeReturnDate, returnOffset)
      if (nextDeparture < minDate || nextReturn < minDate || nextReturn < nextDeparture) continue
      const key = `${nextDeparture}:${nextReturn}`
      if (!seen.has(key)) {
        seen.add(key)
        windows.push({ departureDate: nextDeparture, returnDate: nextReturn })
      }
    }
  }

  return windows
}
