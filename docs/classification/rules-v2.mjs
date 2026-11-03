export const emptyState=()=>({version:2,obs:{},compare:{},lessons:{},practice:{},exam:{},firstExam:null,submitted:false});
export const correct=(c,id,r)=>{const a=c.animals.find(a=>a.id===id);return !!a&&r?.category===a.category&&Array.isArray(r.evidence)&&r.evidence.length>0&&r.evidence.every(e=>c.categories[a.category].accepted.includes(e));};
export function score(c,s){return c.animals.filter(a=>correct(c,a.id,s.firstExam?.[a.id])).length;}
export function report(c,s){return Object.entries(c.categories).map(([id,v])=>{const aa=c.animals.filter(a=>a.category===id);const attempted=aa.filter(a=>s.firstExam?.[a.id]);return {id,name:v.name,total:aa.length,attempted:attempted.length,firstCorrect:attempted.filter(a=>correct(c,a.id,s.firstExam[a.id])).length,practiceHints:aa.reduce((n,a)=>n+(s.practice[a.id]?.hints||0),0)};});}
export function validate(c,s,prev=null){const fail=m=>{throw Error(m)},obj=v=>v&&typeof v==='object'&&!Array.isArray(v);if(!obj(s)||s.version!==2||typeof s.submitted!=='boolean')fail('活動版本不正確');for(const k of ['obs','compare','lessons','practice','exam'])if(!obj(s[k]))fail('學習紀錄不正確');
 const animals=new Set(c.animals.map(a=>a.id));const spec={obs:c.animals.map(a=>[a.id,Object.keys(c.features).length]),compare:c.comparisons.map(q=>[q.id,q.choices.length]),lessons:c.lessons.map(q=>[q.id,q.choices.length])};
 for(const [kind,items] of Object.entries(spec)){const dict=Object.fromEntries(items);for(const [id,r] of Object.entries(s[kind])){if(!Object.hasOwn(dict,id)||!obj(r)||!Number.isInteger(r.first)||!Number.isInteger(r.last)||r.first<0||r.last<0||r.first>=dict[id]||r.last>=dict[id]||!Number.isInteger(r.attempts)||r.attempts<1||r.attempts>100||typeof r.complete!=='boolean')fail('觀察或學習答案不正確');if(prev?.[kind]?.[id]&&prev[kind][id].first!==r.first)fail('首次答案不能改寫');}}
 const choice=r=>obj(r)&&Object.hasOwn(c.categories,r.category)&&Array.isArray(r.evidence)&&r.evidence.length<=12&&new Set(r.evidence).size===r.evidence.length&&r.evidence.every(e=>Object.hasOwn(c.evidence,e));
 for(const [id,r] of Object.entries(s.practice)){if(!animals.has(id)||!obj(r)||!choice(r.first)||!choice(r.last)||!Number.isInteger(r.attempts)||r.attempts<1||r.attempts>100||!Number.isInteger(r.hints)||r.hints<0||r.hints>100||typeof r.complete!=='boolean')fail('練習紀錄不正確');if(prev?.practice?.[id]&&JSON.stringify(prev.practice[id].first)!==JSON.stringify(r.first))fail('首次練習答案不能改寫');}
 for(const [id,r] of Object.entries(s.exam))if(!animals.has(id)||!choice(r))fail('獨立分類資料不正確');
 if(s.firstExam!==null){if(!obj(s.firstExam)||c.animals.some(a=>!choice(s.firstExam[a.id])||!s.firstExam[a.id].evidence.length)||Object.keys(s.firstExam).length!==c.animals.length)fail('請完成全部獨立分類');}
 if(prev?.firstExam&&JSON.stringify(prev.firstExam)!==JSON.stringify(s.firstExam))fail('首次獨立分類不能改寫');
 if(s.submitted&&!s.firstExam)fail('請先提交獨立分類');
 return score(c,s);
}
