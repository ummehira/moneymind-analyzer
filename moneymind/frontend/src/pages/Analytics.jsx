import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Analytics() {
  const { formatAmount } = useAuth()
  const [cats, setCats]     = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/analytics/by-category'), api.get('/analytics/summary')])
      .then(([c, s]) => { setCats(c.data.data); setSummary(s.data.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const total = cats.reduce((s, c) => s + Number(c.total), 0)

  return (
    <div>
      <div style={{ background:'var(--navy-800)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'16px 28px' }}>
        <div style={{ fontSize:20, fontWeight:800 }}>Analytics</div>
      </div>
      <div style={{ padding:'24px 28px' }}>
        {loading ? <div style={{ color:'var(--gray-500)', textAlign:'center', padding:40 }}>Loading analytics...</div> : (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
              {[{label:'Income',val:summary?.income,color:'var(--teal-400)'},{label:'Expenses',val:summary?.expense,color:'var(--red-500)'},{label:'Savings Rate',val:`${summary?.savingsRate||0}%`,color:'var(--cyan-400)'}].map(s=>(
                <div key={s.label} className="card" style={{padding:'16px 20px'}}>
                  <div style={{fontSize:11,color:'var(--gray-500)',fontFamily:'var(--font-mono)',textTransform:'uppercase',marginBottom:6}}>{s.label}</div>
                  <div style={{fontSize:24,fontWeight:800,color:s.color}}>{typeof s.val==='string'?s.val:formatAmount(s.val||0)}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>Spending by Category</div>
              {cats.length === 0 ? <div style={{color:'var(--gray-500)',fontSize:13}}>No expense data yet.</div> :
              cats.map(c => (
                <div key={c.name} style={{marginBottom:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:13}}>
                    <span style={{color:'var(--gray-300)'}}>{c.name}</span>
                    <span style={{fontFamily:'var(--font-mono)',color:c.color||'var(--teal-400)',fontWeight:600}}>{formatAmount(c.total)}</span>
                  </div>
                  <div style={{height:7,background:'var(--navy-600)',borderRadius:4,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${total>0?(Number(c.total)/total*100):0}%`,background:c.color||'var(--teal-500)',borderRadius:4,transition:'width 0.8s ease'}}/>
                  </div>
                  <div style={{fontSize:10,color:'var(--gray-600)',fontFamily:'var(--font-mono)',marginTop:2}}>{total>0?(Number(c.total)/total*100).toFixed(1):0}% of total</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
