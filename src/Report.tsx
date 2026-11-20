import { Download, FileText, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { author, groups, groupTitles, metrics, type Progress } from './data'

export function Report({progress}:{progress:Progress}) {
 const [state,setState]=useState<'idle'|'loading'|'success'|'error'>('idle')
 const result=metrics(progress)
 async function download() {
  setState('loading')
  try {
   const { downloadReport }=await import('./pdf')
   await downloadReport(progress)
   setState('success')
  } catch {
   setState('error')
  }
 }
 return <section className="panel content-panel report-panel">
  <span className="stat-icon cyan"><FileText size={21}/></span><h2>CYBERGUARD · PDF есеп</h2>
  <p>6 бет · Қазақ тілі · {author}</p>
  <div className="report-summary"><strong>Жалпы орындалу · {result.percent}%</strong><ul>{groups.map(group=>{const m=metrics(progress,group);return <li key={group}>{groupTitles[group]} <b>{m.count}/{m.total}</b></li>})}</ul></div>
  <button className="primary" onClick={download} disabled={state==='loading'}>{state==='loading'?<LoaderCircle className="spin" size={18}/>:<Download size={18}/>} {state==='loading'?'Есеп дайындалып жатыр…':'PDF есебін жүктеу'}</button>
  <div role="status" className="footnote">{state==='success'?'Есеп жүктеу үшін браузерге жіберілді.':state==='error'?'Есепті жүктеу мүмкін болмады. Қайталап көріңіз.':''}</div>
 </section>
}
