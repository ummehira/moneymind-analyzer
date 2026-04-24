import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const MetricCard = ({ label, value, change, changeDir, color }) => (
  <div className="card" style={{ padding: '18px 20px' }}>
    <div style={{ fontSize: 11, color: 'var(--gray-500)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 800, color: color || 'var(--white)', letterSpacing: -1, marginBottom: 6 }}>{value}</div>
    {change && (
      <div style={{ fontSize: 11, color: changeDir === 'up' ? 'var(--teal-500)' : changeDir === 'down' ? 'var(--red-500)' : 'var(--gray-500)', fontFamily: 'var(--font-mono)' }}>
        {changeDir === 'up' ? '▲' : changeDir === 'down' ? '▼' : '—'} {change}
      </div>
    )}
  </div>
)

export default function Dashboard() {
  const { formatAmount, currency } = useAuth()
  const [summary, setSummary]     = useState(null)
  const [recent, setRecent]       = useState([])
  const [behavior, setBehavior]   = useState(null)
  const [loading, setLoading]     = useState(true)

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
      } catch (e) {
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
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 90 }} />)}
      </div>
    </div>
  )

  const CAT_ICONS = { 'Housing':'H','Food & Dining':'F','Transport':'T','Shopping':'S','Entertainment':'E','Healthcare':'+','Salary':'$','Freelance':'$','Other':'?' }

  return (
    <div>
      {/* Topbar */}
      <div style={{ background: 'var(--navy-800)', borderBottom: '1px solid rgb(255, 255, 255)', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>Financial Overview</div>
          <div style={{ fontSize: 11, color: 'var(--gray-500)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} — Currency: {currency}
          </div>
        </div>
        <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => window.location.href='/transactions'}>
          + Add Transaction
        </button>
      </div>

      <div style={{ padding: '24px 28px' }}>
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
          <MetricCard label="Total Income" value={formatAmount(summary?.income || 0)} color="var(--teal-400)" change={`${summary?.incomeChange || 0}% vs last month`} changeDir={Number(summary?.incomeChange) >= 0 ? 'up' : 'down'} />
          <MetricCard label="Total Expenses" value={formatAmount(summary?.expense || 0)} color="var(--red-500)" change={`${summary?.expenseChange || 0}% vs last month`} changeDir={Number(summary?.expenseChange) >= 0 ? 'down' : 'up'} />
          <MetricCard label="Net Savings" value={formatAmount(summary?.savings || 0)} color="var(--cyan-400)" change={`${summary?.savingsRate || 0}% savings rate`} changeDir="neutral" />
          <MetricCard label="Behavior Score" value={behavior ? `${behavior.score}/100` : '—'} color="var(--teal-400)" change={behavior?.personality_type || 'Analyzing...'} changeDir="neutral" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
          {/* Recent Transactions */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Recent Transactions</div>
              <a href="/transactions" style={{ fontSize: 11, color: 'var(--teal-400)', fontFamily: 'var(--font-mono)' }}>View All</a>
            </div>
            {recent.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-500)', fontSize: 13 }}>
                No transactions yet. Add your first one!
              </div>
            ) : recent.map(tx => (
              <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--navy-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                  {CAT_ICONS[tx.category_name] || '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray-500)', fontFamily: 'var(--font-mono)' }}>{tx.category_name || 'Uncategorized'} • {tx.date}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: tx.type === 'income' ? 'var(--teal-400)' : 'var(--red-500)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                  {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                </div>
              </div>
            ))}
          </div>

          {/* Behavior & AI Insights */}
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>AI Behavior Intelligence</div>
            {behavior ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 48, fontWeight: 800, background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>{behavior.score}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>BEHAVIOR SCORE / 100</div>
                  <div className="badge badge-teal" style={{ marginTop: 10 }}>{behavior.personality_type}</div>
                </div>
                {behavior.insights && (() => {
                  const ins = typeof behavior.insights === 'string' ? JSON.parse(behavior.insights) : behavior.insights
                  return (Array.isArray(ins) ? ins.slice(0,2) : []).map((i, idx) => (
                    <div key={idx} style={{ background: 'var(--navy-600)', borderRadius: 9, padding: '10px 12px', marginBottom: 8, fontSize: 12, color: 'var(--gray-300)', lineHeight: 1.6 }}>
                      <strong style={{ color: 'var(--white)' }}>{i.title}.</strong> {i.message}
                    </div>
                  ))
                })()}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-500)', fontSize: 13 }}>
                Add transactions to generate your AI behavior report.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
