import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function AnimatedBar({ pct, color }) {
  const [width, setWidth] = useState(0)
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setWidth(Math.min(pct, 100)), 100)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [pct])

  return (
    <div ref={ref} style={{ height: 12, background: 'var(--bg-tertiary)', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <div style={{
        height: '100%',
        width: `${width}%`,
        background: color || 'var(--gradient-brand)',
        borderRadius: 6,
        transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }} />
    </div>
  )
}

export default function Savings() {
  const { formatAmount, currency } = useAuth()
  const [goals, setGoals]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [form, setForm]           = useState({ title: '', min_amount: '', max_amount: '', target_date: '' })

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/savings')
      setGoals(data.data)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await api.post('/savings', {
        title: form.title,
        min_amount: Number(form.min_amount),
        max_amount: Number(form.max_amount),
        target_date: form.target_date || null,
      })
      setShowModal(false)
      setForm({ title: '', min_amount: '', max_amount: '', target_date: '' })
      load()
    } catch(err) {
      setError(err.response?.data?.error || 'Failed to create goal')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this savings goal?')) return
    await api.delete(`/savings/${id}`)
    load()
  }

  const getStatus = (goal) => {
    const current = Number(goal.current_savings)
    const min     = Number(goal.min_amount)
    const max     = Number(goal.max_amount)
    if (current >= max) return { label: 'Goal Achieved', color: 'var(--teal-600)', bg: 'rgba(20,184,166,0.08)', border: 'rgba(20,184,166,0.2)' }
    if (current >= min) return { label: 'On Track', color: '#2563eb', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)' }
    if (current > 0)    return { label: 'In Progress', color: 'var(--amber-500)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' }
    return { label: 'Not Started', color: 'var(--text-muted)', bg: 'var(--bg-secondary)', border: 'var(--border-color)' }
  }

  const getPct = (goal) => {
    const current = Number(goal.current_savings)
    const max     = Number(goal.max_amount)
    if (max <= 0 || current <= 0) return 0
    return Math.min((current / max) * 100, 100)
  }

  const getBarColor = (goal) => {
    const pct = getPct(goal)
    if (pct >= 100) return 'var(--teal-500)'
    if (pct >= 50)  return '#3b82f6'
    if (pct >= 25)  return 'var(--amber-500)'
    return 'var(--red-500)'
  }

  return (
    <div>
      {/* Topbar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border-color)', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy-800)' }}>Savings Goals</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            Set a monthly savings range and track your progress
          </div>
        </div>
        <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setShowModal(true)}>
          + New Goal
        </button>
      </div>

      <div style={{ padding: '24px 28px' }}>

        {/* How it works */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdfa, #e0f2fe)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(20,184,166,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--teal-600)', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>?</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 4 }}>How Savings Goals Work</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Set a <strong>minimum</strong> and <strong>maximum</strong> savings target for the month. For example: save between <strong>Rs. 10,000</strong> (minimum) and <strong>Rs. 20,000</strong> (maximum). The system tracks your actual net savings (income minus expenses) and shows how close you are to your goal range.
            </div>
          </div>
        </div>

        {/* Goals list */}
        {loading ? (
          <div style={{ display: 'grid', gap: 14 }}>
            {[1,2].map(i => <div key={i} className="skeleton" style={{ height: 140 }} />)}
          </div>
        ) : goals.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 14, padding: '48px 24px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--text-muted)' }}>$</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 6 }}>No savings goals yet</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Create your first goal to start tracking your monthly savings</div>
            <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setShowModal(true)}>Create First Goal</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {goals.map(goal => {
              const status  = getStatus(goal)
              const pct     = getPct(goal)
              const current = Number(goal.current_savings)
              const min     = Number(goal.min_amount)
              const max     = Number(goal.max_amount)
              const minPct  = max > 0 ? Math.min((min / max) * 100, 100) : 0

              return (
                <div key={goal.id} style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 14, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy-800)', marginBottom: 4 }}>{goal.title}</div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, fontFamily: 'var(--font-mono)', fontWeight: 600, background: status.bg, border: `1px solid ${status.border}`, color: status.color }}>
                          {status.label}
                        </span>
                        {goal.target_date && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            Target: {goal.target_date}
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(goal.id)} className="btn btn-danger" style={{ fontSize: 11, padding: '5px 12px' }}>Remove</button>
                  </div>

                  {/* Range display */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 14px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 3 }}>Min Target</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-800)' }}>{formatAmount(min)}</div>
                    </div>
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 14px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 3 }}>Max Target</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-800)' }}>{formatAmount(max)}</div>
                    </div>
                    <div style={{ background: current >= min ? 'rgba(20,184,166,0.06)' : 'rgba(239,68,68,0.04)', borderRadius: 10, padding: '10px 14px', border: `1px solid ${current >= min ? 'rgba(20,184,166,0.2)' : 'rgba(239,68,68,0.15)'}` }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 3 }}>Current Savings</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: current >= min ? 'var(--teal-600)' : current > 0 ? 'var(--amber-500)' : 'var(--red-500)' }}>
                        {current > 0 ? formatAmount(current) : 'Rs. 0'}
                      </div>
                    </div>
                  </div>

                  {/* Animated progress bar */}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                      <span>0%</span>
                      <span style={{ color: 'var(--navy-800)', fontWeight: 600 }}>{pct.toFixed(0)}% of max goal</span>
                      <span>100%</span>
                    </div>
                    <div style={{ position: 'relative', height: 12, background: 'var(--bg-tertiary)', borderRadius: 6, overflow: 'visible', border: '1px solid var(--border-color)' }}>
                      {/* Min marker line */}
                      <div style={{ position: 'absolute', left: `${minPct}%`, top: -4, bottom: -4, width: 2, background: 'var(--navy-500)', borderRadius: 1, zIndex: 2 }} />
                      {/* Animated fill */}
                      <div style={{ position: 'relative', height: '100%', overflow: 'hidden', borderRadius: 6 }}>
                        <AnimatedBar pct={pct} color={getBarColor(goal)} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                      <span>Start</span>
                      <span style={{ color: 'var(--navy-600)', fontWeight: 600 }}>Min: {minPct.toFixed(0)}%</span>
                      <span>Max Goal</span>
                    </div>
                  </div>

                  {/* Message */}
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10, padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                    {current >= max
                      ? `Excellent! You have exceeded your maximum goal by ${formatAmount(current - max)}.`
                      : current >= min
                        ? `You are within your target range. You need ${formatAmount(max - current)} more to hit the maximum goal.`
                        : current > 0
                          ? `You need ${formatAmount(min - current)} more to reach your minimum target of ${formatAmount(min)}.`
                          : `Start saving to reach your minimum target of ${formatAmount(min)} this month.`
                    }
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,41,66,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, width: 460, border: '1px solid var(--border-color)', boxShadow: '0 20px 60px rgba(15,41,66,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--navy-800)' }}>New Savings Goal</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)' }}>x</button>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--red-500)', marginBottom: 14 }}>{error}</div>
            )}

            <form onSubmit={handleAdd}>
              <div style={{ marginBottom: 14 }}>
                <label className="input-label">Goal Name</label>
                <input className="input" required placeholder="e.g. Monthly Emergency Fund, Eid Savings"
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>

              <div style={{ background: 'linear-gradient(135deg,#f0fdfa,#e0f2fe)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 10, padding: '12px 14px', marginBottom: 14, fontSize: 12, color: 'var(--teal-600)', lineHeight: 1.7 }}>
                Set a <strong>range</strong> — not a single fixed number. This gives you flexibility. For example: minimum Rs. 10,000 and maximum Rs. 25,000 means anywhere in that range is acceptable.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label className="input-label">Minimum Amount ({currency})</label>
                  <input className="input" type="number" required min="1" placeholder="e.g. 10000"
                    value={form.min_amount} onChange={e => setForm({ ...form, min_amount: e.target.value })} />
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Lowest acceptable saving</p>
                </div>
                <div>
                  <label className="input-label">Maximum Amount ({currency})</label>
                  <input className="input" type="number" required min="1" placeholder="e.g. 25000"
                    value={form.max_amount} onChange={e => setForm({ ...form, max_amount: e.target.value })} />
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Your ideal saving target</p>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="input-label">Target Date (Optional)</label>
                <input className="input" type="date"
                  value={form.target_date} onChange={e => setForm({ ...form, target_date: e.target.value })} />
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>Leave blank for ongoing monthly goal</p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 2, justifyContent: 'center', fontSize: 14 }}>
                  {saving ? 'Creating...' : 'Create Savings Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}