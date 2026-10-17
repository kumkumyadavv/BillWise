import { LogOut, UserCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { Card, PageHeader } from '../components/Ui.jsx'

export default function AccountPage() {
  const { user, logout } = useAuth()

  return (
    <div>
      <PageHeader title="Account" subtitle="Manage your account profile and session." />

      <Card className="max-w-xl">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-200">
            <UserCircle2 className="h-7 w-7" />
          </span>
          <div>
            <div className="text-xl font-semibold text-white">{user?.name || 'Customer'}</div>
            <div className="text-sm text-slate-400">{user?.email || 'No email available'}</div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
          <div className="flex items-center justify-between py-2">
            <span>Authentication</span>
            <span className="font-medium text-emerald-300">Bearer token</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Session</span>
            <span className="font-medium text-white">Active</span>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-slate-600 hover:bg-slate-800"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </Card>
    </div>
  )
}
