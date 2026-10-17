import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { apiRequest, formatApiError } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { ActionMessage, Card } from '../components/Ui.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const email = form.email.trim()
    const password = form.password

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    setLoading(true)

    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      login(result.access_token, { email, name: email.split('@')[0] })
      navigate('/dashboard', { replace: true })
    } catch (apiError) {
      setError(formatApiError(apiError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col justify-center rounded-3xl border border-slate-800 bg-slate-900/80 p-8 md:p-12">
          <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">
            <ShieldCheck className="h-4 w-4" />
            BillWise
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Usage. Billing. Under control.
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-400 md:text-lg">
            Track API usage, monitor subscriptions, and understand exactly what you are being billed for across the billing cycle.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-2xl font-semibold text-white">24/7</div>
              <div className="mt-1 text-sm text-slate-400">Usage visibility</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-2xl font-semibold text-white">27%</div>
              <div className="mt-1 text-sm text-slate-400">Lower churn</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-2xl font-semibold text-white">₹0</div>
              <div className="mt-1 text-sm text-slate-400">Billing surprises</div>
            </div>
          </div>
        </div>

        <Card className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-400">Sign in to access your billing workspace.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-10 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-10 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-3.5 text-slate-400 transition hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            {error ? <ActionMessage type="error">{error}</ActionMessage> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Need an account?{' '}
            <Link to="/register" className="font-medium text-cyan-300 hover:text-cyan-200">
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
