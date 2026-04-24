import React from 'react';

export function Card({ children, style, className }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '20px',
      boxShadow: 'var(--shadow-sm)',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function CardHeader({ title, sub, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: 14, fontWeight: 600, color: 'var(--navy)', letterSpacing: '-0.2px' }}>{title}</div>
        {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text4)', marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

export function MetricCard({ label, value, change, changeType = 'neutral', icon, accent }) {
  const changeColor = changeType === 'up' ? 'var(--success)' : changeType === 'down' ? 'var(--danger)' : 'var(--text4)';
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 18px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text4)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>
            {label}
          </div>
          <div style={{
            fontFamily: 'var(--font-head)',
            fontSize: 24, fontWeight: 700,
            color: accent || 'var(--navy)',
            letterSpacing: '-0.8px', lineHeight: 1,
            marginBottom: 6,
          }}>
            {value}
          </div>
          {change && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: changeColor }}>
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: accent ? `${accent}18` : 'var(--surface3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function Badge({ children, color = 'teal' }) {
  const colors = {
    teal:   { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
    navy:   { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
    red:    { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
    orange: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
    gray:   { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
  };
  const c = colors[color] || colors.teal;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 4,
      fontFamily: 'var(--font-mono)', fontSize: 10,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, max = 100, color = 'var(--teal)', height = 6 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ background: 'var(--surface3)', borderRadius: 3, overflow: 'hidden', height }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 40, color: 'var(--text4)',
      fontFamily: 'var(--font-mono)', fontSize: 12,
    }}>
      Loading...
    </div>
  );
}

export function EmptyState({ message = 'No data available.' }) {
  return (
    <div style={{
      textAlign: 'center', padding: '32px 16px',
      color: 'var(--text4)', fontFamily: 'var(--font-mono)', fontSize: 12,
    }}>
      {message}
    </div>
  );
}
