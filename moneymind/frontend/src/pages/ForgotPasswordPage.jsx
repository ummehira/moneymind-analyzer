import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [step, setStep]       = useState('request') // request | sent
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [devLink, setDevLink] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/forgot-password', { email })
      if (data.dev_reset_link) setDevLink(data.dev_reset_link)
      setStep('sent')
    } catch(err) {
      setError(err.response?.data?.error || 'Something went wrong')
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
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, textTransform: 'uppercase' }}>Analyzer</div>
            </div>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--navy-800)' }}>
            {step === 'request' ? 'Forgot Password' : 'Check Your Email'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>
            {step === 'request'
              ? 'Enter your email and we will send you a reset link'
              : `We sent a reset link to ${email}`
            }
          </p>
        </div>

        <div className="card" style={{ padding: 32, background: 'white' }}>
          {step === 'request' ? (
            <>
              {error && (
                <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--red-500)', marginBottom: 20 }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label className="input-label">Email Address</label>
                  <input className="input" type="email" required placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 15 }}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(20,184,166,0.1)', border: '2px solid var(--teal-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22, color: 'var(--teal-600)', fontWeight: 700 }}>
                OK
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.7 }}>
                If your email is registered, you will receive a password reset link shortly. Check your inbox and spam folder.
              </p>
              {devLink && (
                <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: 12, marginBottom: 16, textAlign: 'left' }}>
                  <div style={{ fontSize: 10, color: 'var(--amber-500)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>DEV MODE — RESET LINK:</div>
                  <a href={devLink} style={{ fontSize: 11, color: 'var(--teal-600)', wordBreak: 'break-all' }}>{devLink}</a>
                </div>
              )}
              <button onClick={() => setStep('request')} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
                Try a different email
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Remember your password? <Link to="/login" style={{ color: 'var(--teal-600)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}