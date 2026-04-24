import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/alerts').then(r=>setAlerts(r.data.data)).catch(console.error).finally(()=>setLoading(false))
  }, [])

  const markRead = async (id) => {
    await api.patch(`/alerts/${id}/read`)
    setAlerts(a => a.map(x => x.id===id?{...x,is_read:true}:x))
  }

  const dismiss = async (id) => {
    await api.delete(`/alerts/${id}`)
    setAlerts(a => a.filter(x => x.id!==id))
  }

  const sevColor = { danger:'var(--red-500)', warning:'var(--amber-500)', info:'var(--cyan-400)' }
  const sevBg    = { danger:'rgba(239,68,68,0.08)', warning:'rgba(245,158,11,0.08)', info:'rgba(6,182,212,0.08)' }
  const sevBorder= { danger:'rgba(239,68,68,0.2)', warning:'rgba(245,158,11,0.2)', info:'rgba(6,182,212,0.2)' }

  return (
    <div>
      <div style={{background:'var(--navy-800)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'16px 28px'}}>
        <div style={{fontSize:20,fontWeight:800}}>Smart Alerts</div>
      </div>
      <div style={{padding:'24px 28px'}}>
        {loading ? <div style={{color:'var(--gray-500)',textAlign:'center',padding:40}}>Loading alerts...</div> :
        alerts.length===0 ? <div style={{color:'var(--gray-500)',textAlign:'center',padding:40,fontSize:14}}>No alerts. Your finances look healthy!</div> : (
          <div className="card" style={{padding:0}}>
            {alerts.map((a,i)=>(
              <div key={a.id} style={{display:'flex',gap:14,padding:'14px 20px',background:sevBg[a.severity]||'transparent',borderBottom:i<alerts.length-1?'1px solid rgba(255,255,255,0.05)':'none',opacity:a.is_read?0.55:1}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:sevColor[a.severity]||'var(--gray-400)',marginTop:6,flexShrink:0,boxShadow:`0 0 6px ${sevColor[a.severity]||'transparent'}`}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:sevColor[a.severity]||'var(--white)',marginBottom:3}}>{a.title}</div>
                  <div style={{fontSize:12,color:'var(--gray-400)',lineHeight:1.6}}>{a.message}</div>
                  <div style={{fontSize:10,color:'var(--gray-600)',fontFamily:'var(--font-mono)',marginTop:4}}>{new Date(a.created_at).toLocaleString('en-PK')}</div>
                </div>
                <div style={{display:'flex',gap:6,alignSelf:'flex-start'}}>
                  {!a.is_read && <button onClick={()=>markRead(a.id)} className="btn btn-ghost" style={{fontSize:11,padding:'4px 10px'}}>Mark Read</button>}
                  <button onClick={()=>dismiss(a.id)} className="btn btn-danger" style={{fontSize:11,padding:'4px 10px'}}>Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
