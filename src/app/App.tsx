import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Brand } from '../components/layout/Brand'
import { PublicShell } from '../components/layout/PublicShell'
import { DataSourceExplainer } from '../components/ui/DataSourceExplainer'
import { EstimatedPriceNotice } from '../components/ui/EstimatedPriceNotice'
import { emptySearchCriteria } from '../constants/searchDefaults'
import { ResultsPanel } from '../features/results/ResultsPanel'
import { RouteDetailsModal } from '../features/routeDetails/RouteDetailsModal'
import { SearchGuideCard } from '../features/search/SearchGuideCard'
import { SearchPanel } from '../features/search/SearchPanel'
import { ContactPage } from '../pages/ContactPage'
import { LandingPage } from '../pages/LandingPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PrivacyPage } from '../pages/PrivacyPage'
import { TermsPage } from '../pages/TermsPage'
import { resolveRouteProviders } from '../services/providers/providerRegistry'
import type { CandidateAirport } from '../services/providers/types'
import { optimizeRoutes } from '../services/routeEngine'
import type { RouteDataSource, RouteOption, SearchCriteria, SortMode } from '../types/route'
import { clampSearchCriteria, validateSearchCriteria } from '../utils/searchValidation'

const knownPaths = new Set(['/', '/search', '/privacy', '/terms', '/contact'])

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [draftCriteria, setDraftCriteria] = useState<SearchCriteria>(emptySearchCriteria)
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>('balanced')
  const [activeRoute, setActiveRoute] = useState<RouteOption | null>(null)
  const [routes, setRoutes] = useState<RouteOption[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [candidateAirports, setCandidateAirports] = useState<CandidateAirport[]>([])
  const [dataSource, setDataSource] = useState<RouteDataSource>('demo')
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const validationWarnings = useMemo(() => validateSearchCriteria(draftCriteria), [draftCriteria])
  const isSearchValid = validationWarnings.length === 0

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (!searchCriteria) return
    let isCurrent = true
    setIsLoading(true)
    resolveRouteProviders(searchCriteria)
      .then((result) => {
        if (!isCurrent) return
        setRoutes(optimizeRoutes(searchCriteria, result.providers, sortMode))
        setWarnings(result.warnings)
        setDataSource(result.dataSource)
        setCandidateAirports(result.candidateAirports)
      })
      .catch(() => {
        if (!isCurrent) return
        setRoutes([])
        setWarnings(['Provider registry failed; no routes available.'])
        setDataSource('demo')
        setCandidateAirports([])
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })
    return () => {
      isCurrent = false
    }
  }, [searchCriteria, sortMode])

  const updateCriteria = <K extends keyof SearchCriteria>(key: K, value: SearchCriteria[K]) =>
    setDraftCriteria((current) => {
      const next = clampSearchCriteria({ ...current, [key]: value })
      return key === 'departureDate' && next.returnDate < next.departureDate
        ? { ...next, returnDate: next.departureDate }
        : next
    })

  const runSearch = () => {
    const next = clampSearchCriteria(draftCriteria)
    if (validateSearchCriteria(next).length > 0) return
    setHasSearched(true)
    setSearchCriteria({
      ...next,
      originCity: next.selectedOrigin?.city ?? next.originCity,
      destinationCity: next.selectedDestination?.city ?? next.destinationCity,
    })
    if (path !== '/search') navigate('/search')
  }

  const clearSearch = () => {
    setDraftCriteria(emptySearchCriteria)
    setSearchCriteria(null)
    setRoutes([])
    setWarnings([])
    setCandidateAirports([])
    setActiveRoute(null)
    setDataSource('demo')
    setHasSearched(false)
    setIsLoading(false)
  }

  const navigate = (nextPath: string) => {
    window.history.pushState(null, '', nextPath)
    setPath(nextPath)
  }

  const searchPage = (
    <>
      <main className="app-shell search-shell">
        <aside className="sidebar">
          <Brand />
          <SearchPanel
            criteria={draftCriteria}
            validationWarnings={validationWarnings}
            isValid={isSearchValid}
            isLoading={isLoading}
            onChange={updateCriteria}
            onSearch={runSearch}
            onClear={clearSearch}
          />
          <EstimatedPriceNotice />
        </aside>

        {hasSearched && searchCriteria ? (
          <ResultsPanel
            routes={routes}
            originCity={searchCriteria.originCity}
            destinationCity={searchCriteria.destinationCity}
            sortMode={sortMode}
            dataSource={dataSource}
            warnings={warnings}
            isLoading={isLoading}
            candidateAirports={candidateAirports}
            onSortChange={setSortMode}
            onOpenDetails={setActiveRoute}
          />
        ) : (
          <section className="results-area">
            <SearchGuideCard />
          </section>
        )}

        {activeRoute && <RouteDetailsModal route={activeRoute} onClose={() => setActiveRoute(null)} />}
      </main>
      <DataSourceExplainer />
    </>
  )

  const page = (() => {
    if (path === '/') return <LandingPage onNavigate={navigate} />
    if (path === '/search') return searchPage
    if (path === '/privacy') return <PrivacyPage />
    if (path === '/terms') return <TermsPage />
    if (path === '/contact') return <ContactPage />
    return <NotFoundPage onNavigate={navigate} />
  })()

  return (
    <PublicShell currentPath={knownPaths.has(path) ? path : ''} onNavigate={navigate}>
      {page}
    </PublicShell>
  )
}

export default App
