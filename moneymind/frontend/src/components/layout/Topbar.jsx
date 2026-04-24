import React from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard':    { title: 'Financial Overview',     sub: 'Real-time analysis active' },
  '/transactions': { title: 'Transactions',           sub: 'All income and expense records' },
  '/analytics':    { title: 'Analytics',              sub: 'Deep financial pattern analysis' },
  '/behavior':     { title: 'Behavior Intelligence',  sub: 'AI-powered financial personality analysis' },
  '/predictions':  { title: 'Prediction Engine',      sub: 'AI-generated financial forecasts' },
  '/alerts':       { title: 'Smart Alerts',           sub: 'Automated anomaly detection' },
  '/reports':      { title: 'Download Reports',       sub: 'Generate and export your financial reports' },
};

const s = {
  topbar: {
    height: 'var(--topbar-h)',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    position: 'sticky', top: 0, zIndex: 50,
  },
  title: {
    fontFamily: 'var(--font-head)',
    fontSize: 18, fontWeight: 700,
    color: 'var(--navy)',
    letterSpacing: '-0.3px',
  },
  sub: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11, color: 'var(--text4)',
    marginTop: 1,
  },
  right: { display: 'flex', alignItems: 'center', gap: 10 },
  badge: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '4px 10px',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    fontFamily: 'var(--font-mono)',
    fontSize: 10, color: 'var(--text3)',
  },
  dot: {
    width: 6, height: 6, borderRadius: '50%',
    background: 'var(--teal)',
    boxShadow: '0 0 6px var(--teal)',
    animation: 'pulse 2s infinite',
  },
};

export default function Topbar() {
  const { pathname } = useLocation();
  const meta = PAGE_TITLES[pathname] || { title: 'MoneyMind', sub: '' };
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('mm_user')); } catch { return null; }
  })();

  const now = new Date().toLocaleString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <header style={s.topbar}>
      <div>
        <div style={s.title}>{meta.title}</div>
        <div style={s.sub}>{meta.sub}</div>
      </div>
      <div style={s.right}>
        <div style={s.badge}>
          <div style={s.dot}></div>
          AI Active
        </div>
        <div style={s.badge}>
          {user?.currency || 'PKR'} — {now}
        </div>
      </div>
    </header>
  );
}
