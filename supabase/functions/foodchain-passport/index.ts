import {createClient} from 'npm:@supabase/supabase-js@2.95.3';
import catalog from './catalog.json' with {type:'json'};
import {validateChain} from './rules.js';
const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
const VERSION='2026-10-31';
const origin='https://wongngaiyam3-rgb.github.io';
const headers={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'content-type,authorization,apikey','Access-Control-Allow-Methods':'POST,OPTIONS','Content-Type':'application/json','Cache-Control':'no-store'};
const hex=(a:ArrayBuffer)=>Array.from(new Uint8Array(a),b=>b.toString(16).padStart(2,'0')).join('');
const digest=async(s:string)=>hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));
const must=(r:any)=>{if(r.error)throw new Error('資料服務暫時未能回應');return r.data;};
function fail(message:string,status=400):never{throw Object.assign(new Error(message),{status});}
async function issue(enrollment:string|null,teacher=false){const token=hex(crypto.getRandomValues(new Uint8Array(32)).buffer);must(await db.from('fcq_sessions').insert({token_hash:await digest(token),enrollment_id:enrollment,teacher,expires_at:new Date(Date.now()+(teacher?2:12)*3600000).toISOString()}));return token;}
async function allRows(table:string,columns='*'){let rows:any[]=[];for(let offset=0;;offset+=1000){const page=must(await db.from(table).select(columns).range(offset,offset+999));rows.push(...page);if(page.length<1000)return rows;}}
async function records(id:string){const [d,c,a]=await Promise.all([db.from('fcq_discoveries').select('*').eq('enrollment_id',id),db.from('fcq_chains').select('*').eq('enrollment_id',id),db.from('fcq_activity').select('*').eq('enrollment_id',id)]);return {discoveries:must(d),chains:must(c),activities:must(a)};}
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers});
 try{
 if(req.method!=='POST')fail('只接受 POST',405);
 const raw=await req.text();if(raw.length>100000)fail('資料太大',413);
 const body=JSON.parse(raw),action=body.action;
 const reply=(v:any)=>new Response(JSON.stringify(v),{headers});
 if(action==='enter'){
 if(!['4A','4B','4C'].includes(body.class_name)||!Number.isInteger(body.student_no)||body.student_no<1||body.student_no>25)fail('請選擇正確班別及學號');
 const e=must(await db.from('fcq_enrollments').select('*').eq('school','primary4').eq('year','2026-27').eq('class_name',body.class_name).eq('student_no',body.student_no).single());
 return reply({token:await issue(e.id),student:e,...await records(e.id)});
 }
 if(action==='teacher-login'){
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';
 const count=must(await db.rpc('fcq_rate',{bucket_key:'teacher:'+await digest(ip)}));if(count>30)fail('嘗試次數太多，請稍後再試',429);
 if(typeof body.password!=='string'||body.password.length>128)fail('密碼不正確',401);
 const v=must(await db.from('fcq_settings').select('value').eq('key','teacher').single()).value;
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(body.password),'PBKDF2',false,['deriveBits']);
 const h=hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(v.salt),iterations:v.iterations,hash:'SHA-256'},key,256));
 let difference=h.length^v.hash.length;for(let i=0;i<h.length;i++)difference|=h.charCodeAt(i)^v.hash.charCodeAt(i);if(difference)fail('密碼不正確',401);
 return reply({token:await issue(null,true)});
 }
 const token=req.headers.get('Authorization')?.replace(/^Bearer /,'')||'';
 if(!/^[a-f0-9]{64}$/.test(token))fail('請重新登入或選擇班號',401);
 const hash=await digest(token);const session=must(await db.from('fcq_sessions').select('*').eq('token_hash',hash).gt('expires_at',new Date().toISOString()).maybeSingle());
 if(!session)fail('工作階段已到期，請重新登入',401);
 if(action==='logout'){must(await db.from('fcq_sessions').delete().eq('token_hash',hash));return reply({ok:true});}
 if(action==='teacher-summary'||action==='teacher-student'){
 if(!session.teacher)fail('需要教師權限',403);
 if(action==='teacher-student'){
 const e=must(await db.from('fcq_enrollments').select('*').eq('id',body.student_id).eq('school','primary4').eq('year','2026-27').single());return reply({student:e,...await records(e.id)});
 }
 const students=must(await db.from('fcq_enrollments').select('*').eq('school','primary4').eq('year','2026-27').order('class_name').order('student_no'));
 const ids=new Set(students.map((s:any)=>s.id));const [d,c,e]=await Promise.all([allRows('fcq_discoveries'),allRows('fcq_chains'),allRows('fcq_events','enrollment_id,received_at')]);
 return reply({students,discoveries:d.filter((r:any)=>ids.has(r.enrollment_id)),chains:c.filter((r:any)=>ids.has(r.enrollment_id)),events:e.filter((r:any)=>ids.has(r.enrollment_id))});
 }
 if(session.teacher||!session.enrollment_id)fail('請先選擇學生班號',403);
 const id=session.enrollment_id;
 if(action==='notebook')return reply(await records(id));
 if(action!=='event')fail('不支援的操作');
 const b=(catalog as any)[body.biome];if(!b)fail('生態域不正確');
 if(!/^[a-f0-9-]{36}$/i.test(body.event_id))fail('事件編號不正確');
 const old=must(await db.from('fcq_events').select('result').eq('enrollment_id',id).eq('event_id',body.event_id).maybeSingle());if(old)return reply(old.result);
 let result:any={ok:true};
 if(body.type==='discovery'){
 if(!b.species.some((s:any)=>s.id===body.species_id))fail('生物不存在');
 must(await db.from('fcq_discoveries').upsert({enrollment_id:id,biome:body.biome,species_id:body.species_id},{onConflict:'enrollment_id,biome,species_id',ignoreDuplicates:true}));
 }else if(body.type==='chain'){
 if(body.version!==VERSION)fail('圖鑑已更新，請重新開啟網站');
 const found=must(await db.from('fcq_discoveries').select('species_id').eq('enrollment_id',id).eq('biome',body.biome)).map((s:any)=>s.species_id);
 const status=validateChain(catalog,body.biome,body.nodes,found);result={ok:true,status};
 if(status==='success')must(await db.from('fcq_chains').upsert({enrollment_id:id,biome:body.biome,version:VERSION,signature:body.nodes.join('>'),nodes:body.nodes},{onConflict:'enrollment_id,biome,version,signature',ignoreDuplicates:true}));
 }else if(body.type==='arrow'){
 const pair=body.pair;if(!Array.isArray(pair)||pair.length!==2||!b.edges.some((e:any)=>e[0]===pair[0]&&e[1]===pair[1]))fail('箭頭方向不正確');
 must(await db.from('fcq_activity').upsert({enrollment_id:id,biome:body.biome,arrow:true}));
 }else fail('事件種類不正確');
 must(await db.from('fcq_events').upsert({enrollment_id:id,event_id:body.event_id,biome:body.biome,type:body.type,result},{onConflict:'enrollment_id,event_id',ignoreDuplicates:true}));return reply(result);
 }catch(e){return new Response(JSON.stringify({error:(e as any).message||'未能連線'}),{status:(e as any).status||400,headers});}
});
