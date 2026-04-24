import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/dashboard',    icon: '⊞', label: 'Dashboard' },
  { to: '/transactions', icon: '⇄', label: 'Transactions' },
  { to: '/analytics',    icon: '◈', label: 'Analytics' },
  { to: '/behavior',     icon: '◉', label: 'Behavior AI' },
  { to: '/predictions',  icon: '◎', label: 'Predictions' },
  { to: '/alerts',       icon: '⊘', label: 'Smart Alerts' },
  { to: '/reports',      icon: '▣', label: 'Reports' },
  { to: '/settings',     icon: '⊙', label: 'Settings' },
]

const CURRENCIES = ['PKR','USD','EUR','GBP','AED','SAR','INR']

export default function DashboardLayout() {
  const { user, logout, currency, updateCurrency } = useAuth()
  const navigate = useNavigate()
  const [currOpen, setCurrOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const navStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px',
    borderRadius: 8, marginBottom: 2, fontSize: 13, fontWeight: 500,
    color: isActive ? 'var(--teal-600)' : 'var(--text-muted)',
    background: isActive ? 'rgba(20,184,166,0.1)' : 'none',
    border: isActive ? '1px solid rgba(20,184,166,0.2)' : '1px solid transparent',
    transition: 'all 0.15s', textDecoration: 'none',
  })

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-secondary)' }}>

      <aside style={{ width: 224, minWidth: 224, background: 'white', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 8px rgba(15,41,66,0.05)' }}>

        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="MoneyMind" style={{ height: 38, width: 38, objectFit: 'contain' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.1 }}>
                <span style={{ color: 'var(--navy-800)' }}>Money</span>
                <span style={{ color: 'var(--teal-600)' }}>Mind</span>
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-light)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase' }}>Analyzer</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setCurrOpen(!currOpen)} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: 8, padding: '7px 11px', color: 'var(--text-primary)', fontSize: 12,
              fontFamily: 'var(--font-mono)', cursor: 'pointer',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>CURRENCY</span>
                <span style={{ color: 'var(--teal-600)', fontWeight: 700 }}>{currency}</span>
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>▾</span>
            </button>
            {currOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border-color)', borderRadius: 8, zIndex: 50, overflow: 'hidden', marginTop: 4, boxShadow: 'var(--shadow-lg)' }}>
                {CURRENCIES.map(c => (
                  <button key={c} onClick={() => { updateCurrency(c); setCurrOpen(false) }}
                    style={{
                      width: '100%', padding: '8px 12px', textAlign: 'left',
                      background: currency === c ? 'rgba(20,184,166,0.08)' : 'none',
                      border: 'none',
                      color: currency === c ? 'var(--teal-600)' : 'var(--text-secondary)',
                      fontSize: 12, fontFamily: 'var(--font-mono)', cursor: 'pointer',
                      fontWeight: currency === c ? 700 : 400,
                    }}
                    onMouseEnter={e => { if (currency !== c) e.currentTarget.style.background = 'var(--bg-secondary)' }}
                    onMouseLeave={e => { if (currency !== c) e.currentTarget.style.background = 'none' }}
                  >{c}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
          <div style={{ fontSize: 9, color: 'var(--text-light)', letterSpacing: 1.5, textTransform: 'uppercase', padding: '6px 8px 4px', fontFamily: 'var(--font-mono)' }}>Main</div>
          {NAV.slice(0, 3).map(n => (
            <NavLink key={n.to} to={n.to} style={({ isActive }) => navStyle(isActive)}>
              <span style={{ fontSize: 14, width: 18 }}>{n.icon}</span>{n.label}
            </NavLink>
          ))}
          <div style={{ fontSize: 9, color: 'var(--text-light)', letterSpacing: 1.5, textTransform: 'uppercase', padding: '12px 8px 4px', fontFamily: 'var(--font-mono)' }}>Intelligence</div>
          {NAV.slice(3, 7).map(n => (
            <NavLink key={n.to} to={n.to} style={({ isActive }) => navStyle(isActive)}>
              <span style={{ fontSize: 14, width: 18 }}>{n.icon}</span>{n.label}
            </NavLink>
          ))}
          <div style={{ fontSize: 9, color: 'var(--text-light)', letterSpacing: 1.5, textTransform: 'uppercase', padding: '12px 8px 4px', fontFamily: 'var(--font-mono)' }}>Account</div>
          {NAV.slice(7).map(n => (
            <NavLink key={n.to} to={n.to} style={({ isActive }) => navStyle(isActive)}>
              <span style={{ fontSize: 14, width: 18 }}>{n.icon}</span>{n.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'white', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'capitalize' }}>{user?.plan || 'free'} plan</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '7px', fontSize: 12 }}>
            Sign Out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg-secondary)' }}>
        <Outlet />
      </main>
    </div>
  )
}