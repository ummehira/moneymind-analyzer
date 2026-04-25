import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/dashboard',    icon: '⊞', label: 'Dashboard' },
  { to: '/transactions', icon: '⇄', label: 'Transactions' },
  { to: '/analytics',    icon: '◈', label: 'Analytics' },
  { to: '/savings',      icon: '$', label: 'Savings Goals' },
  { to: '/behavior',     icon: '◉', label: 'Behavior AI' },
  { to: '/predictions',  icon: '◎', label: 'Predictions' },
  { to: '/alerts',       icon: '⊘', label: 'Alerts' },
  { to: '/reports',      icon: '▣', label: 'Reports' },
  { to: '/settings',     icon: '⊙', label: 'Settings' },
]
const CURRENCIES = ['PKR','USD','EUR','GBP','AED','SAR','INR']

const MOBILE_NAV = [
  { to: '/dashboard',    icon: '⊞', label: 'Home' },
  { to: '/transactions', icon: '⇄', label: 'Transactions' },
  { to: '/analytics',    icon: '◈', label: 'Analytics' },
  { to: '/behavior',     icon: '◉', label: 'AI' },
  { to: '/settings',     icon: '⊙', label: 'Settings' },
]

export default function DashboardLayout() {
  const { user, logout, currency, updateCurrency } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [currOpen, setCurrOpen]     = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

      {/* ── DESKTOP SIDEBAR ── */}
      <aside style={{
        width: 224, minWidth: 224,
        background: 'white',
        borderRight: '1px solid var(--border-color)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '2px 0 8px rgba(15,41,66,0.05)',
      }}
        className="desktop-sidebar"
      >
        {/* Logo */}
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

        {/* Currency selector */}
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
              <span style={{ fontSize: 10 }}>▾</span>
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

        {/* Nav links */}
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

        {/* User area */}
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

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,41,66,0.4)', zIndex: 200 }}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            style={{ width: 260, height: '100%', background: 'white', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="/logo.png" alt="MoneyMind" style={{ height: 32, width: 32, objectFit: 'contain' }} />
                <div style={{ fontWeight: 800, fontSize: 15 }}>
                  <span style={{ color: 'var(--navy-800)' }}>Money</span>
                  <span style={{ color: 'var(--teal-600)' }}>Mind</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--text-muted)', cursor: 'pointer' }}>x</button>
            </div>
            <nav style={{ flex: 1, padding: 12, overflowY: 'auto' }}>
              {NAV.map(n => (
                <NavLink key={n.to} to={n.to}
                  onClick={() => setSidebarOpen(false)}
                  style={({ isActive }) => ({ ...navStyle(isActive), marginBottom: 4 })}
                >
                  <span style={{ fontSize: 16, width: 20 }}>{n.icon}</span>{n.label}
                </NavLink>
              ))}
            </nav>
            <div style={{ padding: 12, borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
                Currency: <strong style={{ color: 'var(--teal-600)' }}>{currency}</strong>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {CURRENCIES.map(c => (
                  <button key={c} onClick={() => updateCurrency(c)}
                    style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: 11,
                      fontFamily: 'var(--font-mono)', fontWeight: 600, cursor: 'pointer',
                      background: currency === c ? 'rgba(20,184,166,0.1)' : 'var(--bg-secondary)',
                      border: currency === c ? '1.5px solid var(--teal-500)' : '1px solid var(--border-color)',
                      color: currency === c ? 'var(--teal-600)' : 'var(--text-muted)',
                    }}
                  >{c}</button>
                ))}
              </div>
              <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Mobile topbar */}
        <div style={{
          display: 'none',
          background: 'white',
          borderBottom: '1px solid var(--border-color)',
          padding: '12px 16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)',
          position: 'sticky', top: 0, zIndex: 100,
        }}
          className="mobile-topbar"
        >
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'var(--navy-800)' }}>
            ☰
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo.png" alt="MoneyMind" style={{ height: 28, width: 28, objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: 15 }}>
              <span style={{ color: 'var(--navy-800)' }}>Money</span>
              <span style={{ color: 'var(--teal-600)' }}>Mind</span>
            </span>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'white' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg-secondary)' }}>
          <Outlet />
        </main>

        {/* ── MOBILE BOTTOM NAV ── */}
        <div style={{
          display: 'none',
          background: 'white',
          borderTop: '1px solid var(--border-color)',
          padding: '8px 0 10px',
          boxShadow: '0 -2px 12px rgba(15,41,66,0.08)',
          position: 'sticky', bottom: 0, zIndex: 100,
        }}
          className="mobile-bottom-nav"
        >
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {MOBILE_NAV.map(n => {
              const isActive = location.pathname === n.to
              return (
                <NavLink key={n.to} to={n.to} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 10px', borderRadius: 8, transition: 'all 0.15s' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? 'rgba(20,184,166,0.12)' : 'transparent',
                    fontSize: 16, color: isActive ? 'var(--teal-600)' : 'var(--text-muted)',
                    transition: 'all 0.15s',
                  }}>
                    {n.icon}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: isActive ? 'var(--teal-600)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 0.3 }}>
                    {n.label}
                  </span>
                </NavLink>
              )
            })}
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-topbar { display: flex !important; }
          .mobile-bottom-nav { display: block !important; }
        }
      `}</style>
    </div>
  )
}
