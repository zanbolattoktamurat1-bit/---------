import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import { Activity, Bell, BookOpen, ChevronDown, ClipboardCheck, DatabaseBackup, Download, FileSearch, Fingerprint, LayoutGrid, MailWarning, Menu, RotateCcw, Search, Shield, ShieldAlert, ShieldCheck, Smartphone, X } from 'lucide-react'
import { author, backup, devices, groupTitles, metrics, mistakes, phishing, signs, sources, tasks, timeline, type Progress } from './data'
import { Sections } from './Sections'
import { Report } from './Report'
import './style.css'

const menu=[
 {label:'ШОЛУ',pages:[
  ['dashboard','Басты панель',LayoutGrid,'Dashboard'],
  ['incident','Инцидент туралы',ShieldAlert,''],
  ['signs','Белгілерді анықтау',Fingerprint,signs.flat().join(' ')],
  ['timeline','Оқиғалар хронологиясы',Activity,'Timeline '+timeline.flat().join(' ')],
 ]},
 {label:'ТАЛДАУ ЖӘНЕ ҚОРҒАНЫС',pages:[
  ['response',groupTitles.response,ShieldCheck,'Incident Response '+tasks.response.flat().join(' ')],
  ['phishing','Фишингті талдау',MailWarning,'Phishing Analysis '+[...phishing,...mistakes].flat().join(' ')],
  ['hardening',groupTitles.hardening,Shield,'OS Hardening '+tasks.hardening.flat().join(' ')],
  ['backup','Резервтік көшіру',DatabaseBackup,'Backup Strategy '+backup.flat().join(' ')],
  ['devices','Құрылғыларды қорғау',Smartphone,'Device Security '+devices.flat().join(' ')],
  ['plan',groupTitles.plan,ClipboardCheck,tasks.plan.flat().join(' ')],
 ]},
 {label:'МАТЕРИАЛДАР',pages:[
  ['report','Есепті жүктеу',Download,'PDF'],
  ['sources','Дереккөздер',BookOpen,sources.flat().join(' ')],
 ]},
] as const
const pages=menu.flatMap(group=>[...group.pages])
const storageKey='cyberguard.progress.v1'
function readProgress():Progress {
 try {
  const value:unknown=JSON.parse(localStorage.getItem(storageKey)??'{}')
  if(!value || typeof value!=='object' || Array.isArray(value)) return {}
  return Object.fromEntries(Object.entries(value).filter(([,value])=>value===true))
 } catch { return {} }
}
function readPage() {
 const id=location.hash.slice(1)
 return pages.some(([page])=>page===id)?id:'dashboard'
}
function App() {
 const [page,setPage]=useState(readPage)
 const [progress,setProgress]=useState(readProgress)
 const [storageError,setStorageError]=useState(false)
 const [query,setQuery]=useState('')
 const [searchOpen,setSearchOpen]=useState(false)
 const [drawer,setDrawer]=useState(false)
 const [popover,setPopover]=useState<'notifications'|'profile'|null>(null)
 const current=pages.find(([id])=>id===page)??pages[0]
 const result=metrics(progress)
 const normalized=query.trim().toLocaleLowerCase('kk')
 const matches=normalized ? pages.filter(([,title,,terms])=>(title+' '+terms).toLocaleLowerCase('kk').includes(normalized)) : []
 useEffect(()=>{
  try {localStorage.setItem(storageKey,JSON.stringify(progress));setStorageError(false)}
  catch {setStorageError(true)}
 },[progress])
 useEffect(()=>{
  const update=()=>{setPage(readPage());window.scrollTo(0,0)}
  window.addEventListener('hashchange',update)
  return ()=>window.removeEventListener('hashchange',update)
 },[])
 useEffect(()=>{
  document.title=current[1]+' | CYBERGUARD'
 },[current])
 function go(id:string) {
  if(readPage()!==id) location.hash=id
  setPage(id);setQuery('');setSearchOpen(false);setDrawer(false);setPopover(null)
  window.scrollTo(0,0)
 }
 function reset() {
  if(window.confirm('Барлық тапсырмалардың прогресін өшіресіз бе?')) {
   setProgress({});setPopover(null)
  }
 }
 return <div className="app" onKeyDown={event=>{if(event.key==='Escape'){setSearchOpen(false);setDrawer(false);setPopover(null)}}}>
  {drawer && <button className="scrim" aria-label="Мәзірді жабу" onClick={()=>setDrawer(false)}/>}
  <aside id="side-navigation" className={'sidebar '+(drawer?'open':'')}>
   <button className="brand" onClick={()=>go('dashboard')}><span><ShieldCheck size={24}/></span><div><strong>CYBER<span>GUARD</span></strong><small>КИБЕРҚАУІПСІЗДІК</small></div></button>
   <nav aria-label="Бөлімдер">{menu.map(group=><div className="nav-group" key={group.label}><p>{group.label}</p>{group.pages.map(([id,title,Icon])=><button key={id} aria-current={page===id?'page':undefined} className={page===id?'active':''} onClick={()=>go(id)}><Icon size={17}/><span>{title}</span></button>)}</div>)}</nav>
   <div className="sidebar-bottom"><span><i/> Оқу симуляциясы</span><button onClick={reset} disabled={!result.count}><RotateCcw size={15}/> Прогресті бастапқы күйге қайтару</button></div>
  </aside>
  <div className="workspace">
   <header className="topbar">
    <button className="icon-button mobile-menu" aria-label="Мәзірді ашу" aria-expanded={drawer} aria-controls="side-navigation" onClick={()=>setDrawer(!drawer)}><Menu size={21}/></button>
    <div className="crumb"><span>Жұмыс кеңістігі</span><span>/</span><strong>{current[1]}</strong></div>
    <form className="search" role="search" onSubmit={event=>{event.preventDefault();if(matches[0]) go(matches[0][0])}} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setSearchOpen(false)}}>
     <Search size={16}/><input aria-label="Тақырып бойынша іздеу" placeholder="Тақырыпты іздеу…" value={query} onFocus={()=>{setSearchOpen(true);setPopover(null)}} onChange={event=>{setQuery(event.target.value);setSearchOpen(true)}}/>
     {query && <button type="button" aria-label="Іздеуді тазарту" onClick={()=>setQuery('')}><X size={15}/></button>}
     {searchOpen && normalized && <div className="popover results">{matches.length ? matches.map(([id,title,Icon])=><button type="button" key={id} onClick={()=>go(id)}><Icon size={16}/>{title}</button>):<p>Сәйкес бөлім табылмады.</p>}</div>}
    </form>
    <div className="account">
     <button className="icon-button" aria-label="Хабарландырулар" aria-expanded={popover==='notifications'} onClick={()=>setPopover(popover==='notifications'?null:'notifications')}><Bell size={19}/><i className="bell-dot"/></button>
     <button className="profile" aria-label={`Автор профилі, ${author}`} aria-expanded={popover==='profile'} onClick={()=>setPopover(popover==='profile'?null:'profile')}><span className="avatar">JT</span><span className="profile-copy"><strong>{author}</strong><small>Жоба авторы</small></span><ChevronDown size={14}/></button>
     {popover==='notifications' && <div className="popover account-panel"><strong>Хабарландырулар</strong><p>Оқу сценарийі қолжетімді.</p><button onClick={()=>go('response')}><FileSearch size={16}/> Әрекеттер тізімін ашу</button></div>}
     {popover==='profile' && <div className="popover account-panel"><strong>{author}</strong><p>CYBERGUARD жобасының авторы</p><p>Тапсырмалар · {result.count}/{result.total}</p>{result.count>0&&<button onClick={reset}><RotateCcw size={15}/> Прогресті бастапқы күйге қайтару</button>}</div>}
    </div>
   </header>
   <main id="main">
    {storageError && <p role="status" className="risk medium">Браузер жады қолжетімсіз. Прогресс осы бет ашық тұрған кезде сақталады.</p>}
    <Sections page={page} title={current[1]} progress={progress} go={go} toggle={key=>setProgress(previous=>({...previous,[key]:!previous[key]}))} report={<Report progress={progress}/>}/>
    <footer><span>CYBERGUARD</span><span>Оқу жобасы · {author}</span></footer>
   </main>
  </div>
 </div>
}
createRoot(document.getElementById('root')!).render(<App/>)
