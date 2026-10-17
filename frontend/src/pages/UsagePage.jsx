import { useEffect, useState } from 'react'
import { BarChart3, CheckCircle2, PlusCircle } from 'lucide-react'
import { apiRequest, formatApiError } from '../services/api.js'
import { ActionMessage, Card, EmptyState, PageHeader } from '../components/Ui.jsx'
import { formatDateTime } from '../utils/formatDate.js'

const initialForm = { event_id: '', endpoint: '', quantity: '1' }

export default function UsagePage() {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const data = await apiRequest('/usage/me', { auth: true })
        if (isMounted) setHistory(data)
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

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const payload = {
      event_id: form.event_id.trim(),
      endpoint: form.endpoint.trim(),
      quantity: Number(form.quantity || 1),
    }

    if (!payload.event_id || !payload.endpoint || payload.quantity < 1) {
      setError('Event ID, endpoint, and quantity are required.')
      return
    }

    try {
      setSaving(true)
      const result = await apiRequest('/usage/', {
        method: 'POST',
        body: payload,
        auth: true,
      })

      setHistory((current) => [result, ...current])
      setForm(initialForm)
      setSuccess('Usage event recorded successfully.')
    } catch (apiError) {
      setError(formatApiError(apiError))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Usage" subtitle="Capture application usage and review recent activity." />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <PlusCircle className="h-5 w-5 text-cyan-300" />
            Submit usage event
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-200">Event ID</span>
              <input
                type="text"
                name="event_id"
                value={form.event_id}
                onChange={handleChange}
                placeholder="evt_123456"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-200">Endpoint</span>
              <input
                type="text"
                name="endpoint"
                value={form.endpoint}
                onChange={handleChange}
                placeholder="/v1/requests"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-200">Quantity</span>
              <input
                type="number"
                min="1"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                required
              />
            </label>

            {error ? <ActionMessage type="error">{error}</ActionMessage> : null}
            {success ? <ActionMessage type="success">{success}</ActionMessage> : null}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Recording event…' : 'Record usage'}
            </button>
          </form>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <BarChart3 className="h-5 w-5 text-cyan-300" />
            Recent usage history
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-14 animate-pulse rounded-xl border border-slate-800 bg-slate-950/60" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <EmptyState title="No recorded usage" description="No usage events are available yet for this account." />
          ) : (
            <div className="space-y-3">
              {history.map((event) => (
                <div key={event.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5">
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
          )}
        </Card>
      </div>
    </div>
  )
}
