import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Predictions() {
  const { formatAmount } = useAuth()
  const [eom, setEom]   = useState(null)
  const [risk, setRisk] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/predictions/eom'), api.get('/predictions/categories')])
      .then(([e, r]) => { setEom(e.data.data); setRisk(r.data.data) })
      .catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div style={{background:'var(--navy-800)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'16px 28px'}}>
        <div style={{fontSize:20,fontWeight:800}}>Prediction Engine</div>
      </div>
      <div style={{padding:'24px 28px'}}>
        {loading ? <div style={{color:'var(--gray-500)',textAlign:'center',padding:40}}>Running predictions...</div> : (
          <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
              {[
                {label:'Projected Savings',val:formatAmount(eom?.projectedSavings||0),color:'var(--teal-400)',sub:`${eom?.confidence||0}% confidence`},
                {label:'Overspend Risk',val:`${eom?.overspendRisk||0}%`,color:eom?.overspendRisk>60?'var(--red-500)':eom?.overspendRisk>30?'var(--amber-500)':'var(--teal-400)',sub:'This month'},
                {label:'Daily Burn Rate',val:formatAmount(eom?.dailyBurnRate||0),color:'var(--cyan-400)',sub:`${eom?.daysRemaining||0} days remaining`},
              ].map(s=>(
                <div key={s.label} className="card" style={{padding:'18px 20px'}}>
                  <div style={{fontSize:11,color:'var(--gray-500)',fontFamily:'var(--font-mono)',textTransform:'uppercase',marginBottom:8}}>{s.label}</div>
                  <div style={{fontSize:28,fontWeight:800,color:s.color,letterSpacing:-1}}>{s.val}</div>
                  <div style={{fontSize:11,color:'var(--gray-500)',fontFamily:'var(--font-mono)',marginTop:4}}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>Category Risk Assessment</div>
              {risk.length===0?<div style={{color:'var(--gray-500)',fontSize:13}}>Add transactions to see category risk.</div>:
              risk.map(r=>(
                <div key={r.category} style={{marginBottom:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:5,fontSize:13}}>
                    <span style={{color:'var(--gray-300)'}}>{r.category}</span>
                    <div style={{display:'flex',gap:10,alignItems:'center'}}>
                      <span style={{fontFamily:'var(--font-mono)',color:'var(--gray-400)',fontSize:12}}>avg {formatAmount(r.avgAmount)}</span>
                      <span className={`badge badge-${r.riskLevel==='high'?'red':r.riskLevel==='medium'?'amber':'green'}`}>{r.riskLevel.toUpperCase()}</span>
                    </div>
                  </div>
                  <div style={{height:6,background:'var(--navy-600)',borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:r.riskLevel==='high'?'75%':r.riskLevel==='medium'?'45%':'20%',background:r.riskLevel==='high'?'var(--red-500)':r.riskLevel==='medium'?'var(--amber-500)':'var(--teal-500)',borderRadius:3}}/>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
