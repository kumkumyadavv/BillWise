import { useEffect, useState } from 'react'
import { ChevronDown, FileText, ReceiptText } from 'lucide-react'
import { apiRequest, formatApiError } from '../services/api.js'
import { ActionMessage, Card, EmptyState, PageHeader, StatusBadge } from '../components/Ui.jsx'
import { formatCurrency } from '../utils/formatCurrency.js'
import { formatDateTime } from '../utils/formatDate.js'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [generating, setGenerating] = useState(false)
  const [expandedInvoiceId, setExpandedInvoiceId] = useState(null)
  const [itemsByInvoice, setItemsByInvoice] = useState({})

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        setLoading(true)
        setError('')
        const data = await apiRequest('/invoices/me', { auth: true })
        if (isMounted) setInvoices(data)
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

  const generateInvoice = async () => {
    try {
      setGenerating(true)
      setActionMessage('')
      setError('')
      const invoice = await apiRequest('/invoices/generate', {
        method: 'POST',
        auth: true,
      })
      setInvoices((current) => [invoice, ...current])
      setActionMessage('Invoice generated successfully.')
    } catch (apiError) {
      setError(formatApiError(apiError))
    } finally {
      setGenerating(false)
    }
  }

  const fetchItems = async (invoiceId) => {
    if (itemsByInvoice[invoiceId]) {
      setExpandedInvoiceId((current) => (current === invoiceId ? null : invoiceId))
      return
    }

    try {
      const items = await apiRequest(`/invoices/${invoiceId}/items`, { auth: true })
      setItemsByInvoice((current) => ({ ...current, [invoiceId]: items }))
      setExpandedInvoiceId(invoiceId)
    } catch (apiError) {
      setError(formatApiError(apiError))
    }
  }

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="Review invoice history and generate billing statements when available."
        action={
          <button
            type="button"
            onClick={generateInvoice}
            disabled={generating}
            className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {generating ? 'Generating…' : 'Generate Invoice'}
          </button>
        }
      />

      {actionMessage ? <ActionMessage type="success">{actionMessage}</ActionMessage> : null}
      {error ? <ActionMessage type="error">{error}</ActionMessage> : null}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70" />
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <EmptyState title="No invoices found" description="No billing statements are available for this account yet." />
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="overflow-hidden">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-200">
                    <ReceiptText className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-lg font-semibold text-white">Invoice #{invoice.id}</div>
                    <div className="text-sm text-slate-400">{formatDateTime(invoice.created_at)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xl font-semibold text-white">{formatCurrency(invoice.total_amount)}</div>
                    <div className="text-xs text-slate-400">Subscription #{invoice.subscription_id}</div>
                  </div>
                  <StatusBadge status={invoice.status} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
                <span className="text-sm text-slate-400">Billing period</span>
                <span className="text-sm font-medium text-white">{invoice.period_start ? formatDateTime(invoice.period_start) : '—'} → {invoice.period_end ? formatDateTime(invoice.period_end) : '—'}</span>
              </div>

              <button
                type="button"
                onClick={() => fetchItems(invoice.id)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
              >
                <ChevronDown className={`h-4 w-4 transition ${expandedInvoiceId === invoice.id ? 'rotate-180' : ''}`} />
                View line items
              </button>

              {expandedInvoiceId === invoice.id && itemsByInvoice[invoice.id] ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                      <tr>
                        <th className="px-3 py-2 font-medium">Description</th>
                        <th className="px-3 py-2 font-medium">Qty</th>
                        <th className="px-3 py-2 font-medium text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsByInvoice[invoice.id].map((item) => (
                        <tr key={item.id} className="border-b border-slate-800 last:border-b-0">
                          <td className="px-3 py-2 text-slate-200">{item.description}</td>
                          <td className="px-3 py-2 text-slate-300">{item.quantity}</td>
                          <td className="px-3 py-2 text-right text-slate-100">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
