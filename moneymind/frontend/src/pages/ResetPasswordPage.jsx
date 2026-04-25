import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'

export default function ResetPasswordPage() {
  const [searchParams]          = useSearchParams()
  const navigate                = useNavigate()
  const token                   = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [done, setDone]         = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    try {
      await api.post('/auth/reset-password', { token, password })
      setDone(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch(err) {
      setError(err.response?.data?.error || 'Reset failed. Token may be expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#ffffff 0%,#f0fdfa 50%,#e0f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <img src="/logo.png" alt="MoneyMind" style={{ height: 52, width: 52, objectFit: 'contain' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: 22 }}>
                <span style={{ color: 'var(--navy-800)' }}>Money</span>
                <span style={{ color: 'var(--teal-600)' }}>Mind</span>
              </div>
            </div>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--navy-800)' }}>Set New Password</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>Choose a strong password for your account</p>
        </div>

        <div className="card" style={{ padding: 32, background: 'white' }}>
          {done ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(20,184,166,0.1)', border: '2px solid var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22, color: 'var(--teal-600)', fontWeight: 700 }}>OK</div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Password reset successfully. Redirecting to login...</p>
            </div>
          ) : (
            <>
              {!token && (
                <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: 12, fontSize: 13, color: 'var(--red-500)', marginBottom: 16 }}>
                  Invalid reset link. Please request a new one.
                </div>
              )}
              {error && (
                <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--red-500)', marginBottom: 16 }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 14 }}>
                  <label className="input-label">New Password</label>
                  <input className="input" type="password" required placeholder="Min. 6 characters"
                    value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label className="input-label">Confirm Password</label>
                  <input className="input" type="password" required placeholder="Repeat your password"
                    value={confirm} onChange={e => setConfirm(e.target.value)} />
                  {password && confirm && password !== confirm && (
                    <p style={{ fontSize: 11, color: 'var(--red-500)', marginTop: 5 }}>Passwords do not match</p>
                  )}
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading || !token}
                  style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 15 }}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          <Link to="/login" style={{ color: 'var(--teal-600)', fontWeight: 600 }}>Back to Login</Link>
        </p>
      </div>
    </div>
  )
}