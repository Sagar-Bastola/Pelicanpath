import { useState } from 'react'
import { BarChart2, Loader2, TrendingUp, DollarSign } from 'lucide-react'
import api from '../lib/api.js'

const MAJORS = [
  'Accounting','Biology','Business Administration','Chemistry','Communications',
  'Computer Science','Criminal Justice','Elementary Education','Engineering',
  'English','Healthcare Administration','History','Information Technology',
  'Kinesiology','Mathematics','Music','Nursing','Political Science','Pre-Med',
  'Psychology','Secondary Education','Social Work','Sports Management','Undeclared',
]

const TIER = {
  low:      { label: 'Low Risk',      color: 'text-emerald-400', ring: '#10b981' },
  moderate: { label: 'Moderate Risk', color: 'text-yellow-400',  ring: '#f59e0b' },
  high:     { label: 'High Risk',     color: 'text-orange-400',  ring: '#f97316' },
  critical: { label: 'Critical Risk', color: 'text-red-400',     ring: '#ef4444' },
}

const fmt = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(n)

export default function RiskTab() {
  const [major,   setMajor]   = useState('')
  const [year,    setYear]    = useState('Freshman')
  const [loans,   setLoans]   = useState('')
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function run() {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/risk', { loans: +loans, major, year })
      setResult(data)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to calculate.')
    } finally {
      setLoading(false)
    }
  }

  const tier       = result ? TIER[result.tier] : null
  const gaugeColor = result ? tier.ring : '#10b981'

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header */}
      <div>
        <h1 className="section-title text-2xl">Debt Risk Score</h1>
        <p className="section-sub mt-1">
          Your projected debt vs Louisiana starting salary for your major.
        </p>
      </div>

      {/* Form */}
      <div className="card p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs text-slate-400 uppercase
              tracking-wide mb-1.5">Major</label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="select"
            >
              <option value="">Select your major…</option>
              {MAJORS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase
              tracking-wide mb-1.5">Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="select">
              {['Freshman','Sophomore','Junior','Senior'].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase
              tracking-wide mb-1.5">Total Loans This Year ($)</label>
            <input
              type="number"
              value={loans}
              onChange={(e) => setLoans(e.target.value)}
              placeholder="e.g. 5500"
              className="input"
            />
          </div>
        </div>

        <button
          onClick={run}
          disabled={loading || !major || !loans}
          className="btn-primary w-full justify-center disabled:opacity-40"
        >
          {loading
            ? <Loader2 size={16} className="animate-spin" />
            : <TrendingUp size={16} />
          }
          {loading ? 'Calculating…' : 'Calculate Risk Score'}
        </button>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {/* Result */}
      {result && tier && (
        <div className="space-y-4 animate-fade-up">

          {/* Score card */}
          <div className="card p-6 flex items-center gap-6">
            {/* Gauge */}
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="38"
                  fill="none" stroke="#1e3a5f" strokeWidth="10" />
                <circle cx="50" cy="50" r="38"
                  fill="none"
                  stroke={gaugeColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(result.score / 10) * 238.76} 238.76`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-display font-bold text-3xl leading-none ${tier.color}`}>
                  {result.score}
                </span>
                <span className="text-slate-500 text-xs">/10</span>
              </div>
            </div>

            <div className="flex-1">
              <p className={`font-display font-bold text-xl mb-1 ${tier.color}`}>
                {tier.label}
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                {result.summary}
              </p>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                {result.explanation}
              </p>
            </div>
          </div>

          {/* Key numbers */}
          <div className="grid grid-cols-3 gap-3">
            {[
              ['LA Starting Salary', fmt(result.salary),          `for ${major}`],
              ['Monthly Payment',    fmt(result.monthly_payment), '10-yr plan'],
              ['Debt / Income',      `${result.dti}%`,             'of monthly gross'],
            ].map(([l, v, s]) => (
              <div key={l} className="stat-card">
                <div className="stat-label">{l}</div>
                <div className="stat-value text-xl">{v}</div>
                <div className="text-slate-500 text-xs">{s}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={15} className="text-emerald-400" />
              <span className="font-semibold text-sm text-white">Recommended Actions</span>
            </div>
            <ul className="space-y-3">
              {result.actions?.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="w-6 h-6 rounded-full bg-brand-600/20 text-emerald-400
                    text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    {i + 1}
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}