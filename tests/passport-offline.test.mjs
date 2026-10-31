import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('offline events remain attached to the original student; switching cannot relabel them',async()=>{
 const values=new Map(),local={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 globalThis.localStorage=local;globalThis.sessionStorage={getItem:()=>JSON.stringify({id:'original',token:'test'}),setItem(){}};
 globalThis.window={addEventListener(){}};globalThis.document={querySelector:()=>null,addEventListener(){}};Object.defineProperty(globalThis,'navigator',{value:{onLine:false},configurable:true});
 globalThis.setInterval=()=>0;
 local.setItem('fcq-passport-v1:identity',JSON.stringify({id:'original',class_name:'4A',student_no:1}));
 local.setItem('fcq-passport-v1:original:cloud',JSON.stringify({discoveries:[],chains:[],activities:[]}));
 const catalog=JSON.parse(fs.readFileSync('docs/shared/catalog.json'));
 globalThis.fetch=async url=>{if(String(url).endsWith('catalog.json'))return {ok:true,json:async()=>catalog};throw Error('offline')};
 const p=await import('../docs/shared/passport.js?offline-test');await p.ensureStudent();
 p.saveProgress('ocean',{discovered:['phytoplankton'],chains:[],arrow:false});await Promise.resolve();await Promise.resolve();
 const q=JSON.parse(local.getItem('fcq-passport-v1:original:queue'));assert.equal(q.length,1);assert.equal(q[0].species_id,'phytoplankton');assert.equal(q[0].type,'discovery');
 local.setItem('fcq-passport-v1:identity',JSON.stringify({id:'another',class_name:'4A',student_no:2}));
 assert.throws(()=>p.saveProgress('ocean',{discovered:['shrimp'],chains:[]}),/學生已切換/);assert.equal(local.getItem('fcq-passport-v1:another:queue'),null);assert.equal(JSON.parse(local.getItem('fcq-passport-v1:original:queue')).length,1);
});
