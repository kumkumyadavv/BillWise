import { useEffect, useState } from 'react'
import { CheckCircle2, CircleAlert, Sparkles } from 'lucide-react'
import { apiRequest, formatApiError } from '../services/api.js'
import { ActionMessage, Card, EmptyState, PageHeader, StatusBadge } from '../components/Ui.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'

export default function PlansPage() {
  const [plans, setPlans] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        setLoading(true)
        setError('')
        const [planList, subscriptionList] = await Promise.all([
          apiRequest('/plans/', { auth: true }),
          apiRequest('/subscriptions/me', { auth: true }),
        ])

        if (!isMounted) return
        setPlans(planList)
        setSubscriptions(subscriptionList)
      } catch (apiError) {
        if (isMounted) {
          setError(formatApiError(apiError))
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  const subscribe = async (plan) => {
    try {
      setSubmittingId(plan.id)
      setNotice('')
      setError('')
      const result = await apiRequest('/subscriptions/', {
        method: 'POST',
        body: { plan_id: plan.id },
        auth: true,
      })

      setSubscriptions((current) => [result, ...current])
      setNotice(`Subscribed to ${plan.name} successfully.`)
    } catch (apiError) {
      setError(formatApiError(apiError))
    } finally {
      setSubmittingId(null)
    }
  }

  const activePlanId = subscriptions.find((sub) => sub.status === 'active')?.plan_id

  return (
    <div>
      <PageHeader
        title="Plans"
        subtitle="Choose a billing plan that matches your API usage needs."
      />

      {notice ? <ActionMessage type="success">{notice}</ActionMessage> : null}
      {error ? <ActionMessage type="error">{error}</ActionMessage> : null}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <EmptyState title="No plans available" description="The API does not currently expose any billing plans." />
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = activePlanId === plan.id
            return (
              <Card key={plan.id} className="flex flex-col justify-between gap-5">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-200 ring-1 ring-cyan-500/20">
                      <Sparkles className="h-3.5 w-3.5" />
                      {plan.name}
                    </div>
                    {isCurrent ? <StatusBadge status="active" /> : null}
                  </div>

                  <div className="mt-4 text-3xl font-semibold text-white">{formatCurrency(plan.monthly_price)}</div>
                  <div className="mt-1 text-sm text-slate-400">per month</div>

                  <div className="mt-5 space-y-3 text-sm text-slate-300">
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                      <span>Included requests</span>
                      <span className="font-medium text-white">{Number(plan.included_requests).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
                      <span>Overage rate</span>
                      <span className="font-medium text-white">{formatCurrency(plan.request_overage_price)} / request</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => subscribe(plan)}
                  disabled={submittingId === plan.id || isCurrent}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${isCurrent ? 'cursor-default border border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70'}`}
                >
                  {submittingId === plan.id ? 'Subscribing…' : isCurrent ? 'Current plan' : 'Subscribe'}
                </button>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
