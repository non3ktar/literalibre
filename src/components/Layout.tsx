import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-[hsl(220_14%_18%)] py-8 text-center text-sm text-[hsl(220_10%_45%)]">
        <p>LiteraLibre . 2026 . CC</p>
      </footer>
    </div>
  )
}
