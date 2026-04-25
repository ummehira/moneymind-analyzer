import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const CURRENCIES = [
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs.' },
  { code: 'USD', name: 'US Dollar',        symbol: '$' },
  { code: 'EUR', name: 'Euro',             symbol: '€' },
  { code: 'GBP', name: 'British Pound',    symbol: '£' },
  { code: 'AED', name: 'UAE Dirham',       symbol: 'AED' },
  { code: 'SAR', name: 'Saudi Riyal',      symbol: 'SAR' },
  { code: 'INR', name: 'Indian Rupee',     symbol: '₹' },
]

// ── Two Factor Section ──────────────────────────────────────────
function TwoFactorSection({ user }) {
  const [step, setStep]       = useState('idle')
  const [code, setCode]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [devCode, setDevCode] = useState('')
  const [success, setSuccess] = useState('')

  const sendCode = async () => {
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/2fa/send')
      setDevCode(data.dev_code || '')
      setStep('sent')
    } catch(err) {
      setError(err.response?.data?.error || 'Failed to send code')
    } finally { setLoading(false) }
  }

  const verifyCode = async () => {
    if (code.length !== 6) { setError('Enter the 6-digit code'); return }
    setLoading(true); setError('')
    try {
      await api.post('/auth/2fa/verify', { code })
      setStep('done')
      setSuccess('Two-factor authentication enabled successfully!')
    } catch(err) {
      setError(err.response?.data?.error || 'Invalid code')
    } finally { setLoading(false) }
  }

  if (step === 'done' || user?.two_factor_enabled) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(20,184,166,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--teal-600)', fontSize: 12, flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
        ON
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal-600)' }}>2FA is Active</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          {success || 'Your account is protected with two-factor authentication'}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--red-500)', marginBottom: 12 }}>
          {error}
        </div>
      )}

      {step === 'idle' && (
        <div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--text-muted)', fontSize: 11, flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
              OFF
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-800)' }}>2FA is not enabled</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Enable it to add an extra layer of security to your account</div>
            </div>
          </div>
          <button onClick={sendCode} disabled={loading} className="btn btn-outline" style={{ fontSize: 13 }}>
            {loading ? 'Sending code...' : 'Enable Two-Factor Authentication'}
          </button>
        </div>
      )}

      {step === 'sent' && (
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.7, padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 9 }}>
            A 6-digit verification code has been generated. Enter it below to activate 2FA on your account.
          </div>
          {devCode && (
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#d97706', marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: 4 }}>DEV MODE — YOUR CODE:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 800, letterSpacing: 6, color: 'var(--navy-800)' }}>{devCode}</div>
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label className="input-label">Enter 6-Digit Code</label>
            <input
              className="input"
              type="text"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 22, letterSpacing: 8, textAlign: 'center', fontWeight: 700 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setStep('idle'); setCode(''); setError('') }} className="btn btn-ghost" style={{ fontSize: 13 }}>
              Cancel
            </button>
            <button onClick={verifyCode} disabled={loading || code.length !== 6} className="btn btn-primary" style={{ fontSize: 13, flex: 1, justifyContent: 'center' }}>
              {loading ? 'Verifying...' : 'Verify and Activate'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Change Password Section ─────────────────────────────────────
function ChangePasswordSection() {
  const [form, setForm]       = useState({ current: '', newPass: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [showFields, setShowFields] = useState(false)

  const handleSave = async () => {
    if (!form.current)              { setError('Current password is required'); return }
    if (form.newPass.length < 6)    { setError('New password must be at least 6 characters'); return }
    if (form.newPass !== form.confirm) { setError('Passwords do not match'); return }
    setLoading(true); setError(''); setSuccess('')
    try {
      await api.post('/auth/change-password', {
        current_password: form.current,
        new_password:     form.newPass,
      })
      setSuccess('Password changed successfully')
      setForm({ current: '', newPass: '', confirm: '' })
      setShowFields(false)
    } catch(err) {
      setError(err.response?.data?.error || 'Failed to change password')
    } finally { setLoading(false) }
  }

  return (
    <div>
      {!showFields ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy-800)' }}>Password</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Last changed: not tracked</div>
          </div>
          <button onClick={() => setShowFields(true)} className="btn btn-ghost" style={{ fontSize: 12 }}>
            Change Password
          </button>
        </div>
      ) : (
        <div>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--red-500)', marginBottom: 12 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--teal-600)', marginBottom: 12 }}>
              {success}
            </div>
          )}
          <div style={{ display: 'grid', gap: 12, marginBottom: 14 }}>
            <div>
              <label className="input-label">Current Password</label>
              <input className="input" type="password" placeholder="Your current password"
                value={form.current} onChange={e => setForm({ ...form, current: e.target.value })} />
            </div>
            <div>
              <label className="input-label">New Password</label>
              <input className="input" type="password" placeholder="Min. 6 characters"
                value={form.newPass} onChange={e => setForm({ ...form, newPass: e.target.value })} />
            </div>
            <div>
              <label className="input-label">Confirm New Password</label>
              <input className="input" type="password" placeholder="Repeat new password"
                value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
              {form.newPass && form.confirm && form.newPass !== form.confirm && (
                <p style={{ fontSize: 11, color: 'var(--red-500)', marginTop: 4 }}>Passwords do not match</p>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setShowFields(false); setError(''); setForm({ current: '', newPass: '', confirm: '' }) }} className="btn btn-ghost" style={{ fontSize: 12 }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={loading} className="btn btn-primary" style={{ fontSize: 13, flex: 1, justifyContent: 'center' }}>
              {loading ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Settings Page ──────────────────────────────────────────
export default function Settings() {
  const { user, currency, updateCurrency } = useAuth()
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [selected, setSelected] = useState(currency)

  const saveCurrency = async () => {
    setSaving(true)
    try {
      await updateCurrency(selected)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch(e) { console.error(e) }
    finally { setSaving(false) }
  }

  const sectionTitle = (title, subtitle) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy-800)' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{subtitle}</div>}
    </div>
  )

  const divider = () => (
    <div style={{ height: 1, background: 'var(--border-color)', margin: '16px 0' }} />
  )

  return (
    <div>

      {/* Topbar */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 28px',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy-800)' }}>Settings</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
          Manage your account, security and preferences
        </div>
      </div>

      <div style={{ padding: '24px 28px', maxWidth: 640 }}>

        {/* ── Account Information ── */}
        <div className="card" style={{ marginBottom: 16, background: 'white' }}>
          {sectionTitle('Account Information', 'Your registered account details')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label className="input-label">Full Name</label>
              <input className="input" defaultValue={user?.name} readOnly
                style={{ opacity: 0.75, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label className="input-label">Email Address</label>
              <input className="input" defaultValue={user?.email} readOnly
                style={{ opacity: 0.75, cursor: 'not-allowed' }} />
            </div>
          </div>
          <div>
            <label className="input-label">Account Plan</label>
            <div style={{
              padding: '10px 14px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span className="badge badge-teal" style={{ fontSize: 11 }}>{user?.plan || 'free'}</span>
              <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                {user?.plan === 'premium' ? 'Premium plan — full access' : 'Free plan — core features included'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Currency Preference ── */}
        <div className="card" style={{ marginBottom: 16, background: 'white' }}>
          {sectionTitle('Currency Preference', 'All amounts, reports and insights will use this currency')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 18 }}>
            {CURRENCIES.map(c => (
              <button key={c.code} type="button" onClick={() => setSelected(c.code)}
                style={{
                  padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
                  transition: 'all 0.15s',
                  border: selected === c.code ? '2px solid var(--teal-500)' : '1px solid var(--border-color)',
                  background: selected === c.code ? 'rgba(20,184,166,0.08)' : 'var(--bg-secondary)',
                  color: selected === c.code ? 'var(--teal-600)' : 'var(--text-muted)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                }}>
                <span style={{ fontSize: 16, fontWeight: 800 }}>{c.symbol}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{c.code}</span>
                <span style={{ fontSize: 9, color: 'var(--text-light)', textAlign: 'center', lineHeight: 1.3 }}>{c.name}</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={saveCurrency} disabled={saving || selected === currency} className="btn btn-primary" style={{ fontSize: 13 }}>
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Currency'}
            </button>
            {saved && (
              <span style={{ fontSize: 12, color: 'var(--teal-600)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                Currency updated to {selected}
              </span>
            )}
          </div>
        </div>

        {/* ── Security ── */}
        <div className="card" style={{ marginBottom: 16, background: 'white' }}>
          {sectionTitle('Security', 'Manage your password and account protection')}

          {/* Change Password */}
          <ChangePasswordSection />

          {divider()}
        </div>

      </div>
    </div>
  )
}