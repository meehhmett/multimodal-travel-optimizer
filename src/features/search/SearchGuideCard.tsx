import { CalendarDays, Filter, MapPinned, ShieldCheck } from 'lucide-react'
import { EstimatedPriceNotice } from '../../components/ui/EstimatedPriceNotice'

export function SearchGuideCard() {
  return (
    <section className="search-guide-card">
      <span className="eyebrow">Route search guide</span>
      <h2>Build a route from real airport discovery and transparent estimates.</h2>
      <div className="guide-grid">
        <article>
          <MapPinned />
          <strong>Choose cities</strong>
          <p>Enter origin and destination, then compare nearby arrival airports across borders.</p>
        </article>
        <article>
          <CalendarDays />
          <strong>Set dates</strong>
          <p>Select travel dates and enable flexible dates to test nearby valid ranges.</p>
        </article>
        <article>
          <Filter />
          <strong>Use filters</strong>
          <p>Refine transport types, max transfers, duration, and route priority.</p>
        </article>
        <article>
          <ShieldCheck />
          <strong>Read labels</strong>
          <p>Cards include estimated prices, duration, risk, comfort, weather, and data source labels.</p>
        </article>
      </div>
      <EstimatedPriceNotice />
    </section>
  )
}
