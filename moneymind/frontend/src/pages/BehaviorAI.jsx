import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

function AnimatedScoreBar({ value, max = 100, color, label }) {
  const [width, setWidth] = useState(0)
  const ref = useRef()
  const pct = Math.min((value / max) * 100, 100)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setWidth(pct), 200)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [pct])

  return (
    <div ref={ref} style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{value}%</span>
        </div>
      </div>
      <div style={{ position: 'relative', height: 10, background: 'var(--bg-tertiary)', borderRadius: 5, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          background: color || 'var(--gradient-brand)',
          borderRadius: 5,
          transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
        }}>
          {/* Glow tip */}
          <div style={{
            position: 'absolute',
            right: 0, top: 0, bottom: 0,
            width: 8,
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '0 5px 5px 0',
            opacity: width > 0 ? 1 : 0,
            transition: 'opacity 0.3s ease 1s',
          }} />
        </div>
      </div>
      {/* Milestone markers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {[0, 25, 51, 75, 100].map(m => (
          <div key={m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: 1, height: 4, background: 'var(--border-color)' }} />
            <span style={{ fontSize: 9, color: m <= value ? color || 'var(--teal-600)' : 'var(--text-light)', fontFamily: 'var(--font-mono)', fontWeight: m <= value ? 700 : 400 }}>
              {m}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnimatedCircleScore({ score }) {
  const [displayScore, setDisplayScore] = useState(0)
  const circumference = 2 * Math.PI * 58
  const [offset, setOffset] = useState(circumference)

  useEffect(() => {
    // Animate number count up
    let start = 0
    const duration = 1500
    const increment = score / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.floor(start))
      }
    }, 16)

    // Animate circle
    setTimeout(() => {
      const targetOffset = circumference - (score / 100) * circumference
      setOffset(targetOffset)
    }, 100)

    return () => clearInterval(timer)
  }, [score])

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Background circle */}
        <circle cx="70" cy="70" r="58" fill="none" stroke="var(--bg-tertiary)" strokeWidth="12" />
        {/* Animated progress circle */}
        <circle
          cx="70" cy="70" r="58"
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <text x="70" y="62" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="28" fontWeight="800" fill="#0d9488">
          {displayScore}
        </text>
        <text x="70" y="78" textAnchor="middle" fontFamily="DM Mono,monospace" fontSize="10" fill="#64748b">
          / 100
        </text>
      </svg>
    </div>
  )
}

export default function BehaviorAI() {
  const [report, setReport]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    api.get('/behavior/report')
      .then(r => setReport(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const refresh = async () => {
    setGenerating(true)
    try {
      const r = await api.get('/behavior/report?refresh=1')
      setReport(r.data.data)
    } catch(e) { console.error(e) }
    finally { setGenerating(false) }
  }

  const dims = report ? [
    { label: 'Savings Discipline',  val: Math.round(Number(report.savings_rate) * 100),         color: 'var(--teal-500)' },
    { label: 'Impulse Control',     val: Math.round((1 - Number(report.impulse_ratio)) * 100),   color: '#3b82f6' },
    { label: 'Spending Consistency',val: Math.round(Number(report.consistency_score) * 100),     color: '#8b5cf6' },
  ] : []

  return (
    <div>
      <div style={{ background: 'white', borderBottom: '1px solid var(--border-color)', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy-800)' }}>Behavior AI</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>AI-powered financial personality analysis</div>
        </div>
        <button className="btn btn-outline" style={{ fontSize: 13 }} onClick={refresh} disabled={generating}>
          {generating ? 'Analyzing...' : 'Re-analyze'}
        </button>
      </div>

      <div style={{ padding: '24px 28px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="skeleton" style={{ height: 320 }} />
            <div className="skeleton" style={{ height: 320 }} />
          </div>
        ) : !report ? (
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 14, padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Add transactions to generate your AI behavior report.</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

              {/* Score card */}
              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 14, padding: 28, boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 16 }}>Overall Behavior Score</div>

                <AnimatedCircleScore score={report.score} />

                <div className="badge badge-teal" style={{ marginTop: 14, fontSize: 13, padding: '6px 16px' }}>
                  {report.personality_type}
                </div>

                <div style={{ marginTop: 20, textAlign: 'left' }}>
                  {dims.map(d => (
                    <AnimatedScoreBar key={d.label} label={d.label} value={d.val} color={d.color} />
                  ))}
                </div>
              </div>

              {/* Personality types */}
              <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 14, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 14 }}>Financial Personality Types</div>
                {[
                  { type: 'Saver',            range: '80–100', desc: 'Disciplined, consistent, puts money aside regularly', color: 'var(--teal-600)', bg: 'rgba(20,184,166,0.08)', border: 'rgba(20,184,166,0.2)' },
                  { type: 'Balanced Spender', range: '55–79',  desc: 'Healthy balance between spending and saving',         color: '#2563eb',          bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)' },
                  { type: 'Impulsive Spender',range: '30–54',  desc: 'High discretionary spending, reactive purchases',    color: 'var(--amber-500)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
                  { type: 'Risk Taker',        range: '0–29',   desc: 'High spending volatility, unpredictable patterns',   color: 'var(--red-500)',   bg: 'rgba(239,68,68,0.06)',  border: 'rgba(239,68,68,0.15)' },
                ].map(p => (
                  <div key={p.type} style={{
                    padding: '12px 14px', borderRadius: 10, marginBottom: 10,
                    background: report.personality_type === p.type ? p.bg : 'var(--bg-secondary)',
                    border: `1px solid ${report.personality_type === p.type ? p.border : 'var(--border-color)'}`,
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: report.personality_type === p.type ? p.color : 'var(--navy-800)' }}>
                        {p.type}
                        {report.personality_type === p.type && <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', marginLeft: 8, padding: '1px 6px', background: p.bg, border: `1px solid ${p.border}`, borderRadius: 10, color: p.color }}>YOU</span>}
                      </div>
                      <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Score {p.range}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            {report.insights && (() => {
              const ins = typeof report.insights === 'string' ? JSON.parse(report.insights) : report.insights
              return Array.isArray(ins) && ins.length > 0 ? (
                <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 14, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 14 }}>AI-Generated Insights</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                    {ins.map((item, idx) => (
                      <div key={idx} style={{
                        borderRadius: 10, padding: '14px 16px',
                        background: item.type === 'warning' ? 'rgba(245,158,11,0.06)' : item.type === 'positive' ? 'rgba(20,184,166,0.06)' : 'rgba(59,130,246,0.06)',
                        border: `1px solid ${item.type === 'warning' ? 'rgba(245,158,11,0.2)' : item.type === 'positive' ? 'rgba(20,184,166,0.15)' : 'rgba(59,130,246,0.15)'}`,
                      }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: 6, color: item.type === 'warning' ? 'var(--amber-500)' : item.type === 'positive' ? 'var(--teal-600)' : '#2563eb', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {item.type}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 4 }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            })()}
          </>
        )}
      </div>
    </div>
  )
}