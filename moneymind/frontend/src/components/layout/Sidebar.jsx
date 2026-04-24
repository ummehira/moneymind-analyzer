import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NAV = [
  { label: 'Dashboard',    path: '/dashboard',    icon: '▦' },
  { label: 'Transactions', path: '/transactions', icon: '⇄' },
  { label: 'Analytics',    path: '/analytics',    icon: '◉' },
  { label: 'Behavior AI',  path: '/behavior',     icon: '✦' },
  { label: 'Predictions',  path: '/predictions',  icon: '◈' },
  { label: 'Smart Alerts', path: '/alerts',       icon: '◬' },
  { label: 'Reports',      path: '/reports',      icon: '⬇' },
];

const s = {
  sidebar: {
    position: 'fixed', top: 0, left: 0, bottom: 0,
    width: 'var(--sidebar-w)',
    background: 'var(--navy)',
    display: 'flex', flexDirection: 'column',
    zIndex: 100,
    borderRight: '1px solid rgba(255,255,255,0.06)',
  },
  logo: {
    padding: '20px 20px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', gap: 10,
  },
  logoImg: { width: 36, height: 36, objectFit: 'contain' },
  logoText: {
    fontFamily: 'var(--font-head)',
    fontSize: 16, fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.3px',
    lineHeight: 1.1,
  },
  logoAccent: { color: 'var(--teal)' },
  logoSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9, color: 'rgba(255,255,255,0.35)',
    letterSpacing: '1.5px', textTransform: 'uppercase',
    marginTop: 1,
  },
  nav: { padding: '14px 10px', flex: 1 },
  navSection: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9, letterSpacing: '1.8px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.25)',
    padding: '8px 10px 4px',
  },
  navLink: (active) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 12px',
    borderRadius: 8,
    margin: '1px 0',
    fontSize: 13, fontFamily: 'var(--font-body)',
    color: active ? '#fff' : 'rgba(255,255,255,0.55)',
    background: active ? 'rgba(20,184,166,0.18)' : 'transparent',
    borderLeft: active ? '2px solid var(--teal)' : '2px solid transparent',
    transition: 'all 0.15s',
    textDecoration: 'none',
  }),
  navIcon: {
    width: 20, height: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, flexShrink: 0,
  },
  bottom: {
    padding: '12px 14px',
    borderTop: '1px solid rgba(255,255,255,0.07)',
  },
  userRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'var(--grad-teal)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, color: '#fff',
    fontFamily: 'var(--font-head)',
    flexShrink: 0,
  },
  userName: { fontSize: 13, fontWeight: 500, color: '#fff' },
  userRole: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' },
  logoutBtn: {
    width: '100%', padding: '7px 12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 7, color: 'rgba(255,255,255,0.5)',
    fontSize: 11, fontFamily: 'var(--font-mono)',
    cursor: 'pointer', textAlign: 'left',
    transition: 'all 0.15s',
  },
};

export default function Sidebar() {
  const navigate = useNavigate();
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('mm_user')); } catch { return null; }
  })();

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'MM';

  const handleLogout = () => {
    localStorage.removeItem('mm_token');
    localStorage.removeItem('mm_user');
    navigate('/');
  };

  return (
    <aside style={s.sidebar}>
      <div style={s.logo}>
        <img src="/logo.png" alt="MoneyMind Logo" style={s.logoImg} />
        <div>
          <div style={s.logoText}>
            Money<span style={s.logoAccent}>Mind</span>
          </div>
          <div style={s.logoSub}>Analyzer v2.0</div>
        </div>
      </div>

      <nav style={s.nav}>
        <div style={s.navSection}>Core</div>
        {NAV.slice(0,3).map(item => (
          <NavLink key={item.path} to={item.path}
            style={({ isActive }) => s.navLink(isActive)}>
            <span style={s.navIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <div style={{ ...s.navSection, marginTop: 8 }}>Intelligence</div>
        {NAV.slice(3,6).map(item => (
          <NavLink key={item.path} to={item.path}
            style={({ isActive }) => s.navLink(isActive)}>
            <span style={s.navIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <div style={{ ...s.navSection, marginTop: 8 }}>Export</div>
        {NAV.slice(6).map(item => (
          <NavLink key={item.path} to={item.path}
            style={({ isActive }) => s.navLink(isActive)}>
            <span style={s.navIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={s.bottom}>
        <div style={s.userRow}>
          <div style={s.avatar}>{initials}</div>
          <div>
            <div style={s.userName}>{user?.name || 'User'}</div>
            <div style={s.userRole}>{user?.currency || 'PKR'} — {user?.plan || 'free'}</div>
          </div>
        </div>
        <button style={s.logoutBtn} onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
