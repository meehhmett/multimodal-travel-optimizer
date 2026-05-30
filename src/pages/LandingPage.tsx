import { ArrowRight, CalendarDays, MapPinned, PlaneTakeoff, ShieldCheck } from 'lucide-react'
import { DataSourceExplainer } from '../components/ui/DataSourceExplainer'
import { EstimatedPriceNotice } from '../components/ui/EstimatedPriceNotice'

export function LandingPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <main>
      <section className="landing-hero">
        <div className="route-visual" aria-hidden="true">
          <span className="node ist">IST</span>
          <span className="node sof">SOF</span>
          <span className="node bru">BRU</span>
          <span className="node ams">AMS</span>
          <span className="route-line line-a" />
          <span className="route-line line-b" />
          <span className="route-line line-c" />
        </div>
        <div className="hero-copy">
          <h1>Multimodal route planning across flights, rail, buses, ferries, and transfers.</h1>
          <p>
            RouteWeave compares direct and multi-stop combinations, nearby airports, neighboring countries, flexible
            dates, and transparent live versus estimated data.
          </p>
          <button type="button" className="primary-cta" onClick={() => onNavigate('/search')}>
            Start searching <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <section className="feature-band">
        <article>
          <PlaneTakeoff />
          <h3>Not flight-first</h3>
          <p>Every mode can start or complete a route, including train, bus, ferry, rideshare, and local transfer.</p>
        </article>
        <article>
          <MapPinned />
          <h3>Nearby airport logic</h3>
          <p>Discover airports around the destination, including useful cross-border alternatives.</p>
        </article>
        <article>
          <CalendarDays />
          <h3>Flexible dates</h3>
          <p>Explore nearby date pairs without creating impossible or past travel ranges.</p>
        </article>
        <article>
          <ShieldCheck />
          <h3>Clear sources</h3>
          <p>See when airport and weather data are live and when fares or transfers are estimated.</p>
        </article>
      </section>
      <DataSourceExplainer />
      <EstimatedPriceNotice />
    </main>
  )
}
