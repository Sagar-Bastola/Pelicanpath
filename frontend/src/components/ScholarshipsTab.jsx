import { useState } from 'react'
import { Award, Loader2, ExternalLink } from 'lucide-react'
import api from '../lib/api.js'

const MAJORS = [
  'Accounting','Biology','Business Administration','Chemistry','Communications',
  'Computer Science','Criminal Justice','Elementary Education','Engineering',
  'English','Healthcare Administration','History','Information Technology',
  'Kinesiology','Mathematics','Music','Nursing','Political Science','Pre-Med',
  'Psychology','Secondary Education','Social Work','Sports Management','Undeclared',
]

export default function ScholarshipsTab() {
  const [major,   setMajor]   = useState('')
  const [year,    setYear]    = useState('Freshman')
  const [pell,    setPell]    = useState(false)
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function find() {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/scholarships', {
        major,
        year,
        pell_eligible: pell,
      })
      setResult(data.matches || [])
    } catch (e) {
      setError(e?.response?.data?.detail || 'Search failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-up">

      <div>
        <h1 className="section-title text-2xl">Scholarship Match</h1>
        <p className="section-sub mt-1">
          Louisiana scholarships matched to your profile.
        </p>
      </div>

      <div className="card p-5 space-y-4">

        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wide mb-1.5">
            Major
          </label>
          <select
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="select"
          >
            <option value="">Select your major...</option>
            {MAJORS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 uppercase tracking-wide mb-1.5">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="select"
          >
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPell(!pell)}
            className="relative w-10 h-5 rounded-full transition-colors focus:outline-none"
            style={{ backgroundColor: pell ? '#006747' : '#1f2d42' }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
              style={{ left: pell ? '22px' : '2px' }}
            />
          </button>
          <span className="text-sm text-slate-300">Pell Grant eligible</span>
        </div>

        <button
          onClick={find}
          disabled={loading || !major}
          className="btn-primary w-full justify-center disabled:opacity-40"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Award size={16} />
          )}
          {loading ? 'Searching...' : 'Find My Scholarships'}
        </button>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

      </div>

      {result && result.length > 0 && (
        <div className="space-y-4 animate-fade-up">

          <p className="text-slate-400 text-sm">
            {result.length} scholarships matched to your profile
          </p>

          {result.map((s, i) => (
            <div key={i} className="card p-5">

              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(244,185,66,0.1)', border: '1px solid rgba(244,185,66,0.2)' }}>
                    <Award size={16} style={{ color: '#F4B942' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{s.name}</h3>
                    {s.why_match && (
                      <p className="text-slate-500 text-xs mt-0.5">{s.why_match}</p>
                    )}
                  </div>
                </div>
                <span className="tag-green shrink-0">{s.amount}</span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                {s.eligibility}
              </p>

              <div className="flex items-center justify-between flex-wrap gap-2">
                {s.deadline && (
                  <span className="tag-amber">
                    Deadline: {s.deadline}
                  </span>
                )}
                
                {/* FIXED: Added missing <a> tag here */}
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-xs py-1.5 px-3 ml-auto"
                >
                  Apply Now
                  <ExternalLink size={12} />
                </a>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}