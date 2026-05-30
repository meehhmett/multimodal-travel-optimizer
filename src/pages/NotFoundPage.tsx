export function NotFoundPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <main className="text-page not-found">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <button type="button" className="primary-cta" onClick={() => onNavigate('/')}>
        Go home
      </button>
    </main>
  )
}
