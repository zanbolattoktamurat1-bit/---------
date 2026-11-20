import pdfMake from 'pdfmake/build/pdfmake'
import fonts from 'pdfmake/build/vfs_fonts'
import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import { author, backup, backupNote, devices, groupTitles, metrics, mistakes, phishing, project, purpose, scenario, signs, sources, status, taskKey, tasks, timeline, timeNote, topic, type Group, type Progress } from './data'


const heading=(text:string):Content=>({text,style:'heading'})
const paragraph=(text:string):Content=>({text,margin:[0,0,0,8]})
const entry=(title:string,detail:string):Content=>({text:[{text:title+'\n',bold:true},detail],margin:[0,0,0,6]})
const next=(title:string):Content=>({text:title,style:'pageTitle',pageBreak:'before'})

export function reportDefinition(progress:Progress):TDocumentDefinitions {
 const total=metrics(progress)
 function checklist(group:Group):Content[] {
  const m=metrics(progress,group)
  return [paragraph(`Орындалуы: ${m.count}/${m.total} (${m.percent}%).`),...tasks[group].map(([title,detail,priority],index)=>entry(
   `${index+1}. ${title} · ${status(Boolean(progress[taskKey(group,index)]))}`,
   detail+(priority ? ' Маңыздылығы: '+priority+'.' : ''),
  ))]
 }
 return {
  info:{title:project,author,subject:topic},pageSize:'A4',pageMargins:[49,50,49,49],
  defaultStyle:{font:'Roboto',fontSize:10,lineHeight:1.13,color:'#26354c'},
  styles:{pageTitle:{fontSize:23,bold:true,color:'#102641',margin:[0,0,0,15]},heading:{fontSize:13,bold:true,color:'#087d78',margin:[0,8,0,6]}},
  footer:(page,count)=>({columns:[{text:'CYBERGUARD  /  '+author},{text:`${page} / ${count}`,alignment:'right'}],margin:[49,12,49,0],fontSize:9,color:'#55667a'}),
  content:[
   {text:'ОҚУ ЖОБАСЫ',fontSize:12,bold:true,color:'#087d78',margin:[0,105,0,19]},
   {text:'Жоба атауы',fontSize:11,bold:true,color:'#087d78',margin:[0,0,0,5]},
   {text:project,fontSize:32,bold:true,color:'#102641',margin:[0,0,0,21]},
   {text:'Жоба тақырыбы',fontSize:11,bold:true,color:'#087d78',margin:[0,0,0,5]},
   {text:topic,fontSize:19,margin:[0,0,0,38]},
   paragraph('Жоба авторы: '+author),paragraph('Жоба түрі: Оқу жобасы'),paragraph(`Жалпы орындалу: ${total.count}/${total.total} (${total.percent}%).`),
   next('Инцидентке шолу'),heading('Жобаның мақсаты'),paragraph(purpose),heading('Инциденттің сипаттамасы'),paragraph(scenario),
   heading('Инцидент белгілері'),...signs.map(([name,detail,level,importance])=>entry(name+' · '+level+' қауіп',detail+' '+importance)),
   heading('Оқиғалар хронологиясы'),paragraph(timeNote),...timeline.map(([time,title,detail])=>entry(time+' · '+title,detail)),
   next('Инцидентке әрекет ету'),...checklist('response'),heading('Фишингтік хат белгілері'),...phishing.map(([name,detail])=>entry(name,detail)),
   heading('Қызметкердің қателері және дұрыс әрекеттер'),...mistakes.map(([name,detail])=>entry(name,detail)),
   next('Операциялық жүйе және резервтік көшіру'),heading(groupTitles.hardening),...checklist('hardening'),
   heading('3–2–1 резервтік көшіру схемасы'),
   {table:{widths:['*','*','*'],body:[backup.map(([number,name,detail,example])=>({text:[{text:number+' · '+name+'\n',bold:true},detail+'\n'+example],fillColor:'#eaf6f6',margin:[3,5,3,5]}))]},layout:'noBorders',margin:[0,0,0,10]},
   paragraph(backupNote),heading('Құрылғыларды қорғау'),...devices.map(([name,risk,defense])=>entry(name,'Қауіп: '+risk+' Қорғаныс: '+defense)),
   next('Ұйымның қорғаныс жоспары'),...checklist('plan'),
   next('Қорытынды және дереккөздер'),
   heading('Қорытынды'),paragraph(`Оқу сценарийінде ${total.count} тапсырма орындалды. Қалған тапсырмалар саны: ${total.total-total.count}. Жалпы орындалу деңгейі: ${total.percent}%.`),
   paragraph('Шағын ұйым үшін негізгі шаралар — күдікті әрекетті ерте хабарлау, зақымданған құрылғыны оқшаулау, аккаунтты қорғау және қалпына келтіруді алдын ала сынау.'),
   heading('Пайдаланылған дереккөздер'),
   ...sources.flatMap(([name,detail,url]):Content[]=>[entry(name,detail),{text:url,link:url,color:'#087d78',margin:[0,0,0,10]}]),
  ],
 }
}

export async function downloadReport(progress:Progress) {
 await new Promise<void>((resolve,reject)=>{
  pdfMake.createPdf(reportDefinition(progress), undefined, undefined, fonts).getBlob(blob=>{
   try {
    const url=URL.createObjectURL(blob)
    const link=document.createElement('a')
    link.href=url
    link.download='CYBERGUARD-есеп.pdf'
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(()=>URL.revokeObjectURL(url),30000)
    resolve()
   } catch(error) { reject(error) }
  })
 })
}
