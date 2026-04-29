import {
  FileText, MessageCircle, BarChart2,
  CalendarDays, GraduationCap, Award,
  ArrowRight, ChevronRight,
} from 'lucide-react'

const FEATURES = [
  {
    id: 'decode',
    icon: FileText,
    color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
    iconColor: 'text-emerald-400',
    title: 'Document Decoder',
    desc: 'Photo your award letter. Every line decoded in plain English instantly.',
  },
  {
    id: 'chat',
    icon: MessageCircle,
    color: 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
    iconColor: 'text-blue-400',
    title: 'Ask PelicanPath',
    desc: 'AI grounded in real SELU policies and TOPS rules. Available at midnight.',
  },
  {
    id: 'risk',
    icon: BarChart2,
    color: 'from-gold-400/20 to-gold-500/5 border-gold-400/20',
    iconColor: 'text-gold-400',
    title: 'Debt Risk Score',
    desc: 'Your loan vs Louisiana salary for your major. 1–10 score with real advice.',
  },
  {
    id: 'plan',
    icon: CalendarDays,
    color: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
    iconColor: 'text-purple-400',
    title: '90-Day Action Plan',
    desc: 'Week-by-week checklist with phone numbers, URLs, and scripts.',
  },
  {
    id: 'tops',
    icon: GraduationCap,
    color: 'from-sky-500/20 to-sky-600/5 border-sky-500/20',
    iconColor: 'text-sky-400',
    title: 'TOPS Watchtower',
    desc: 'See what happens to your scholarship if you fail or withdraw.',
  },
  {
    id: 'scholarships',
    icon: Award,
    color: 'from-rose-500/20 to-rose-600/5 border-rose-500/20',
    iconColor: 'text-rose-400',
    title: 'Scholarship Match',
    desc: 'Louisiana scholarships matched to your profile with eligibility explained.',
  },
]

const STATS = [
  { value: '47th',   label: 'LA Financial Literacy' },
  { value: '~50%',   label: 'SELU First-Gen Students' },
  { value: '4:30pm', label: 'Office Closing Time' },
  { value: '24/7',   label: 'PelicanPath Available' },
]

export default function Home({ setTab }) {
  return (
    <div className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
          bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-64 h-64
          bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-600/20
            rounded-full px-4 py-1.5 text-sm text-emerald-400 font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
            Built for SELU · Hackathon 2025
          </div>

          {/* Heading */}
          <h1 className="font-display font-bold text-5xl md:text-7xl
            text-white leading-[1.1] mb-6">
            Your Financial Aid,
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-brand-400
              bg-clip-text text-transparent">
              Finally Clear.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Louisiana ranks 47th in financial literacy. PelicanPath is the
            advisor every first-generation SELU student deserves — grounded in
            real TOPS rules, real SELU policies, real Hammond resources.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setTab('decode')}
              className="btn-primary text-base px-6 py-3"
            >
              <FileText size={18} />
              Decode My Document
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setTab('chat')}
              className="btn-secondary text-base px-6 py-3"
            >
              <MessageCircle size={18} />
              Ask a Question
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="border-y border-surface-border/30 bg-surface/40 py-10">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display font-bold text-3xl text-gold-400 mb-1">
                {value}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-white mb-3">
            Six Tools. One Goal.
          </h2>
          <p className="text-slate-400">
            Everything a first-generation student needs to navigate financial aid.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ id, icon: Icon, color, iconColor, title, desc }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`card-hover p-5 text-left group
                bg-gradient-to-br ${color}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center
                justify-center mb-4 ${iconColor}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-white mb-1.5 flex items-center gap-1">
                {title}
                <ChevronRight size={14}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto text-slate-400" />
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-surface-border/30 py-8 px-6 text-center">
        <p className="text-slate-500 text-sm">
          🦤 PelicanPath · SELU Hackathon 2025 · Not affiliated with Southeastern Louisiana University
        </p>
        <p className="text-slate-600 text-xs mt-1">
          Official guidance: SELU Financial Aid <span className="text-gold-400">985-549-2244</span>
        </p>
      </footer>
    </div>
  )
}