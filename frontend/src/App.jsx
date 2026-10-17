import { Activity, CreditCard, Zap } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 px-8 py-5">
        <h1 className="text-2xl font-bold tracking-tight">
          Bill<span className="text-cyan-400">Wise</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Usage. Billing. Under control.
        </p>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm font-medium text-cyan-400">
          YOUR WORKSPACE
        </p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight">
          Billing, without the guesswork.
        </h2>

        <p className="mt-3 max-w-xl text-slate-400">
          Track API consumption, monitor plan limits,
          and keep your billing transparent.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[
            { icon: Activity, title: 'Usage tracking', text: 'Monitor API requests.' },
            { icon: CreditCard, title: 'Transparent billing', text: 'Understand every charge.' },
            { icon: Zap, title: 'Plan management', text: 'Keep your usage in control.' },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
            >
              <Icon className="mb-5 text-cyan-400" size={26} />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App