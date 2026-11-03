import {createClient} from 'npm:@supabase/supabase-js@2.95.3';
import catalog from './catalog.json' with {type:'json'};
import {validate} from './rules.mjs';
const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
const headers={'Access-Control-Allow-Origin':'https://wongngaiyam3-rgb.github.io','Access-Control-Allow-Headers':'content-type,authorization','Access-Control-Allow-Methods':'POST,OPTIONS','Content-Type':'application/json','Cache-Control':'no-store'};
const must=(r:any)=>{if(r.error)throw Error(r.error.message?.includes('REVISION_CONFLICT')?'另一個裝置已有新進度，請保留本機備份並重新載入雲端進度':'儲存服務暫時未能回應');return r.data};
const fail=(m:string,status=400)=>{throw Object.assign(Error(m),{status})};
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers});
 try{
 if(req.method!=='POST')fail('只接受 POST',405);
 const token=(req.headers.get('authorization')||'').replace(/^Bearer /,'');
 if(!/^[a-f0-9]{64}$/.test(token))fail('請先選擇班別及學號',401);
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token))),x=>x.toString(16).padStart(2,'0')).join('');
 const session=must(await db.from('fcq_sessions').select('*').eq('token_hash',hash).gt('expires_at',new Date().toISOString()).maybeSingle());if(!session)fail('工作階段已到期，請重新選擇班號',401);
 const raw=await req.text();if(raw.length>60000)fail('資料太大',413);const body=JSON.parse(raw);
 const reply=(v:any)=>new Response(JSON.stringify(v),{headers});
 if(body.action==='teacher'){
 if(!session.teacher)fail('需要教師權限',403);
 const students=must(await db.from('fcq_enrollments').select('id,class_name,student_no').eq('school','primary4').eq('year','2026-27').order('class_name').order('student_no'));
 const rows=must(await db.from('fcq_classification_state').select('*').in('enrollment_id',students.map((x:any)=>x.id)));
 return reply({students,records:rows});
 }
 if(body.action==='history'){
 if(!session.teacher)fail('需要教師權限',403);
 const e=must(await db.from('fcq_enrollments').select('id').eq('id',body.student_id).eq('school','primary4').eq('year','2026-27').maybeSingle());if(!e)fail('學生不正確');
 const rows=must(await db.from('fcq_classification_events').select('revision,state,score,submitted,received_at').eq('enrollment_id',e.id).order('revision',{ascending:false}).range(0,199));return reply({events:rows});
 }
 if(session.teacher||!session.enrollment_id)fail('請先選擇學生班號',403);
 const e=must(await db.from('fcq_enrollments').select('id,class_name,student_no,school,year').eq('id',session.enrollment_id).single());
 if(e.school!=='primary4'||e.year!=='2026-27'||!['4A','4B','4C'].includes(e.class_name)||e.student_no<1||e.student_no>25)fail('學生身份不正確',403);
 const old=must(await db.from('fcq_classification_state').select('*').eq('enrollment_id',e.id).maybeSingle());
 if(body.action==='load')return reply({record:old});
 if(body.action!=='save')fail('操作不正確');
 if(!/^[0-9a-f-]{36}$/i.test(body.event_id)||!Number.isInteger(body.revision)||body.revision<0)fail('事件資料不正確');
 const duplicate=must(await db.from('fcq_classification_events').select('revision').eq('enrollment_id',e.id).eq('event_id',body.event_id).maybeSingle());if(duplicate)return reply({...duplicate,duplicate:true});
 const points=validate(catalog,body.state,old?.state);
 return reply(must(await db.rpc('fcq_classification_save',{p_id:e.id,p_event:body.event_id,p_revision:body.revision,p_state:body.state,p_score:points,p_submitted:body.state.submitted})));
 }catch(e){return new Response(JSON.stringify({error:e.message}),{headers,status:e.status|| (e.message.includes('另一個裝置')?409:400)});}
});
