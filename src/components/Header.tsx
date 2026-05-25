import { Link, useLocation } from 'react-router-dom'
import { PenLine, Settings, FileText, Home } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { cn } from '../lib/cn'

const nav = [
  { to: '/', label: 'Blog', icon: Home },
  ...(import.meta.env.DEV
    ? [
        { to: '/write', label: 'Escrever', icon: PenLine },
        { to: '/drafts', label: 'Rascunhos', icon: FileText },
        { to: '/settings', label: 'Config', icon: Settings },
      ]
    : []),
]

export function Header() {
  const { pathname } = useLocation()
  const { settings } = useSettings()

  return (
    <header className="sticky top-0 z-40 glass border-b border-[hsl(220_14%_18%_/0.6)]">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="min-w-0 group">
          <span className="block truncate font-semibold text-[hsl(220_15%_96%)] group-hover:text-[hsl(195_70%_75%)] transition-colors duration-150">
            {settings.title}
          </span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Navegação principal">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150',
                  active
                    ? 'bg-[hsl(195_60%_52%_/0.15)] text-[hsl(195_70%_75%)]'
                    : 'text-[hsl(220_12%_60%)] hover:bg-[hsl(220_16%_14%)] hover:text-[hsl(220_15%_85%)]'
                )}
              >
                <Icon size={16} aria-hidden />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
