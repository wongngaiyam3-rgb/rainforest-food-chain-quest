export function validateChain(catalog,biome,nodes,discovered){
 const b=catalog[biome];if(!b||!Array.isArray(nodes)||nodes.length<3||nodes.length>5)return 'invalid';
 const by=Object.fromEntries(b.species.map(s=>[s.id,s]));
 if(new Set(nodes).size!==nodes.length||nodes.some(id=>!by[id]||!discovered.includes(id))||by[nodes[0]].kind!=='producer')return 'invalid';
 if(nodes.slice(1).some((id,i)=>!b.edges.some(e=>e[0]===nodes[i]&&e[1]===id)))return 'invalid';
 return by[nodes.at(-1)].top?'success':'partial';
}
