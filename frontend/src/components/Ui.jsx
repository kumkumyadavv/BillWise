import { CheckCircle2, CircleAlert, Clock3 } from 'lucide-react'

export function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Card({ children, className = '' }) {
  return (
    <div className={cx('rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-[0_0_0_1px_rgba(15,23,42,0.2)]', className)}>
      {children}
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function StatCard({ label, value, hint, accent = 'cyan' }) {
  const accentStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-200 ring-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-200 ring-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-200 ring-amber-500/20',
    violet: 'bg-violet-500/10 text-violet-200 ring-violet-500/20',
  }

  return (
    <Card className="p-4">
      <div className={cx('mb-3 inline-flex rounded-xl px-2.5 py-1.5 text-xs font-medium ring-1', accentStyles[accent] || accentStyles.cyan)}>
        {label}
      </div>
      <div className="text-2xl font-semibold text-white">{value}</div>
      {hint ? <div className="mt-2 text-xs text-slate-400">{hint}</div> : null}
    </Card>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <Card className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
      <div>
        <div className="text-lg font-semibold text-white">{title}</div>
        {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
      </div>
      {action}
    </Card>
  )
}

export function StatusBadge({ status }) {
  const normalized = String(status || '').toLowerCase()
  const tones = {
    active: 'bg-emerald-500/12 text-emerald-200 ring-emerald-500/25',
    pending: 'bg-amber-500/12 text-amber-200 ring-amber-500/25',
    cancelled: 'bg-slate-500/12 text-slate-200 ring-slate-500/30',
    inactive: 'bg-slate-500/12 text-slate-200 ring-slate-500/30',
    paid: 'bg-emerald-500/12 text-emerald-200 ring-emerald-500/25',
    draft: 'bg-violet-500/12 text-violet-200 ring-violet-500/25',
    default: 'bg-cyan-500/10 text-cyan-200 ring-cyan-500/20',
  }

  const tone = tones[normalized] || tones.default
  return (
    <span className={cx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 capitalize', tone)}>
      {normalized || 'unknown'}
    </span>
  )
}

export function ActionMessage({ type = 'error', children }) {
  const tones = {
    error: 'border-red-500/30 bg-red-500/10 text-red-200',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
    info: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200',
  }

  return (
    <div className={cx('mt-4 rounded-xl border px-3 py-2 text-sm', tones[type] || tones.info)}>
      {children}
    </div>
  )
}
