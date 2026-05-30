import { Brand } from './Brand'
import type { ReactNode } from 'react'

interface PublicShellProps {
  currentPath: string
  onNavigate: (path: string) => void
  children: ReactNode
}

const links = [
  { path: '/', label: 'Home' },
  { path: '/search', label: 'Search' },
  { path: '/privacy', label: 'Privacy' },
  { path: '/terms', label: 'Terms' },
  { path: '/contact', label: 'Contact' },
]

export function PublicShell({ currentPath, onNavigate, children }: PublicShellProps) {
  return (
    <div className="public-shell">
      <header className="site-header">
        <button type="button" className="brand-button" onClick={() => onNavigate('/')}>
          <Brand />
        </button>
        <nav className="site-nav" aria-label="Main navigation">
          {links.map((link) => (
            <button
              type="button"
              className={currentPath === link.path ? 'active' : ''}
              onClick={() => onNavigate(link.path)}
              key={link.path}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </header>
      {children}
    </div>
  )
}
