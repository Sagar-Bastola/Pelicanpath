import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Trash2, Bot, User } from 'lucide-react'
import api from '../lib/api.js'

const STARTERS = [
  "What happens to my TOPS if I fail one class this semester?",
  "Do I have to accept all the loans on my award letter?",
  "What's the difference between subsidized and unsubsidized loans?",
  "How do I appeal a financial aid suspension at SELU?",
  "What is the Go Grant and do I qualify?",
  "When is the FAFSA deadline for SELU?",
]

export default function ChatTab() {
  const [messages, setMessages] = useState([])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text) {
    if (!text.trim() || loading) return
    setInput('')
    const history = messages.map((m) => ({ role: m.role, content: m.content }))
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setLoading(true)
    try {
      const { data } = await api.post('/chat', { message: text, history })
      setMessages([...next, { role: 'model', content: data.response }])
    } catch {
      setMessages([...next, {
        role: 'model',
        content: "I'm having trouble right now. Please call SELU Financial Aid at **985-549-2244**.",
      }])
    } finally {
      setLoading(false)
    }
  }

  function formatMsg(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] animate-fade-up">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="section-title text-2xl">Ask PelicanPath</h1>
          <p className="section-sub mt-1">
            Grounded in real SELU and Louisiana policies
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="btn-ghost text-slate-500 hover:text-red-400"
          >
            <Trash2 size={15} />
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">

        {/* Welcome + starters */}
        {messages.length === 0 && !loading && (
          <div className="space-y-4">
            <div className="card p-5 bg-gradient-to-br from-brand-600/10
              to-blue-900/5 border-brand-600/20">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={16} className="text-gold-400" />
                <span className="text-gold-400 text-sm font-semibold">PelicanPath</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Hey! I know SELU's policies, TOPS rules, Louisiana programs,
                and Hammond resources. Ask me anything — I'll give you a real answer,
                not bureaucratic runaround.
              </p>
            </div>

            <p className="text-slate-500 text-xs uppercase tracking-wide px-1">
              Common questions
            </p>
            <div className="grid grid-cols-1 gap-2">
              {STARTERS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="card text-left text-sm p-3.5 text-slate-300
                    hover:text-white hover:border-surface-border
                    hover:bg-surface-2 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message thread */}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center
              shrink-0 mt-0.5 text-xs font-bold
              ${m.role === 'user'
                ? 'bg-brand-600 text-white'
                : 'bg-gold-400/15 border border-gold-400/30 text-gold-400'
              }`}>
              {m.role === 'user'
                ? <User size={14} />
                : <Bot  size={14} />
              }
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                ${m.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-sm'
                  : 'card text-slate-300 rounded-tl-sm'
                }`}
              dangerouslySetInnerHTML={{ __html: formatMsg(m.content) }}
            />
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-400/15 border
              border-gold-400/30 flex items-center justify-center shrink-0">
              <Bot size={14} className="text-gold-400" />
            </div>
            <div className="card px-4 py-3 rounded-tl-sm flex items-center gap-1">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 space-y-2">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(input)}
            placeholder="Ask anything about your financial aid…"
            disabled={loading}
            className="input flex-1"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="btn-primary px-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? <Loader2 size={16} className="animate-spin" />
              : <Send size={16} />
            }
          </button>
        </div>
        <p className="text-slate-600 text-xs text-center">
          Verify important decisions with SELU Financial Aid · 985-549-2244
        </p>
      </div>
    </div>
  )
}