export function DataSourceExplainer() {
  return (
    <section className="data-explainer" aria-label="Data source explanation">
      <h3>Data transparency</h3>
      <div>
        <span>Airport data: Live via OpenFlights</span>
        <span>Weather: Live via Open-Meteo when available</span>
        <span>Flight pricing: Estimated until official fare providers are connected</span>
        <span>Ground pricing: Estimated until official fare providers are connected</span>
        <span>Transfer times: Live with maps provider, otherwise estimated</span>
      </div>
    </section>
  )
}
