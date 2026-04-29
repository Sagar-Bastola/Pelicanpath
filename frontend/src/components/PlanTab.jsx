import { useState } from 'react'
import {
  CalendarDays, Loader2, CheckCircle2,
  Circle, ExternalLink, Phone, Clock,
} from 'lucide-react'
import api from '../lib/api.js'

const MAJORS = [
  'Accounting','Biology','Business Administration','Chemistry','Communications',
  'Computer Science','Criminal Justice','Elementary Education','Engineering',
  'English','Healthcare Administration','History','Information Technology',
  'Kinesiology','Mathematics','Music','Nursing','Political Science','Pre-Med',
  'Psychology','Secondary Education','Social Work','Sports Management','Undeclared',
]

export default function PlanTab() {
  const [major,    setMajor]    = useState('')
  const [year,     setYear]     = useState('Freshman')
  const [loans,    setLoans]    = useState('')
  const [weeks,    setWeeks]    = useState([])
  const [done,     setDone]     = useState(new Set())
  const [expanded, setExpanded] = useState(1)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/plan', {
        major, year, loans: +loans || 0,
      })
      setWeeks(data.weeks || [])
      setDone(new Set())
      setExpanded(1)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to generate plan.')
    } finally {
      setLoading(false)
    }
  }

  function toggle(id) {
    const n = new Set(done)
    n.has(id) ? n.delete(id) : n.add(id)
    setDone(n)
  }

  const total   = weeks.reduce((a, w) => a + w.tasks.length, 0)
  const pct     = total > 0 ? Math.round((done.size / total) * 100) : 0

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="section-title text-2xl">90-Day Action Plan</h1>
        <p className="section-sub mt-1">
          Week-by-week tasks with real phone numbers, URLs, and what to say.
        </p>
      </div>

      {weeks.length === 0 ? (
        <div className="card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 uppercase
                tracking-wide mb-1.5">Major</label>
              <select value={major} onChange={(e) => setMajor(e.target.value)} className="select">
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
                tracking-wide mb-1.5">Total Loans ($)</label>
              <input
                type="number" value={loans}
                onChange={(e) => setLoans(e.target.value)}
                placeholder="e.g. 5500" className="input"
              />
            </div>
          </div>
          <button
            onClick={generate}
            disabled={loading || !major}
            className="btn-primary w-full justify-center disabled:opacity-40"
          >
            {loading
              ? <Loader2 size={16} className="animate-spin" />
              : <CalendarDays size={16} />
            }
            {loading ? 'Generating your plan…' : 'Generate My 90-Day Plan'}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      ) : (
        <div className="space-y-3">

          {/* Progress */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">Your Progress</span>
              <span className="text-gold-400 text-sm font-mono font-semibold">
                {done.size}/{total} tasks · {pct}%
              </span>
            </div>
            <div className="h-2 bg-navy-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-brand-600
                  rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Weeks */}
          {weeks.map((week) => {
            const wDone  = week.tasks.filter((_, ti) =>
              done.has(`${week.week_number}-${ti}`)
            ).length
            const isOpen = expanded === week.week_number
            const allDone = wDone === week.tasks.length

            return (
              <div key={week.week_number} className="card overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? 0 : week.week_number)}
                  className="w-full px-5 py-4 flex items-center gap-3
                    hover:bg-surface-2/60 text-left transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center
                    text-sm font-bold shrink-0
                    ${allDone
                      ? 'bg-emerald-500 text-white'
                      : 'border border-gold-400/30 text-gold-400'
                    }`}>
                    {week.week_number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{week.theme}</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {wDone}/{week.tasks.length} tasks complete
                    </p>
                  </div>
                  <span className="text-slate-500 text-xs shrink-0">
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-surface-border/20">
                    {week.tasks.map((task, ti) => {
                      const id     = `${week.week_number}-${ti}`
                      const isDone = done.has(id)
                      const isUrl  = task.resource?.startsWith('http')
                      const isPhone = task.resource?.match(/^\d{3}/)

                      return (
                        <div
                          key={ti}
                          className={`px-5 py-4 flex gap-3 border-b border-surface-border/10
                            last:border-0 transition-opacity
                            ${isDone ? 'opacity-50' : ''}`}
                        >
                          <button
                            onClick={() => toggle(id)}
                            className="mt-0.5 shrink-0 transition-colors"
                          >
                            {isDone
                              ? <CheckCircle2 size={18} className="text-emerald-500" />
                              : <Circle       size={18} className="text-slate-600 hover:text-slate-400" />
                            }
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium
                              ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                              {task.title}
                            </p>
                            <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              {isUrl ? (
                                <a href={task.resource} target="_blank" rel="noreferrer"
                                  className="flex items-center gap-1 text-xs
                                    text-emerald-400 hover:underline">
                                  <ExternalLink size={11} />
                                  {task.resource.replace('https://', '').slice(0, 40)}
                                </a>
                              ) : isPhone ? (
                                <a href={`tel:${task.resource}`}
                                  className="flex items-center gap-1 text-xs
                                    text-emerald-400 hover:underline">
                                  <Phone size={11} />
                                  {task.resource}
                                </a>
                              ) : (
                                <span className="text-slate-500 text-xs">
                                  {task.resource}
                                </span>
                              )}
                              {task.minutes && (
                                <span className="flex items-center gap-1
                                  text-xs text-slate-600">
                                  <Clock size={10} />
                                  ~{task.minutes} min
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}

          <button
            onClick={() => { setWeeks([]); setDone(new Set()) }}
            className="btn-secondary w-full justify-center text-sm"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  )
}