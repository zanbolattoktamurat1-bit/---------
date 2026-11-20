import { Activity, ClipboardCheck, FileWarning, ListChecks, MailWarning, ShieldAlert, ShieldCheck, ChevronRight, Radar } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { author, groupTitles, groups, metrics, scenario, signs, timeNote, timeline, type Progress } from './data'

export function Timeline({compact = false}: {compact?: boolean}) {
 return <><ol className="timeline">{timeline.map(([time,title,detail],i)=><li key={time}><span className={'event-dot event-'+i}/><time>{time}</time><div><strong>{title}</strong>{!compact && <p>{detail}</p>}</div></li>)}</ol><p className="footnote">{timeNote}</p></>
}
export function Dashboard({progress, go}: {progress:Progress;go:(page:string)=>void}) {
 const overall=metrics(progress)
 const cards=[
  [ShieldAlert,'Қауіп деңгейі','Жоғары','red','incident'],
  [MailWarning,'Инцидент белгілері',signs.length,'cyan','signs'],
  [Activity,'Оқиғалар',timeline.length,'blue','timeline'],
  [ListChecks,'Алғашқы әрекеттер',metrics(progress,'response').total,'purple','response'],
  [ClipboardCheck,'Орындалған тапсырма',overall.count+' / '+overall.total,'green','plan'],
 ] as const
 return <>
 <section className="hero">
  <div className="radar-art" aria-hidden="true"><div className="radar-grid"/><div className="radar-ring ring-one"/><div className="radar-ring ring-two"/><div className="radar-ring ring-three"/><div className="radar-axis"/><div className="radar-core"><ShieldCheck size={73} strokeWidth={1.15}/></div><span className="blip blip-a"/><span className="blip blip-b"/></div>
  <div className="hero-content"><span className="pill"><i/> Оқу симуляциясы</span><h1>Киберқауіпсіздік инцидентін<br className="wide-break"/> талдау орталығы</h1><p>{scenario}</p><div className="hero-actions"><button className="primary" onClick={()=>go('response')}><ShieldCheck size={17}/> Әрекет етуге өту</button><button className="secondary" onClick={()=>go('incident')}>Инцидентті қарау</button></div><p className="byline">{author} <span>·</span> Жоба авторы</p></div>
 </section>
 <div className="section-heading"><h2>Сценарийге шолу</h2><span>Оқу деректері</span></div>
 <div className="stats">{cards.map(([Icon,label,value,tone,id])=><button className="stat panel" onClick={()=>go(id)} key={id}><span className={'stat-icon '+tone}><Icon size={18}/></span><strong className={tone==='red'?'danger-text':''}>{value}</strong><span>{label}</span></button>)}</div>
 <div className="dashboard-grid">
  <section className="panel dash-panel"><div className="panel-title"><span className="stat-icon cyan"><Radar size={18}/></span><h2>Талдау прогресі</h2></div>
   <div className="progress-layout"><div className="ring-chart" role="img" aria-label={`Жалпы прогресс ${overall.percent}%`}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{value:overall.percent},{value:100-overall.percent}]} dataKey="value" innerRadius="77%" outerRadius="96%" startAngle={90} endAngle={-270} stroke="none" isAnimationActive={false}><Cell fill="#33d9c8"/><Cell fill="#223248"/></Pie></PieChart></ResponsiveContainer><div><strong>{overall.percent}%</strong><span>Жалпы</span></div></div>
   <div className="group-bars">{groups.map(group=>{const m=metrics(progress,group);return <button key={group} onClick={()=>go(group)}><span>{groupTitles[group]} <b>{m.count}/{m.total}</b></span><progress aria-label={groupTitles[group]} value={m.count} max={m.total}/></button>})}</div></div>
  </section>
  <section className="panel dash-panel"><div className="panel-title"><span className="stat-icon blue"><FileWarning size={18}/></span><h2>Оқиғалар хронологиясы</h2><button className="icon-button small" aria-label="Толық хронологияны ашу" onClick={()=>go('timeline')}><ChevronRight size={18}/></button></div><Timeline compact/></section>
 </div>
 </>
}
