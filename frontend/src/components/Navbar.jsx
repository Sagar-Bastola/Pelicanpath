import {
  FileText, MessageCircle, BarChart2,
  CalendarDays, GraduationCap, Award, Home,
} from 'lucide-react'

const TABS = [
  { id: 'decode',       label: 'Decode',      Icon: FileText },
  { id: 'chat',         label: 'Chat',        Icon: MessageCircle },
  { id: 'risk',         label: 'Risk Score',  Icon: BarChart2 },
  { id: 'plan',         label: '90-Day Plan', Icon: CalendarDays },
  { id: 'tops',         label: 'TOPS Watch',  Icon: GraduationCap },
  { id: 'scholarships', label: 'Scholarships',Icon: Award },
]

export default function Navbar({ tab, setTab }) {
  return (
    <nav className="sticky top-0 z-50 bg-navy-900/80 backdrop-blur-xl
      border-b border-surface-border/30">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-2">

        {/* Logo */}
        <button
          onClick={() => setTab('home')}
          className="flex items-center gap-2 mr-3 shrink-0 group"
        >
          <span className="text-xl">🦤</span>
          <span className="font-display font-bold text-white text-base
            hidden sm:block group-hover:text-emerald-400 transition-colors">
            PelicanPath
          </span>
        </button>

        {/* Tabs */}
        <div className="flex items-center gap-0.5 overflow-x-auto flex-1
          scrollbar-none">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                text-xs font-medium whitespace-nowrap shrink-0 transition-all
                ${tab === id
                  ? 'bg-brand-600/20 text-emerald-400 border border-brand-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon size={13} />
              <span className="hidden md:block">{label}</span>
            </button>
          ))}
        </div>

        {/* Home button */}
        <button
          onClick={() => setTab('home')}
          className="btn-ghost shrink-0"
          title="Back to home"
        >
          <Home size={16} />
        </button>
      </div>
    </nav>
  )
}