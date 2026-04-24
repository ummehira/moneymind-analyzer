import { useState } from 'react'
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

export default function Settings() {
  const { user, currency, updateCurrency } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [selected, setSelected] = useState(currency)

  const save = async () => {
    setSaving(true)
    try { await updateCurrency(selected); setSaved(true); setTimeout(()=>setSaved(false),2500) }
    catch(e){ console.error(e) } finally { setSaving(false) }
  }

  return (
    <div>
      <div style={{background:'var(--navy-800)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'16px 28px'}}>
        <div style={{fontSize:20,fontWeight:800}}>Settings</div>
      </div>
      <div style={{padding:'24px 28px',maxWidth:600}}>
        <div className="card" style={{marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>Account Information</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div><label className="input-label">Full Name</label><input className="input" defaultValue={user?.name} readOnly style={{opacity:0.7}}/></div>
            <div><label className="input-label">Email</label><input className="input" defaultValue={user?.email} readOnly style={{opacity:0.7}}/></div>
          </div>
          <div style={{marginTop:12}}><label className="input-label">Plan</label>
            <div style={{padding:'9px 14px',background:'var(--navy-600)',borderRadius:'var(--radius-md)',fontSize:13,textTransform:'capitalize',display:'flex',alignItems:'center',gap:8}}>
              <span className="badge badge-teal">{user?.plan||'free'}</span>
              <span style={{color:'var(--gray-400)'}}>Current plan</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>Currency Preference</div>
          <div style={{fontSize:12,color:'var(--gray-500)',marginBottom:16}}>All amounts, reports and insights will use this currency. PKR is default for Pakistani users.</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:20}}>
            {CURRENCIES.map(c=>(
              <button key={c.code} type="button" onClick={()=>setSelected(c.code)}
                style={{padding:'10px 8px',borderRadius:10,border:`${selected===c.code?'2px solid var(--teal-500)':'1px solid rgba(255,255,255,0.1)'}`,
                  background:selected===c.code?'rgba(20,184,166,0.12)':'var(--navy-800)',
                  color:selected===c.code?'var(--teal-400)':'var(--gray-400)',
                  cursor:'pointer',transition:'all 0.15s',display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                <span style={{fontSize:16,fontWeight:700}}>{c.symbol}</span>
                <span style={{fontSize:11,fontFamily:'var(--font-mono)',fontWeight:600}}>{c.code}</span>
                <span style={{fontSize:9,color:'var(--gray-600)',textAlign:'center',lineHeight:1.3}}>{c.name}</span>
              </button>
            ))}
          </div>
          <button onClick={save} disabled={saving} className="btn btn-primary" style={{fontSize:13}}>
            {saving?'Saving..':saved?'Saved!':'Save Currency'}
          </button>
        </div>
      </div>
    </div>
  )
}
