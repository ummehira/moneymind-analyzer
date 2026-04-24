import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const REPORTS = [
  { id:'monthly',   icon:'D', title:'Monthly Expense Report',    desc:'Complete income/expense breakdown with category analysis and behavior score for the current month.', color:'rgba(20,184,166,0.12)', endpoint:'/reports/monthly' },
  { id:'statement', icon:'T', title:'Transaction Statement',      desc:'Bank-statement format listing all transactions with dates, PKR amounts, and running balance.',      color:'rgba(79,142,247,0.12)', endpoint:'/reports/statement' },
  { id:'behavior',  icon:'A', title:'AI Behavior Report',        desc:'Comprehensive behavioral analysis including personality classification, scores, and personalized AI recommendations.', color:'rgba(245,158,11,0.12)', endpoint:'/reports/behavior' },
]

export default function Reports() {
  const { currency } = useAuth()
  const [status, setStatus] = useState({})

  const download = async (id, endpoint) => {
    setStatus(s => ({ ...s, [id]: 'Generating...' }))
    try {
      const res = await api.get(endpoint, { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const a   = document.createElement('a')
      a.href    = url
      a.download = `moneymind-${id}-${new Date().toISOString().split('T')[0]}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      setStatus(s => ({ ...s, [id]: 'Downloaded!' }))
    } catch(e) {
      setStatus(s => ({ ...s, [id]: 'Error generating report' }))
    }
    setTimeout(() => setStatus(s => ({ ...s, [id]: null })), 3000)
  }

  const downloadCSV = async () => {
    setStatus(s => ({ ...s, csv: 'Exporting...' }))
    try {
      const res = await api.get('/reports/export/csv', { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const a   = document.createElement('a')
      a.href    = url
      a.download = `moneymind-transactions-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      setStatus(s => ({ ...s, csv: 'Exported!' }))
    } catch(e) {
      setStatus(s => ({ ...s, csv: 'Error' }))
    }
    setTimeout(() => setStatus(s => ({ ...s, csv: null })), 3000)
  }

  return (
    <div>
      <div style={{background:'var(--navy-800)',borderBottom:'1px solid rgba(255,255,255,0.06)',padding:'16px 28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:20,fontWeight:800}}>Download Reports</div>
        <div style={{fontSize:12,color:'var(--gray-500)',fontFamily:'var(--font-mono)'}}>Currency: {currency}</div>
      </div>
      <div style={{padding:'24px 28px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:20}}>
          {REPORTS.map(r=>(
            <div key={r.id} className="card" style={{display:'flex',flexDirection:'column'}}>
              <div style={{width:44,height:44,borderRadius:12,background:r.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:14,fontWeight:800}}>{r.icon}</div>
              <div style={{fontSize:15,fontWeight:700,marginBottom:8}}>{r.title}</div>
              <div style={{fontSize:12,color:'var(--gray-400)',lineHeight:1.7,marginBottom:'auto',paddingBottom:16}}>{r.desc}</div>
              <button onClick={()=>download(r.id, r.endpoint)} className="btn btn-primary" style={{width:'100%',justifyContent:'center',fontSize:13}}>
                {status[r.id] || 'Download PDF'}
              </button>
            </div>
          ))}
        </div>
        <div className="card" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Export All Transactions — CSV</div>
            <div style={{fontSize:12,color:'var(--gray-400)'}}>Spreadsheet-compatible format with all transaction data in {currency}</div>
          </div>
          <button onClick={downloadCSV} className="btn btn-outline" style={{fontSize:13,flexShrink:0}}>
            {status.csv || 'Export CSV'}
          </button>
        </div>
      </div>
    </div>
  )
}
