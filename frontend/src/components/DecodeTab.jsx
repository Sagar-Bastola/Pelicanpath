import { useState, useCallback } from 'react'
import {
  Upload, Camera, AlertTriangle, CheckCircle,
  Loader2, Clock, DollarSign,
} from 'lucide-react'
import api from '../lib/api.js'

const CAT = {
  grant:             { cls: 'tag-green',  label: 'Grant' },
  scholarship:       { cls: 'tag-green',  label: 'Scholarship' },
  tops:              { cls: 'tag-blue',   label: 'TOPS' },
  loan_subsidized:   { cls: 'tag-amber',  label: 'Subsidized Loan' },
  loan_unsubsidized: { cls: 'tag-amber',  label: 'Unsubsidized Loan' },
  work_study:        { cls: 'tag-purple', label: 'Work-Study' },
  fee:               { cls: 'tag-red',    label: 'Fee' },
  other:             { cls: 'tag-slate',  label: 'Other' },
}

const fmt = (n) =>
  n == null ? '—'
  : new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0,
    }).format(n)

export default function DecodeTab() {
  const [result,   setResult]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const { data } = await api.post('/decode', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(data)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to decode. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="section-title text-2xl">Document Decoder</h1>
        <p className="section-sub mt-1">
          Upload your financial aid letter — every line decoded in plain English.
        </p>
      </div>

      {/* Upload zone */}
      {!result && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`card p-10 flex flex-col items-center gap-5 border-2 border-dashed
            transition-all cursor-pointer text-center
            ${dragging
              ? 'border-emerald-500 bg-emerald-500/5'
              : 'border-surface-border/50 hover:border-surface-border hover:bg-surface-2/50'
            }`}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Loader2 size={40} className="text-emerald-500 animate-spin" />
              </div>
              <p className="text-slate-300 font-medium">
                Google Vision extracting text…
              </p>
              <p className="text-slate-500 text-sm">
                Gemini parsing all line items…
              </p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-brand-600/10 border
                border-brand-600/20 flex items-center justify-center">
                <Upload size={28} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">
                  Drop your document here
                </p>
                <p className="text-slate-400 text-sm">
                  JPEG, PNG, WebP · max 10 MB
                </p>
              </div>
              <div className="flex gap-3">
                <label className="btn-primary text-sm cursor-pointer">
                  <Upload size={15} />
                  Browse File
                  <input
                    type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleFile(f)
                    }}
                  />
                </label>
                <label className="btn-secondary text-sm cursor-pointer">
                  <Camera size={15} />
                  Take Photo
                  <input
                    type="file" accept="image/*" capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleFile(f)
                    }}
                  />
                </label>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="card p-4 bg-red-950/30 border-red-800/40 flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4 animate-fade-up">

          {/* Summary */}
          <div className="card p-5 bg-gradient-to-br from-emerald-950/40
            to-emerald-900/10 border-emerald-800/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={15} className="text-emerald-400" />
              <span className="text-emerald-400 text-sm font-semibold">
                Plain-English Summary
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {result.plain_english_summary}
            </p>
          </div>

          {/* Totals grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Cost of Attendance',    result.totals?.cost_of_attendance],
              ['Total Aid Offered',     result.totals?.total_aid],
              ['Expected Contribution', result.totals?.expected_family_contribution],
              ['Your Net Cost',         result.totals?.net_cost],
            ].map(([l, v]) => (
              <div key={l} className="stat-card">
                <div className="stat-label">{l}</div>
                <div className={`stat-value text-xl ${v === 0 ? 'text-emerald-400' : ''}`}>
                  {fmt(v)}
                </div>
              </div>
            ))}
          </div>

          {/* Line items */}
          <div className="card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-surface-border/30
              flex items-center justify-between">
              <span className="font-semibold text-sm text-white">Line Items</span>
              <span className="text-slate-500 text-xs">
                {result.line_items?.length} items decoded
              </span>
            </div>
            <div className="divide-y divide-surface-border/20">
              {result.line_items?.map((item, i) => {
                const cat = CAT[item.category] || CAT.other
                return (
                  <div key={i} className="px-5 py-3 flex items-start gap-3
                    hover:bg-surface-2/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-sm font-medium">
                          {item.label}
                        </span>
                        <span className={cat.cls}>{cat.label}</span>
                        <span className="text-slate-500 text-xs">{item.period}</span>
                      </div>
                      {item.notes && (
                        <p className="text-slate-500 text-xs mt-0.5">{item.notes}</p>
                      )}
                    </div>
                    <span className={`text-sm font-mono font-semibold shrink-0
                      ${item.category.startsWith('loan')
                        ? 'text-amber-300' : 'text-emerald-300'}`}>
                      {fmt(item.amount_usd)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Deadlines */}
          {result.deadlines?.length > 0 && (
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-gold-400" />
                <span className="text-sm font-semibold text-white">Deadlines</span>
              </div>
              <ul className="space-y-2">
                {result.deadlines.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="tag-amber shrink-0">{d.date || 'TBD'}</span>
                    <span className="text-slate-300">{d.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => { setResult(null); setError(null) }}
            className="btn-secondary w-full justify-center text-sm"
          >
            Upload Different Document
          </button>
        </div>
      )}
    </div>
  )
}