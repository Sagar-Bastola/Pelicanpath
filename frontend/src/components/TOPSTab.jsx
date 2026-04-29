import { useState } from 'react'
import { GraduationCap, Loader2, Plus, Trash2 } from 'lucide-react'
import api from '../lib/api.js'

const STATUS = {
  safe:    { label: 'Safe',    cls: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800/30' },
  warning: { label: 'Warning', cls: 'text-yellow-400',  bg: 'bg-yellow-950/40 border-yellow-800/30' },
  at_risk: { label: 'At Risk', cls: 'text-orange-400',  bg: 'bg-orange-950/40 border-orange-800/30' },
  lost:    { label: 'Lost',    cls: 'text-red-400',     bg: 'bg-red-950/40 border-red-800/30' },
}

export default function TOPSTab() {
  const [gpa,      setGpa]      = useState('')
  const [credits,  setCredits]  = useState('')
  const [type,     setType]     = useState('Opportunity')
  const [courses,  setCourses]  = useState([
    { name: '', credits: 3, expected_grade: 'B' },
  ])
  const [result,   setResult]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const addCourse = () =>
    setCourses((c) => [...c, { name: '', credits: 3, expected_grade: 'B' }])
  const removeCourse = (i) =>
    setCourses((c) => c.filter((_, j) => j !== i))
  const updateCourse = (i, field, val) =>
    setCourses((c) => c.map((x, j) => j === i ? { ...x, [field]: val } : x))

  async function run() {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/tops', {
        current_gpa:       parseFloat(gpa),
        credits_completed: parseInt(credits),
        current_courses:   courses.filter((c) => c.name.trim()),
        tops_type:         type,
      })
      setResult(data)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Analysis failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="section-title text-2xl">TOPS GPA Watchtower</h1>
        <p className="section-sub mt-1">
          See exactly what happens to your scholarship under three grade scenarios.
        </p>
      </div>

      <div className="card p-5 space-y-4">
        {/* GPA / Credits / Type */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-400 uppercase
              tracking-wide mb-1.5">Current GPA</label>
            <input
              type="number" step="0.01" min="0" max="4"
              value={gpa} onChange={(e) => setGpa(e.target.value)}
              placeholder="2.85" className="input"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase
              tracking-wide mb-1.5">Credits Done</label>
            <input
              type="number"
              value={credits} onChange={(e) => setCredits(e.target.value)}
              placeholder="30" className="input"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase
              tracking-wide mb-1.5">TOPS Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="select">
              {['Tech','Opportunity','Performance','Honors'].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-slate-400 uppercase tracking-wide">
              Current Courses
            </label>
            <button
              onClick={addCourse}
              className="flex items-center gap-1 text-xs text-emerald-400
                hover:text-emerald-300 transition-colors"
            >
              <Plus size={13} /> Add Course
            </button>
          </div>
          <div className="space-y-2">
            {courses.map((c, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={c.name}
                  onChange={(e) => updateCourse(i, 'name', e.target.value)}
                  placeholder="Course name"
                  className="input flex-1"
                />
                <select
                  value={c.credits}
                  onChange={(e) => updateCourse(i, 'credits', +e.target.value)}
                  className="select w-16"
                >
                  {[1,2,3,4,5].map((n) => <option key={n}>{n}</option>)}
                </select>
                <select
                  value={c.expected_grade}
                  onChange={(e) => updateCourse(i, 'expected_grade', e.target.value)}
                  className="select w-16"
                >
                  {['A','B','C','D','F','W'].map((g) => <option key={g}>{g}</option>)}
                </select>
                {courses.length > 1 && (
                  <button
                    onClick={() => removeCourse(i)}
                    className="text-slate-500 hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={run}
          disabled={loading || !gpa || !credits}
          className="btn-primary w-full justify-center disabled:opacity-40"
        >
          {loading
            ? <Loader2 size={16} className="animate-spin" />
            : <GraduationCap size={16} />
          }
          {loading ? 'Analysing scenarios…' : 'Analyse TOPS Scenarios'}
        </button>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {/* Scenarios */}
      {result && (
        <div className="space-y-3 animate-fade-up">
          {result.scenarios?.map((s, i) => {
            const st = STATUS[s.status] || STATUS.safe
            return (
              <div key={i} className={`card p-5 border ${st.bg}`}>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-semibold text-white text-sm">{s.label}</span>
                  <span className={`font-display font-bold text-lg ${st.cls}`}>
                    GPA → {s.new_gpa?.toFixed(2)}
                  </span>
                  <span className={`tag ${st.bg.replace('bg-','').replace('/40','').replace('/30','')}
                    ${st.cls} border-current`}>
                    {st.label}
                  </span>
                </div>
                <p className="text-slate-300 text-sm">{s.explanation}</p>
                <p className="text-slate-500 text-xs mt-1.5 italic">
                  → {s.action}
                </p>
              </div>
            )
          })}

          {result.policy_note && (
            <div className="card p-4">
              <p className="text-slate-400 text-xs leading-relaxed">
                <span className="text-white font-medium">Policy note: </span>
                {result.policy_note}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}