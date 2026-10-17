import { useEffect, useMemo, useState } from 'react'
import { CreditCard, Files, Gauge, Landmark, ReceiptText, TrendingUp, Zap } from 'lucide-react'
import { apiRequest, formatApiError } from '../services/api.js'
import { Card, EmptyState, PageHeader, StatCard, StatusBadge } from '../components/Ui.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'
import { formatDate, formatDateTime } from '../utils/formatDate.js'
import { useAuth } from '../context/AuthContext.jsx'

const defaultSummary = {
  plans: [],
  subscription: null,
  usage: [],
  invoices: [],
  user: null,
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(defaultSummary)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        setLoading(true)
        setError('')

        const [plans, subscriptions, usage, invoices] = await Promise.all([
          apiRequest('/plans/', { auth: true }),
          apiRequest('/subscriptions/me', { auth: true }),
          apiRequest('/usage/me', { auth: true }),
          apiRequest('/invoices/me', { auth: true }),
        ])

        if (!isMounted) return

        const activeSub = Array.isArray(subscriptions) ? subscriptions.find((item) => item.status === 'active') || subscriptions[0] : null
        const currentPlan = Array.isArray(plans) && activeSub ? plans.find((plan) => plan.id === activeSub.plan_id) || null : null

        setSummary({
          plans,
          subscription: activeSub,
          usage,
          invoices,
          user: user || { name: 'Customer' },
          currentPlan,
        })
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
  }, [user])

  const usageTotal = useMemo(
    () => summary.usage.reduce((total, event) => total + Number(event.quantity || 0), 0),
    [summary.usage],
  )

  const activePlan = summary.currentPlan || summary.plans[0] || null
  const currentInvoice = summary.invoices[0] || null
  const remaining = activePlan ? Math.max(activePlan.included_requests - usageTotal, 0) : null
  const usagePercent = activePlan ? Math.min((usageTotal / Math.max(activePlan.included_requests, 1)) * 100, 100) : 0

  return (
    <div>
      <PageHeader
        title={`Welcome ${summary.user?.name || 'Customer'}`}
        subtitle="Your subscription, usage, and billing overview."
      />

      {error ? (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Plan" value={activePlan ? activePlan.name : 'No plan'} hint={activePlan ? formatCurrency(activePlan.monthly_price) + '/month' : 'Configure a subscription'} accent="cyan" />
            <StatCard label="Usage" value={usageTotal.toLocaleString()} hint={activePlan ? `${remaining ?? 0} remaining` : 'Not available'} accent="emerald" />
            <StatCard label="Status" value={summary.subscription ? summary.subscription.status : 'Inactive'} hint={summary.subscription ? 'Active subscription' : 'No active subscription'} accent="amber" />
            <StatCard label="Latest invoice" value={currentInvoice ? formatCurrency(currentInvoice.total_amount) : '—'} hint={currentInvoice ? currentInvoice.status : 'No invoice yet'} accent="violet" />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-cyan-200">Current plan</div>
                  <div className="mt-1 text-2xl font-semibold text-white">{activePlan ? activePlan.name : 'No active plan'}</div>
                </div>
                {summary.subscription ? <StatusBadge status={summary.subscription.status} /> : null}
              </div>

              {activePlan ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                      <div className="text-xs uppercase tracking-[0.14em] text-slate-500">Monthly price</div>
                      <div className="mt-2 text-xl font-semibold text-white">{formatCurrency(activePlan.monthly_price)}</div>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                      <div className="text-xs uppercase tracking-[0.14em] text-slate-500">Included requests</div>
                      <div className="mt-2 text-xl font-semibold text-white">{Number(activePlan.included_requests).toLocaleString()}</div>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                      <div className="text-xs uppercase tracking-[0.14em] text-slate-500">Overage rate</div>
                      <div className="mt-2 text-xl font-semibold text-white">{formatCurrency(activePlan.request_overage_price)} / request</div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
                      <span>Usage against plan allowance</span>
                      <span>{usageTotal.toLocaleString()} / {Number(activePlan.included_requests).toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400" style={{ width: `${Math.max(usagePercent, 8)}%` }} />
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState title="No subscription yet" description="Choose a plan to activate billing and tracking." action={<a href="/plans" className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950">Browse plans</a>} />
              )}
            </Card>

            <Card>
              <div className="flex items-center gap-2 text-sm font-medium text-cyan-200">
                <Landmark className="h-4 w-4" />
                Latest invoice
              </div>
              {currentInvoice ? (
                <>
                  <div className="mt-3 text-3xl font-semibold text-white">{formatCurrency(currentInvoice.total_amount)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <StatusBadge status={currentInvoice.status} />
                    <span className="text-sm text-slate-400">#{currentInvoice.id}</span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Created</span>
                      <span>{formatDateTime(currentInvoice.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Subscription</span>
                      <span>#{currentInvoice.subscription_id}</span>
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState title="No invoice yet" description="Generate an invoice after a subscription is active." />
              )}
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <Card>
              <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <Files className="h-5 w-5 text-cyan-300" />
                Recent invoices
              </div>
              {summary.invoices.length ? (
                <div className="space-y-3">
                  {summary.invoices.slice(0, 4).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5">
                      <div>
                        <div className="font-medium text-white">Invoice #{invoice.id}</div>
                        <div className="text-xs text-slate-400">{formatDateTime(invoice.created_at)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">{formatCurrency(invoice.total_amount)}</div>
                        <StatusBadge status={invoice.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No invoices" description="Once your billing period closes, invoices will appear here." />
              )}
            </Card>

            <Card>
              <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <TrendingUp className="h-5 w-5 text-cyan-300" />
                Recent usage
              </div>
              {summary.usage.length ? (
                <div className="space-y-3">
                  {summary.usage.slice(0, 4).map((event) => (
                    <div key={event.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5">
                      <div>
                        <div className="font-medium text-white">{event.endpoint}</div>
                        <div className="text-xs text-slate-400">{event.event_id}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">{event.quantity}</div>
                        <div className="text-xs text-slate-400">{formatDateTime(event.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No usage events yet" description="Usage data will appear here as your application calls the billing API." />
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
