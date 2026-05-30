export const hours = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`

export const money = (value: number) => `€${Math.round(value)}`

export const dateLabel = (date: string) =>
  new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${date}T00:00:00Z`))

export const timeLabel = (iso: string) =>
  new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
