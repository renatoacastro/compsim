import { NavLink } from 'react-router-dom'
import { Sun, Moon, Cpu, BookOpen, FlaskConical, GitBranch, ClipboardList } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const NAV_ITEMS = [
  { to: '/',           label: 'Início',       icon: Cpu },
  { to: '/teoria',     label: 'Teoria',       icon: BookOpen },
  { to: '/simulador1', label: 'Simulador 1',  icon: FlaskConical },
  { to: '/simulador2', label: 'Simulador 2',  icon: GitBranch },
  { to: '/atividade',  label: 'Atividade',    icon: ClipboardList },
]

export default function Navbar() {
  const { dark, toggle } = useTheme()

  const navStyle = {
    position: 'sticky', top: 0, zIndex: 50,
    background: 'var(--bg-surface)',
    borderBottom: '1px solid var(--bg-border)',
    backdropFilter: 'blur(12px)',
  }

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>

        {/* Logo */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={14} style={{ color: '#3b82f6' }} />
          </div>
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
            Comp<span style={{ color: '#3b82f6' }}>Sim</span>
          </span>
        </NavLink>

        {/* Links (desktop) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden md:flex">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
                     style={({ isActive }) => ({
                       display: 'flex', alignItems: 'center', gap: 6,
                       padding: '6px 12px', borderRadius: 8,
                       fontSize: 12, fontWeight: 500, textDecoration: 'none',
                       transition: 'all 0.15s',
                       background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                       color: isActive ? '#3b82f6' : 'var(--text-secondary)',
                     })}>
              <Icon size={13} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Theme toggle */}
        <button onClick={toggle}
                style={{ padding: 8, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                title={dark ? 'Modo claro' : 'Modo escuro'}>
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Mobile nav */}
      <div style={{ display: 'flex', overflowX: 'auto', borderTop: '1px solid var(--bg-border)', padding: '4px 8px', gap: 4 }} className="md:hidden">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'}
                   style={({ isActive }) => ({
                     display: 'flex', alignItems: 'center', gap: 4,
                     padding: '4px 10px', borderRadius: 6, whiteSpace: 'nowrap',
                     fontSize: 11, fontWeight: 500, textDecoration: 'none',
                     background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                     color: isActive ? '#3b82f6' : 'var(--text-secondary)',
                   })}>
            <Icon size={12} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
