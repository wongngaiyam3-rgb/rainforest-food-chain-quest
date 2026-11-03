export const emptyState=()=>({observations:{},groups:[{id:'g1',name:'第一組',rule:''},{id:'g2',name:'第二組',rule:''}],placements:{},first:null,research:[],final:{},hints:[],reflection:'',submitted:false});
export function score(c,s){return c.animals.reduce((n,a)=>n+(s.final[a.id]?.category===a.category&&s.final[a.id]?.evidence===c.categories[a.category].evidence?1:0),0)}
export function validate(c,s,previous=null){
 const bad=m=>{throw Error(m)};const obj=x=>x&&typeof x==='object'&&!Array.isArray(x);const text=(x,n)=>typeof x==='string'&&x.length<=n;
 if(!obj(s)||!obj(s.observations)||!obj(s.placements)||!obj(s.final))bad('學習資料格式不正確');
 const ids=c.animals.map(a=>a.id);if(Object.keys(s.observations).some(k=>!ids.includes(k)))bad('觀察動物不存在');
 for(const v of Object.values(s.observations))if(!Array.isArray(v)||v.length>12||!v.length||v.some(x=>!Object.hasOwn(c.features,x)))bad('觀察特徵不正確');
 if(!Array.isArray(s.groups)||s.groups.length<2||s.groups.length>6||new Set(s.groups.map(g=>g.id)).size!==s.groups.length)bad('請建立二至六個不同組別');
 for(const g of s.groups)if(!obj(g)||!/^g[0-9]+$/.test(g.id)||!text(g.name,30)||!g.name.trim()||!text(g.rule,150))bad('組別名稱或規則不正確');
 for(const [id,g] of Object.entries(s.placements))if(!ids.includes(id)||!s.groups.some(x=>x.id===g))bad('自主分類位置不正確');
 if(s.first!==null){if(!obj(s.first)||JSON.stringify(s.first.groups)!==JSON.stringify(s.groups)||JSON.stringify(s.first.placements)!==JSON.stringify(s.placements)||ids.some(id=>!s.first.placements[id])||s.groups.some(g=>!g.rule.trim()))bad('第一次分類需完成所有動物及分類規則');}
 if(previous?.first&&JSON.stringify(previous.first)!==JSON.stringify(s.first))bad('第一次分類已保存，請在科學分類階段修訂');
 if(!Array.isArray(s.research)||s.research.some(id=>!ids.includes(id)))bad('研究紀錄不正確');
 if(s.research.length&&!s.first)bad('請先保存第一次分類');
 for(const [id,v] of Object.entries(s.final))if(!ids.includes(id)||!obj(v)||!Object.hasOwn(c.categories,v.category)||!(v.evidence===''||Object.hasOwn(c.evidence,v.evidence)))bad('科學分類資料不正確');
 if(Object.keys(s.final).length&&!s.first)bad('請先保存第一次分類');
 if(!Array.isArray(s.hints)||s.hints.length>200||s.hints.some(id=>!ids.includes(id))||!text(s.reflection,300)||typeof s.submitted!=='boolean')bad('反思或提示紀錄不正確');
 if(s.submitted&&(!s.first||ids.some(id=>!s.observations[id]?.length||!s.final[id]?.evidence)||!s.reflection.trim()))bad('請完成觀察、全部分類及反思後再提交');
 return score(c,s);
}
