import { useEffect, useState } from 'react'
import { CalendarRange, CreditCard, Link2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiRequest, formatApiError } from '../services/api.js'
import { Card, EmptyState, PageHeader, StatusBadge } from '../components/Ui.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'
import { formatDate } from '../utils/formatDate.js'

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        setLoading(true)
        setError('')
        const data = await apiRequest('/subscriptions/me', { auth: true })
        if (isMounted) setSubscriptions(data)
      } catch (apiError) {
        if (isMounted) setError(formatApiError(apiError))
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div>
      <PageHeader title="Subscription" subtitle="Your current plan and account billing details." />

      {error ? <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70" />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <EmptyState
          title="No subscription found"
          description="You do not currently have an active subscription. Choose a plan to get started."
          action={<Link to="/plans" className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950">View plans</Link>}
        />
      ) : (
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id} className="p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-200">
                    <CreditCard className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-lg font-semibold text-white">Plan #{subscription.plan_id}</div>
                    <div className="text-sm text-slate-400">Subscription ID #{subscription.id}</div>
                  </div>
                </div>
                <StatusBadge status={subscription.status} />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                    <CalendarRange className="h-3.5 w-3.5" />
                    Started at
                  </div>
                  <div className="mt-2 text-base font-medium text-white">{formatDate(subscription.started_at)}</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                    <CreditCard className="h-3.5 w-3.5" />
                    Plan ID
                  </div>
                  <div className="mt-2 text-base font-medium text-white">#{subscription.plan_id}</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                    <Link2 className="h-3.5 w-3.5" />
                    Status
                  </div>
                  <div className="mt-2 text-base font-medium text-white">{subscription.status}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
