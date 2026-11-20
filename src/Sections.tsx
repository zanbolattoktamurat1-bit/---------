import { AlertTriangle, Check, Cloud, Database, ExternalLink, HardDrive, Router, Smartphone, ShieldCheck } from 'lucide-react'
import { Dashboard, Timeline } from './Dashboard'
import { author, backup, backupNote, devices, groupTitles, metrics, mistakes, phishing, purpose, scenario, signs, sources, status, taskKey, tasks, type Group, type Progress } from './data'

function Checklist({group,progress,toggle}:{group:Group;progress:Progress;toggle:(key:string)=>void}) {
 const result=metrics(progress,group)
 return <><div className="panel section-progress"><div><strong>{result.count} / {result.total} тапсырма орындалды</strong><strong>{result.percent}%</strong></div><progress aria-label={groupTitles[group]} value={result.count} max={result.total}/></div>
 <div className="stack">{tasks[group].map(([title,detail,priority],index)=>{
  const id=taskKey(group,index), done=Boolean(progress[id])
  return <label key={id} className={'panel task '+(done?'done':'')}><span className="task-index">{String(index+1).padStart(2,'0')}</span><span className="task-copy"><strong>{title}</strong><span>{detail}</span>{priority && <small>Маңыздылығы · {priority}</small>}</span><span className="task-status">{status(done)}</span><span className="check-wrap"><input type="checkbox" checked={done} onChange={()=>toggle(id)} aria-label={title}/><Check size={14} aria-hidden="true"/></span></label>
 })}</div></>
}
const descriptions: Record<string,string> = {
 incident:'Оқу жағдайының мән-жайы және талдау мақсаты.',
 signs:'Инцидентті бағалауға көмектесетін бес белгі.',
 timeline:'Сценарийдегі негізгі оқиғалардың реті.',
 response:'Инцидент анықталғаннан кейінгі алғашқы алты әрекет.',
 phishing:'Күдікті хаттың белгілері және қызметкердің дұрыс әрекеті.',
 hardening:'Операциялық жүйені қорғауға арналған алты тексеріс.',
 backup:'3–2–1 ережесі бойынша деректерді сақтау және қалпына келтіру.',
 devices:'Бұлттық қызмет, смартфон және IoT құрылғысын қорғау.',
 plan:'Шағын ұйымға арналған он қорғаныс шарасы.',
 report:'Оқу сценарийі және ағымдағы тапсырма нәтижелері бір PDF файлында.',
 sources:'Киберқауіпсіздік бойынша ресми және ашық материалдар.',
}
export function Sections({page,title,progress,go,toggle,report}:{page:string;title:string;progress:Progress;go:(page:string)=>void;toggle:(key:string)=>void;report:React.ReactNode}) {
 if(page==='dashboard') return <Dashboard progress={progress} go={go}/>
 const deviceIcons=[Cloud,Smartphone,Router]
 const backupIcons=[Database,HardDrive,Cloud]
 return <><header className="page-heading"><h1>{title}</h1><p>{descriptions[page]}</p></header>
 {page in groupTitles && <Checklist group={page as Group} progress={progress} toggle={toggle}/>}
 {page==='incident' && <div className="panel content-panel"><span className="pill"><i/> Оқу симуляциясы</span><h2>Жағдай сипаттамасы</h2><p>{scenario}</p><h2>Жобаның мақсаты</h2><p>{purpose}</p><p>Жоба авторы · {author}</p><button className="primary" onClick={()=>go('signs')}>Белгілерді анықтау</button></div>}
 {page==='signs' && <div className="content-grid">{signs.map(([name,detail,level,importance])=><article className="panel content-panel" key={name}><span className={'risk '+(level==='Жоғары'?'high':'medium')}><AlertTriangle size={15}/>{level} қауіп</span><h2>{name}</h2><p>{detail}</p><p><strong>Маңыздылығы.</strong> {importance}</p></article>)}</div>}
 {page==='timeline' && <section className="panel content-panel"><Timeline/></section>}
 {page==='phishing' && <div className="content-grid"><section className="panel content-panel"><h2>Фишингтік хаттың 5 белгісі</h2><DetailList items={phishing}/></section><section className="panel content-panel"><h2>Қызметкердің 3 қатесі</h2><DetailList items={mistakes}/></section></div>}
 {page==='backup' && <><div className="content-grid three">{backup.map(([number,name,detail,example],i)=>{const Icon=backupIcons[i];return <article className="panel content-panel backup-card" key={number}><div><strong>{number}</strong><Icon size={27}/></div><h2>{name}</h2><p>{detail}</p><p>{example}</p></article>})}</div><article className="panel content-panel spaced"><h2>Қалпына келтіру сынағы</h2><p>{backupNote}</p></article></>}
 {page==='devices' && <div className="content-grid three">{devices.map(([name,risk,defense],i)=>{const Icon=deviceIcons[i];return <article className="panel content-panel" key={name}><span className="stat-icon cyan"><Icon size={20}/></span><h2>{name}</h2><p><strong>Қауіп.</strong> {risk}</p><p><strong>Қорғаныс.</strong> {defense}</p></article>})}</div>}
 {page==='report' && report}
 {page==='sources' && <div className="content-grid">{sources.map(([name,detail,url])=><article className="panel content-panel" key={url}><h2>{name}</h2><p>{detail}</p><a className="secondary source-link" href={url} target="_blank" rel="noopener noreferrer"><ExternalLink size={16}/> Дереккөзді ашу</a></article>)}</div>}
 </>
}
function DetailList({items}:{items:string[][]}) {
 return <ul className="details">{items.map(([name,detail])=><li key={name}><ShieldCheck size={19}/><div><strong>{name}</strong><p>{detail}</p></div></li>)}</ul>
}
