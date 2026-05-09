import { Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import Navbar    from './components/layout/Navbar'
import Home      from './pages/Home/Home'
import Teoria    from './pages/Teoria/Teoria'
import Sim1      from './pages/Sim1/Sim1'
import Sim2      from './pages/Sim2/Sim2'
import Atividade from './pages/Atividade/Atividade'

export default function App() {
  const { dark } = useTheme()

  // Apply theme class to <html> so CSS variables take effect globally
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)', transition: 'background 0.2s, color 0.2s' }}>
      <Navbar />
      <main className="page-enter">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/teoria"     element={<Teoria />} />
          <Route path="/simulador1" element={<Sim1 />} />
          <Route path="/simulador2" element={<Sim2 />} />
          <Route path="/atividade"  element={<Atividade />} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer style={{ borderTop: '1px solid var(--bg-border)', marginTop: '4rem', padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
        CompSim &nbsp;·&nbsp; Renato A. Castro &nbsp;·&nbsp; Arquitetura de Computadores
      </footer>
    </div>
  )
}
