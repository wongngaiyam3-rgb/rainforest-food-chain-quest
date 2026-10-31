import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {validateChain} from '../supabase/functions/foodchain-passport/rules.js';
const catalog=JSON.parse(fs.readFileSync(new URL('../docs/shared/catalog.json',import.meta.url)));
test('server validates each biome using the same catalog and rejects forged chains',()=>{
 for(const [id,b] of Object.entries(catalog)){
 const found=b.species.map(s=>s.id),by=Object.fromEntries(b.species.map(s=>[s.id,s]));let complete;
 function walk(nodes){if(nodes.length>=3&&by[nodes.at(-1)].top){complete=nodes;return;}if(nodes.length===5)return;for(const [a,z] of b.edges)if(a===nodes.at(-1)&&!nodes.includes(z))walk([...nodes,z]);}
 for(const s of b.species.filter(s=>s.kind==='producer'))walk([s.id]);assert.ok(complete,id);assert.equal(validateChain(catalog,id,complete,found),'success');assert.equal(validateChain(catalog,id,complete,[]),'invalid');assert.equal(validateChain(catalog,id,[...complete].reverse(),found),'invalid');assert.equal(validateChain(catalog,id,[...complete,'fake'],found),'invalid');
 }
});
test('all 64 notebook pictures reference shipped assets',()=>{for(const [biome,b] of Object.entries(catalog))for(const s of b.species){const path=biome==='rainforest'?(s.kind==='producer'?'docs/shared/plant.svg':`docs/assets/animals/${s.id}.webp`):`docs/maps/assets/${biome}/${s.id}.webp`;assert.ok(fs.existsSync(path),path);}});
test('all four maps await student entry before starting; public source contains no teacher password',()=>{
 for(const file of ['docs/app.js','docs/maps/app.js']){const s=fs.readFileSync(file,'utf8');assert.match(s,/await ensureStudent\(\)/);assert.match(s,/saveProgress\(/);assert.doesNotMatch(s,/localStorage.setItem\(STORAGE/);}
 function scan(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const p=dir+'/'+item.name;if(item.isDirectory())scan(p);else if(/\.(js|html|json|sql|md)$/.test(p))assert.ok(!fs.readFileSync(p,'utf8').includes('cncforever'),p);}}scan('docs');scan('supabase');
});
