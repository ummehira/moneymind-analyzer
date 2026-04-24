import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CURRENCIES = [
  { code:'PKR', name:'Pakistani Rupee', symbol:'Rs.' },
  { code:'USD', name:'US Dollar', symbol:'$' },
  { code:'EUR', name:'Euro', symbol:'€' },
  { code:'GBP', name:'British Pound', symbol:'£' },
  { code:'AED', name:'UAE Dirham', symbol:'AED' },
  { code:'SAR', name:'Saudi Riyal', symbol:'SAR' },
  { code:'INR', name:'Indian Rupee', symbol:'₹' },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]       = useState({ name:'', email:'', password:'', currency:'PKR' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setError(''); setLoading(true)
    try { await register(form.name, form.email, form.password, form.currency); navigate('/dashboard') }
    catch(err) { setError(err.response?.data?.error || 'Registration failed.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #ffffff 0%, #f0fdfa 50%, #e0f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <img src="/logo.png" alt="MoneyMind" style={{ height: 52, width: 52, objectFit: 'contain' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: 22 }}>
                <span style={{ color: 'var(--navy-800)' }}>Money</span>
                <span style={{ color: 'var(--teal-600)' }}>Mind</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase' }}>Analyzer</div>
            </div>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--navy-800)' }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>Start your free financial intelligence journey</p>
        </div>

        <div className="card" style={{ padding: 32, background: 'white' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--red-500)', marginBottom: 20 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Full Name</label>
              <input className="input" type="text" placeholder="Ali Hassan" required value={form.name} onChange={set('name')} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Email Address</label>
              <input className="input" type="email" placeholder="ali@example.com" required value={form.email} onChange={set('email')} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="input-label">Password</label>
              <input className="input" type="password" placeholder="Min. 6 characters" required value={form.password} onChange={set('password')} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="input-label">Default Currency</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7 }}>
                {CURRENCIES.map(c => (
                  <button key={c.code} type="button" onClick={() => setForm({ ...form, currency: c.code })}
                    style={{
                      padding: '9px 6px', borderRadius: 9, fontSize: 12, fontWeight: 700,
                      border: form.currency === c.code ? '2px solid var(--teal-500)' : '1px solid var(--border-color)',
                      background: form.currency === c.code ? 'rgba(20,184,166,0.08)' : 'var(--bg-secondary)',
                      color: form.currency === c.code ? 'var(--teal-600)' : 'var(--text-muted)',
                      transition: 'all 0.15s', cursor: 'pointer', fontFamily: 'var(--font-mono)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                    }}>
                    <span style={{ fontSize: 13 }}>{c.symbol}</span>
                    <span>{c.code}</span>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 7, fontFamily: 'var(--font-mono)' }}>
                PKR recommended for Pakistani users.
              </p>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 15 }}>
              {loading ? 'Creating Account...' : 'Create Free Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--teal-600)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}