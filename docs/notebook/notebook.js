import {ensureStudent,addStrip,catalog,biomeURL,picture,escapeHTML as esc,notebook,localSave} from '../shared/passport.js?v=plant-polish-v1';
const student=await ensureStudent();addStrip();document.querySelector('#studentName').textContent=`${student.year} 學年 · ${student.class_name} · ${student.student_no} 號`;
let selected='all',type='animals',data=await notebook();
const nav=document.querySelector('#biomeNav');nav.innerHTML='<button data-biome="all" class="active">四域總覽</button>'+Object.entries(catalog).map(([id,b])=>`<button data-biome="${id}">${b.name}</button>`).join('');
nav.onclick=e=>{if(e.target.dataset.biome){selected=e.target.dataset.biome;nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===e.target));render();}};
document.querySelector('#noteNav').onclick=e=>{if(e.target.dataset.type){type=e.target.dataset.type;document.querySelectorAll('[data-type]').forEach(b=>b.classList.toggle('active',b===e.target));render();}};
document.querySelector('#refresh').onclick=async()=>{const b=document.querySelector('#refresh');b.disabled=true;try{data=await notebook();render();}finally{b.disabled=false}};
const date=s=>s?new Date(s).toLocaleString('zh-HK'):'尚待同步';
function chainHTML(id,nodes){return `<div class="passport-chain">${nodes.map((s,i)=>(i?'<b>→</b>':'')+`<span><img src="${picture(id,s)}" alt=""><b>${esc(catalog[id].species.find(x=>x.id===s)?.name||s)}</b></span>`).join('')}</div>`;}
function render(){let count=0,total=0,html='';for(const [id,b] of Object.entries(catalog)){if(selected!=='all'&&selected!==id)continue;const local=localSave(id);let cards='';
 if(type==='chains'){
 const confirmed=data.chains.filter(c=>c.biome===id);const chains=[...new Map([...confirmed.map(c=>({nodes:c.nodes,first_at:c.first_at,confirmed:true})),...local.chains.map(nodes=>({nodes,confirmed:false}))].map(c=>[c.nodes.join('>'),c])).values()];
 // Prefer server-confirmed records when the same chain exists locally.
 for(const c of chains){const saved=confirmed.find(s=>s.nodes.join('>')===c.nodes.join('>'));count++;cards+=`<article class="passport-card passport-chain-card">${chainHTML(id,c.nodes)}<p class="passport-muted">${saved?'已存到雲端 ✓ · '+date(saved.first_at):'本機發現 · 待後端確認'} · ${c.nodes.length} 個生物</p></article>`;}
 if(!chains.length)cards='<p class="passport-muted">還沒有食物鏈紀錄。進入生態域，收集觀察卡並連起食物鏈吧！</p>';
 }else{
 const list=b.species.filter(s=>type==='producers'?s.kind==='producer':s.kind!=='producer');total+=list.length;
 cards='<div class="passport-grid">'+list.map(s=>{const d=data.discoveries.find(d=>d.biome===id&&d.species_id===s.id),found=!!d||local.discovered.includes(s.id);if(found)count++;return found?`<article class="passport-card"><img src="${picture(id,s.id)}" alt="${esc(s.name)}"><h3>${esc(s.name)}</h3><p>${esc(s.diet)}</p><p class="passport-muted">食物：${esc(s.food)}</p><p class="passport-muted">${d?'首次發現：'+date(d.first_at):'暫存此裝置 · 待同步'}</p><p class="passport-muted">已完成 ${data.chains.filter(c=>c.biome===id&&c.nodes.includes(s.id)).length} 條包含牠的食物鏈</p></article>`:'<article class="passport-card"><p style="font-size:42px">？</p><h3>等待你發現</h3><p class="passport-muted">走近生物，收集牠的食性線索。</p></article>';}).join('')+'</div>';
 }
 html+=`<section><div class="passport-nav"><h2>${b.name}</h2><a href="${biomeURL(id)}">進入${b.name}探索 ↗</a></div>${cards}</section>`;
 }document.querySelector('#notes').innerHTML=html;document.querySelector('#summary').textContent=type==='chains'?`已記錄 ${count} 條食物鏈（待同步者另有標示）`:`已發現 ${count} / ${total} 張卡片`;}
render();
