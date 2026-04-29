import { useState } from 'react'
import Navbar    from './components/Navbar.jsx'
import Home      from './pages/Home.jsx'
import DecodeTab from './components/DecodeTab.jsx'
import ChatTab   from './components/ChatTab.jsx'
import RiskTab   from './components/RiskTab.jsx'
import PlanTab   from './components/PlanTab.jsx'
import TOPSTab   from './components/TOPSTab.jsx'
import ScholarshipsTab from './components/ScholarshipsTab.jsx'

export default function App() {
  const [tab, setTab] = useState('home')

  const views = {
    home:         <Home setTab={setTab} />,
    decode:       <DecodeTab />,
    chat:         <ChatTab />,
    risk:         <RiskTab />,
    plan:         <PlanTab />,
    tops:         <TOPSTab />,
    scholarships: <ScholarshipsTab />,
  }

  return (
    <div className="min-h-screen bg-navy-900">
      {tab !== 'home' && <Navbar tab={tab} setTab={setTab} />}
      <main className={tab !== 'home' ? 'max-w-2xl mx-auto px-4 py-8' : ''}>
        {views[tab]}
      </main>
    </div>
  )
}