import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const CAT_ICONS = {
  'Housing': 'H',
  'Food & Dining': 'F',
  'Transport': 'T',
  'Shopping': 'S',
  'Entertainment': 'E',
  'Healthcare': '+',
  'Salary': '$',
  'Freelance': 'FL',
  'Business': 'B',
  'Utilities': 'U',
  'Education': 'ED',
  'Other': 'O',
}

const MetricCard = ({ label, value, change, changeDir, color, icon }) => (
  <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
          {label}
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: color || 'var(--navy-800)', letterSpacing: -0.5, marginBottom: 6 }}>
          {value}
        </div>
        {change && (
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: changeDir === 'up' ? 'var(--teal-600)' : changeDir === 'down' ? 'var(--red-500)' : 'var(--text-muted)' }}>
            {changeDir === 'up' ? '▲' : changeDir === 'down' ? '▼' : '—'} {change}
          </div>
        )}
      </div>
      {icon && (
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
          {icon}
        </div>
      )}
    </div>
  </div>
)

export default function Dashboard() {
  const { formatAmount, currency } = useAuth()
  const navigate = useNavigate()
  const [summary, setSummary]   = useState(null)
  const [recent, setRecent]     = useState([])
  const [behavior, setBehavior] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, tRes, bRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/expenses?limit=5'),
          api.get('/behavior/report'),
        ])
        setSummary(sRes.data.data)
        setRecent(tRes.data.data)
        setBehavior(bRes.data.data)
      } catch(e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="skeleton" style={{ height: 300 }} />
        <div className="skeleton" style={{ height: 300 }} />
      </div>
    </div>
  )

  return (
    <div>

      {/* Topbar */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy-800)', letterSpacing: -0.5 }}>
            Financial Overview
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} — {currency}
          </div>
        </div>
        <button
          className="btn btn-primary"
          style={{ fontSize: 13 }}
          onClick={() => navigate('/transactions')}
        >
          + Add Transaction
        </button>
      </div>

      <div style={{ padding: '24px 28px' }}>

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
          <MetricCard
            label="Total Income"
            value={formatAmount(summary?.income || 0)}
            color="var(--teal-600)"
            icon="$"
            change={`${summary?.incomeChange || 0}% vs last month`}
            changeDir={Number(summary?.incomeChange) >= 0 ? 'up' : 'down'}
          />
          <MetricCard
            label="Total Expenses"
            value={formatAmount(summary?.expense || 0)}
            color="var(--red-500)"
            icon="-"
            change={`${summary?.expenseChange || 0}% vs last month`}
            changeDir={Number(summary?.expenseChange) > 0 ? 'down' : 'up'}
          />
          <MetricCard
            label="Net Savings"
            value={formatAmount(summary?.savings || 0)}
            color="var(--navy-800)"
            icon="+"
            change={`${summary?.savingsRate || 0}% savings rate`}
            changeDir="neutral"
          />
          <MetricCard
            label="Behavior Score"
            value={behavior ? `${behavior.score}/100` : '—'}
            color="var(--teal-600)"
            icon="AI"
            change={behavior?.personality_type || 'Analyzing...'}
            changeDir="neutral"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

          {/* Recent Transactions */}
          <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: 20,
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-800)' }}>
                Recent Transactions
              </div>
              <button
                onClick={() => navigate('/transactions')}
                style={{ fontSize: 11, color: 'var(--teal-600)', fontFamily: 'var(--font-mono)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                View All →
              </button>
            </div>

            {recent.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 20px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--text-muted)', margin: '0 auto 10px', fontFamily: 'var(--font-mono)' }}>
                  $
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                  No transactions yet
                </div>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: 12, padding: '8px 16px' }}
                  onClick={() => navigate('/transactions')}
                >
                  Add First Transaction
                </button>
              </div>
            ) : (
              recent.map((tx, i) => (
                <div key={tx.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 0',
                  borderBottom: i < recent.length - 1 ? '1px solid var(--border-color)' : 'none',
                }}>

                  {/* Category icon */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: tx.type === 'income' ? 'rgba(20,184,166,0.1)' : 'rgba(239,68,68,0.07)',
                    border: `1px solid ${tx.type === 'income' ? 'rgba(20,184,166,0.2)' : 'rgba(239,68,68,0.15)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: tx.type === 'income' ? 'var(--teal-600)' : 'var(--red-500)',
                  }}>
                    {CAT_ICONS[tx.category_name] || 'O'}
                  </div>

                  {/* Description and category */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.description}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>
                      {tx.category_name || 'Uncategorized'} • {tx.date}
                    </div>
                  </div>

                  {/* Amount */}
                  <div style={{
                    fontSize: 13, fontWeight: 700, flexShrink: 0,
                    color: tx.type === 'income' ? 'var(--teal-600)' : 'var(--red-500)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                  </div>

                </div>
              ))
            )}
          </div>

          {/* AI Behavior Intelligence */}
          <div style={{
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: 20,
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 16 }}>
              AI Behavior Intelligence
            </div>

            {behavior ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div style={{
                    fontSize: 52, fontWeight: 900, lineHeight: 1,
                    background: 'var(--gradient-brand)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {behavior.score}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                    BEHAVIOR SCORE / 100
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden', margin: '12px 0', border: '1px solid var(--border-color)' }}>
                    <div style={{ height: '100%', width: `${behavior.score}%`, background: 'var(--gradient-brand)', borderRadius: 3 }} />
                  </div>
                  <div className="badge badge-teal" style={{ fontSize: 12 }}>
                    {behavior.personality_type}
                  </div>
                </div>

                {behavior.insights && (() => {
                  const ins = typeof behavior.insights === 'string' ? JSON.parse(behavior.insights) : behavior.insights
                  return (Array.isArray(ins) ? ins.slice(0, 2) : []).map((item, idx) => (
                    <div key={idx} style={{
                      borderRadius: 9, padding: '10px 12px', marginBottom: 8,
                      fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
                      background: item.type === 'warning'
                        ? 'rgba(245,158,11,0.06)'
                        : item.type === 'positive'
                          ? 'rgba(20,184,166,0.06)'
                          : 'rgba(59,130,246,0.06)',
                      border: `1px solid ${item.type === 'warning'
                        ? 'rgba(245,158,11,0.15)'
                        : item.type === 'positive'
                          ? 'rgba(20,184,166,0.15)'
                          : 'rgba(59,130,246,0.15)'}`,
                    }}>
                      <strong style={{ color: 'var(--navy-800)' }}>{item.title}.</strong> {item.message}
                    </div>
                  ))
                })()}

                <button
                  onClick={() => navigate('/behavior')}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 12, marginTop: 8 }}
                >
                  View Full Behavior Report →
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '28px 20px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', margin: '0 auto 10px', fontFamily: 'var(--font-mono)' }}>
                  AI
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                  Add transactions to generate your AI behavior report
                </div>
                <button
                  className="btn btn-outline"
                  style={{ fontSize: 12, padding: '8px 16px' }}
                  onClick={() => navigate('/transactions')}
                >
                  Add Transactions
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
