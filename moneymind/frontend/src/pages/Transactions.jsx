import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Rental Income', 'Investment', 'Other Income']
const EXPENSE_CATEGORIES_DEFAULT = []

export default function Transactions() {
  const { formatAmount } = useAuth()
  const [txs, setTxs]         = useState([])
  const [cats, setCats]       = useState([])
  const [filter, setFilter]   = useState('all')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]       = useState({ description:'', amount:'', type:'expense', category_id:'', date: new Date().toISOString().split('T')[0], notes:'' })
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [tRes, cRes] = await Promise.all([
        api.get(`/expenses?limit=50${filter !== 'all' ? `&type=${filter}` : ''}`),
        api.get('/expenses/categories'),
      ])
      setTxs(tRes.data.data)
      setCats(cRes.data.data)
    } catch(e) { console.error(e) } finally { setLoading(false) }
  }, [filter])

  useEffect(() => { load() }, [load])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await api.post('/expenses', { ...form, amount: Number(form.amount) })
      setShowModal(false)
      setForm({ description:'', amount:'', type:'expense', category_id:'', date: new Date().toISOString().split('T')[0], notes:'' })
      load()
    } catch(err) { setError(err.response?.data?.error || 'Failed to add transaction') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return
    await api.delete(`/expenses/${id}`)
    load()
  }

  const switchType = (t) => {
    setForm({ ...form, type: t, category_id: '' })
  }

  // For expense: use DB categories (excluding income-only ones)
  const expenseCats = cats.filter(c => !['Salary','Freelance','Business'].includes(c.name))

  return (
    <div>
      {/* Topbar */}
      <div style={{ background:'white', borderBottom:'1px solid var(--border-color)', padding:'16px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'var(--shadow-sm)' }}>
        <div>
          <div style={{ fontSize:20, fontWeight:800, color:'var(--navy-800)' }}>Transactions</div>
          <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginTop:2 }}>All your income and expense records</div>
        </div>
        <button className="btn btn-primary" style={{ fontSize:13 }} onClick={() => setShowModal(true)}>+ Add Transaction</button>
      </div>

      <div style={{ padding:'24px 28px' }}>
        {/* Filter tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {['all','income','expense'].map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{
                padding:'7px 20px', borderRadius:8, fontSize:12, fontWeight:600,
                fontFamily:'var(--font-mono)', cursor:'pointer', transition:'all 0.15s',
                background: filter===t ? 'var(--navy-800)' : 'white',
                color: filter===t ? 'white' : 'var(--text-muted)',
                border: filter===t ? 'none' : '1px solid var(--border-color)',
                boxShadow: filter===t ? 'var(--shadow-sm)' : 'none',
              }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Transaction list */}
        <div className="card" style={{ padding:0, overflow:'hidden', background:'white' }}>
          {loading
            ? <div style={{ padding:40, textAlign:'center', color:'var(--text-muted)' }}>Loading...</div>
            : txs.length === 0
              ? <div style={{ padding:40, textAlign:'center', color:'var(--text-muted)', fontSize:14 }}>No transactions found. Add your first one!</div>
              : txs.map((tx, i) => (
                <div key={tx.id}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 20px', borderBottom: i < txs.length-1 ? '1px solid var(--border-color)' : 'none', transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  {/* Type indicator */}
                  <div style={{
                    width:36, height:36, borderRadius:9, flexShrink:0,
                    background: tx.type==='income' ? 'rgba(20,184,166,0.1)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${tx.type==='income' ? 'rgba(20,184,166,0.25)' : 'rgba(239,68,68,0.2)'}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:16, fontWeight:700,
                    color: tx.type==='income' ? 'var(--teal-600)' : 'var(--red-500)',
                  }}>
                    {tx.type==='income' ? '↑' : '↓'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:500, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{tx.description}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginTop:1 }}>
                      {tx.category_name || 'Uncategorized'} • {tx.date}
                    </div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color: tx.type==='income'?'var(--teal-600)':'var(--red-500)', fontFamily:'var(--font-mono)', flexShrink:0 }}>
                    {tx.type==='income' ? '+' : '-'}{formatAmount(tx.amount)}
                  </div>
                  <button onClick={() => handleDelete(tx.id)} className="btn btn-danger" style={{ padding:'5px 12px', fontSize:11, flexShrink:0 }}>Delete</button>
                </div>
              ))
          }
        </div>
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <div
          style={{ position:'fixed', inset:0, background:'rgba(15,41,66,0.35)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}
          onClick={e => e.target===e.currentTarget && setShowModal(false)}
        >
          <div style={{ background:'white', borderRadius:16, padding:28, width:460, border:'1px solid var(--border-color)', boxShadow:'0 20px 60px rgba(15,41,66,0.15)' }}>

            {/* Modal header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontSize:18, fontWeight:800, color:'var(--navy-800)' }}>Add Transaction</div>
              <button onClick={() => setShowModal(false)} style={{ background:'var(--bg-secondary)', border:'1px solid var(--border-color)', borderRadius:8, width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:16, color:'var(--text-muted)' }}>×</button>
            </div>

            {error && (
              <div style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'var(--red-500)', marginBottom:14 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleAdd}>

              {/* Income / Expense toggle */}
              <div style={{ display:'flex', gap:8, marginBottom:20, background:'var(--bg-secondary)', padding:4, borderRadius:10, border:'1px solid var(--border-color)' }}>
                {['expense','income'].map(t => (
                  <button key={t} type="button" onClick={() => switchType(t)}
                    style={{
                      flex:1, padding:'9px', borderRadius:8, fontSize:13, fontWeight:700,
                      cursor:'pointer', transition:'all 0.15s', fontFamily:'var(--font-head)',
                      border: 'none',
                      background: form.type===t
                        ? (t==='income' ? 'var(--teal-600)' : 'var(--red-500)')
                        : 'transparent',
                      color: form.type===t ? 'white' : 'var(--text-muted)',
                      boxShadow: form.type===t ? 'var(--shadow-sm)' : 'none',
                    }}>
                    {t === 'income' ? '↑ Income' : '↓ Expense'}
                  </button>
                ))}
              </div>

              {/* Description */}
              <div style={{ marginBottom:14 }}>
                <label className="input-label">
                  {form.type === 'income' ? 'Income Source' : 'What did you spend on?'}
                </label>
                <input className="input" required
                  value={form.description}
                  onChange={e => setForm({...form, description:e.target.value})}
                  placeholder={form.type === 'income' ? 'e.g. Monthly Salary, Freelance Payment' : 'e.g. Grocery Shopping, Electricity Bill'}
                />
              </div>

              {/* Amount + Date */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
                <div>
                  <label className="input-label">Amount (PKR)</label>
                  <input className="input" type="number" required min="1"
                    value={form.amount}
                    onChange={e => setForm({...form, amount:e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="input-label">Date</label>
                  <input className="input" type="date" required
                    value={form.date}
                    onChange={e => setForm({...form, date:e.target.value})}
                  />
                </div>
              </div>

              {/* Category — different for income vs expense */}
              <div style={{ marginBottom:14 }}>
                {form.type === 'income' ? (
                  <>
                    <label className="input-label">Income Type</label>
                    <select className="input" value={form.category_id}
                      onChange={e => setForm({...form, category_id:e.target.value})}
                      style={{ appearance:'none' }}>
                      <option value="">Select income type</option>
                      {cats.filter(c => ['Salary','Freelance','Business','Other'].includes(c.name)).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:5, fontFamily:'var(--font-mono)' }}>
                      e.g. Salary = monthly job pay, Freelance = project-based income
                    </p>
                  </>
                ) : (
                  <>
                    <label className="input-label">Spending Category</label>
                    <select className="input" value={form.category_id}
                      onChange={e => setForm({...form, category_id:e.target.value})}
                      style={{ appearance:'none' }}>
                      <option value="">Select category</option>
                      {expenseCats.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:5, fontFamily:'var(--font-mono)' }}>
                      e.g. Food & Dining = restaurants/groceries, Transport = Uber/petrol
                    </p>
                  </>
                )}
              </div>

              {/* Notes */}
              <div style={{ marginBottom:20 }}>
                <label className="input-label">Notes (optional)</label>
                <input className="input"
                  value={form.notes}
                  onChange={e => setForm({...form, notes:e.target.value})}
                  placeholder="Any extra detail about this transaction..."
                />
              </div>

              {/* Buttons */}
              <div style={{ display:'flex', gap:10 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex:2, justifyContent:'center', fontSize:14 }}>
                  {saving ? 'Saving...' : `Add ${form.type === 'income' ? 'Income' : 'Expense'}`}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}