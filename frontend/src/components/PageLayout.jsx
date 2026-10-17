import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeftRight, BarChart3, CreditCard, LayoutDashboard, LogOut, Menu, ReceiptText, ShieldCheck, Sparkles, UserCircle2, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const navigation = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/plans', label: 'Plans', icon: Sparkles },
  { to: '/subscription', label: 'Subscription', icon: CreditCard },
  { to: '/usage', label: 'Usage', icon: BarChart3 },
  { to: '/invoices', label: 'Invoices', icon: ReceiptText },
  { to: '/account', label: 'Account', icon: UserCircle2 },
]

export function AppShell({ children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="lg:hidden">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur-sm">
          <Link to="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-white">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-300">
              <ShieldCheck className="h-4 w-4" />
            </span>
            Bill<span className="text-cyan-300">Wise</span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-lg border border-slate-700 p-2 text-slate-200"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="border-b border-slate-800 bg-slate-950 px-4 py-3">
            <div className="space-y-1">
              {navigation.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-900'}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-3 rounded-xl border border-slate-700 px-3 py-2 text-left text-sm font-medium text-slate-200"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </nav>
        )}
      </div>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-5 lg:px-6">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_0_0_1px_rgba(148,163,184,0.05)]">
            <Link to="/dashboard" className="flex items-center gap-3 pb-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xl font-semibold text-white">Bill<span className="text-cyan-300">Wise</span></div>
                <div className="text-xs text-slate-400">Usage. Billing. Under control.</div>
              </div>
            </Link>

            <nav className="space-y-1 pt-3">
              {navigation.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-cyan-500/10 text-cyan-200 ring-1 ring-cyan-500/20' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-900"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 lg:hidden">
            <div className="text-sm text-slate-400">{location.pathname.replace('/', '').toUpperCase() || 'DASHBOARD'}</div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <ArrowLeftRight className="h-4 w-4" />
              BillWise
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
