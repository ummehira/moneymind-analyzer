import { useState, useEffect } from 'react'
import api from '../services/api'

export default function BehaviorAI() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    api.get('/behavior/report').then(r => setReport(r.data.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const refresh = async () => {
    setGenerating(true)
    try { const r = await api.get('/behavior/report?refresh=1'); setReport(r.data.data) }
    catch(e) { console.error(e) } finally { setGenerating(false) }
  }

  const dims = report ? [
    { label:'Savings Discipline', val: Math.round(Number(report.savings_rate)*100) },
    { label:'Impulse Control',    val: Math.round((1-Number(report.impulse_ratio))*100) },
    { label:'Consistency',        val: Math.round(Number(report.consistency_score)*100) },
  ] : []

  return (
    <div>
      <div style={{background:'var(--navy-800)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'16px 28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:20,fontWeight:800}}>Behavior AI</div>
        <button className="btn btn-outline" style={{fontSize:13}} onClick={refresh} disabled={generating}>{generating?'Analyzing...':'Re-analyze'}</button>
      </div>
      <div style={{padding:'24px 28px'}}>
        {loading ? <div style={{color:'var(--gray-500)',textAlign:'center',padding:40}}>Loading behavior analysis...</div> :
        !report ? <div style={{color:'var(--gray-500)',textAlign:'center',padding:40}}>Add transactions to generate your AI behavior report.</div> : (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div className="card" style={{textAlign:'center',padding:32}}>
              <div style={{fontSize:72,fontWeight:900,background:'var(--gradient-brand)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',lineHeight:1}}>{report.score}</div>
              <div style={{fontSize:12,color:'var(--gray-400)',fontFamily:'var(--font-mono)',marginTop:4}}>BEHAVIOR SCORE / 100</div>
              <div className="badge badge-teal" style={{marginTop:14,fontSize:14,padding:'7px 18px'}}>{report.personality_type}</div>
              <div style={{height:8,background:'var(--navy-600)',borderRadius:4,overflow:'hidden',marginTop:20}}>
                <div style={{height:'100%',width:`${report.score}%`,background:'var(--gradient-brand)',borderRadius:4}}/>
              </div>
              <div style={{marginTop:24}}>
                {dims.map(d=>(
                  <div key={d.label} style={{marginBottom:12}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:5}}>
                      <span style={{color:'var(--gray-400)'}}>{d.label}</span>
                      <span style={{color:'var(--teal-400)',fontFamily:'var(--font-mono)',fontWeight:600}}>{d.val}%</span>
                    </div>
                    <div style={{height:5,background:'var(--navy-600)',borderRadius:3,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${d.val}%`,background:'var(--gradient-brand)',borderRadius:3}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div style={{fontSize:14,fontWeight:700,marginBottom:16}}>AI-Generated Insights</div>
              {report.insights && (() => {
                const ins = typeof report.insights==='string'?JSON.parse(report.insights):report.insights
                return (Array.isArray(ins)?ins:[]).map((i,idx)=>(
                  <div key={idx} style={{background:i.type==='warning'?'rgba(245,158,11,0.08)':i.type==='positive'?'rgba(20,184,166,0.08)':'rgba(59,130,246,0.08)',border:`1px solid ${i.type==='warning'?'rgba(245,158,11,0.2)':i.type==='positive'?'rgba(20,184,166,0.2)':'rgba(59,130,246,0.2)'}`,borderRadius:10,padding:'12px 14px',marginBottom:10}}>
                    <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{i.title}</div>
                    <div style={{fontSize:12,color:'var(--gray-400)',lineHeight:1.7}}>{i.message}</div>
                  </div>
                ))
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
