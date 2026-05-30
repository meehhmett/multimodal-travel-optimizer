import type { RouteOption, SearchCriteria } from '../../types/route'

export const filterRoutes = (routes: RouteOption[], criteria: SearchCriteria) =>
  routes
    .filter((route) => route.totalDurationMinutes <= criteria.maxTravelHours * 60)
    .filter((route) => route.transferCount <= criteria.maxTransfers)
