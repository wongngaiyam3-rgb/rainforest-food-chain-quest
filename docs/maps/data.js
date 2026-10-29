import {biomes} from "./biomes.js?v=savanna-hyena-v1";
export const mapId=typeof location!=="undefined"&&Object.hasOwn(biomes,new URLSearchParams(location.search).get("map"))?new URLSearchParams(location.search).get("map"):"ocean";
export const {biome,species,edges,sources}=biomes[mapId];
export const byId=Object.fromEntries(species.map(s=>[s.id,s]));
export const animalSpecies=species.filter(s=>s.kind==="consumer");
export function checkChain(ids,discovered){
 if(ids.length<3)return {status:'error',message:'先放入至少三張卡片，再試試連起食物鏈。'};
 if(ids.some(id=>!byId[id]||!discovered.includes(id)))return {status:'error',message:'請先走近生物，收集牠的觀察卡。'};
 if(new Set(ids).size!==ids.length)return {status:'error',message:'同一條食物鏈中，每種生物只使用一次。'};
 if(byId[ids[0]].kind!=='producer')return {status:'error',index:0,message:'想想食物鏈從哪裡開始。先找能自行製造養分的生物。'};
 for(let i=0;i<ids.length-1;i++)if(!edges.some(e=>e[0]===ids[i]&&e[1]===ids[i+1]))return {status:'error',index:i+1,message:`再看看「${byId[ids[i+1]].name}」的食性卡：牠會吃前面的生物嗎？`};
 if(!byId[ids.at(-1)].top)return {status:'partial',message:'這段食物關係正確！再探索一下，還有誰會吃最後的生物？'};
 return {status:'success',message:'食物鏈成立！箭頭由被吃的生物，指向吃牠的生物。',levels:ids.map((id,i)=>i===0?'生產者':`${['','一','二','三','四'][i]}級消費者${byId[id].top?' · 模型頂端':''}`)};
}
export const STORAGE='biome-quest-v1-'+mapId;
export function cleanSave(value){
 const v=value&&typeof value==='object'?value:{};
 const discovered=[...new Set((Array.isArray(v.discovered)?v.discovered:[]).filter(x=>byId[x]))];
 const chains=(Array.isArray(v.chains)?v.chains:[]).filter(c=>Array.isArray(c)&&checkChain(c,discovered).status==='success');
 return {version:1,discovered,chains:[...new Map(chains.map(c=>[c.join('>'),c])).values()],arrow:!!v.arrow,muted:v.muted!==false,quality:v.quality==='low'?'low':'high'};
}
