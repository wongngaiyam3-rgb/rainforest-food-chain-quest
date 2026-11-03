import {ensureStudent,addStrip,currentStudent,escapeHTML as esc} from '../shared/passport.js?v=classification-entry-v1';
import {emptyState,validate} from './rules-v2.mjs';
const c=await fetch('./curriculum-v2.json').then(r=>r.json()),$=s=>document.querySelector(s);
await ensureStudent({title:'準備好成為動物分類研究員嗎？',description:'選擇自己的班別和學號，觀察與分類紀錄會加入你的研究報告。',teacherURL:'classification/teacher.html'});addStrip();const student=currentStudent(),prefix='fcq-classification-v2:'+student.id;
const token=()=>JSON.parse(sessionStorage.getItem('fcq-passport-v1:session')||'null')?.token||'';
const identityValid=()=>JSON.parse(localStorage.getItem('fcq-passport-v1:identity')||'null')?.id===student.id;
export async function request(action,data={}){const r=await fetch('https://nltqzuhubqhwtfxwuupr.supabase.co/functions/v1/foodchain-classification-v2',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token()},body:JSON.stringify({action,...data}),signal:AbortSignal.timeout(15000)});const b=await r.json();if(!r.ok)throw Object.assign(Error(b.error||'未能連線'),{status:r.status});return b;}
const eventId=()=>crypto.randomUUID?crypto.randomUUID(): '10000000-1000-4000-8000-100000000000'.replace(/[018]/g,ch=>(Number(ch)^crypto.getRandomValues(new Uint8Array(1))[0]&15>>Number(ch)/4).toString(16));
const read=()=>{try{return JSON.parse(localStorage.getItem(prefix))}catch{return null}};

let box=read()||{state:emptyState(),revision:0,queue:[]},s=box.state,busy=false,conflict=false;
function store(){try{localStorage.setItem(prefix,JSON.stringify(box));}catch{toast('這部裝置無法暫存，請下載備份，保持連線後再試。');throw Error('本機儲存失敗');}}
let rerender=()=>{};export function onReload(fn){rerender=fn;}
function toast(m){$('#toast').textContent=m;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),4500)}
function status(m){$('#saveStatus').textContent=m;}
function persist(){if(!identityValid())return location.reload();validate(c,s,box.queue.at(-1)?.state||null);box.state=s;box.queue.push({event_id:eventId(),state:structuredClone(s)});store();status('已存於本機 · '+box.queue.length+' 項等待上傳');void flush();}
async function flush(){if(busy||conflict||!box.queue.length||!identityValid())return;busy=true;try{while(box.queue.length&&identityValid()){const event=box.queue[0];status('正在上傳分類紀錄…');const r=await request('save',{...event,revision:box.revision});box.revision=r.revision;box.queue.shift();store();}status(s.submitted?'老師已收到正式提交 ✓':'已上傳雲端 ✓ · 老師可查看目前進度');}catch(e){if(e.status===409){conflict=true;$('#reloadCloud').hidden=false;}status(e.status===401?'登入已到期，請重新載入後選擇班號；本機紀錄已保留':e.message+' · 本機紀錄已保留');}finally{busy=false;}}
try{const r=await request('load');if(!box.queue.length&&r.record){box={state:r.record.state,revision:r.record.revision,queue:[]};s=box.state;store();}status(box.queue.length?'本機有等待上傳的進度':r.record?'已讀取雲端進度 ✓':'準備好了，從觀察開始！');}catch(e){status('目前使用本機進度 · '+e.message)}
$('#sync').onclick=()=>void flush();const download=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({student:{class_name:student.class_name,student_no:student.student_no},...box},null,2)],{type:'application/json'}));a.download=`動物分類-${student.class_name}-${student.student_no}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};$('#backup').onclick=download;
$('#reloadCloud').onclick=async()=>{download();try{const r=await request('load');box={state:r.record?.state||emptyState(),revision:r.record?.revision||0,queue:[]};s=box.state;store();conflict=false;$('#reloadCloud').hidden=true;status('已載入雲端進度，原本機紀錄已下載備份');rerender();}catch(e){toast(e.message)}};
window.addEventListener('online',()=>void flush());setInterval(()=>void flush(),15000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)void flush()});

export {c,s,box,student,esc,persist,flush,toast,status,download};
void flush();
