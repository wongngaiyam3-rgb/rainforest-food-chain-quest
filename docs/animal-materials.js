import * as T from './vendor/three.module.v3.js';

// Separate species albedo and fine-scale relief. Dark coat markings are pigment,
// never deep bumps; whites are kept independent from the dorsal coat.
export const MATERIAL_VERSION='Wildlife V4';
export const SKIN_IDS=['grasshopper','iguana','sloth','frog','owl','harpy','agouti','paca','tapir','peccary','coati','toucan','boa','ocelot','jaguar','belly-fur','breast-feathers','yellow-feathers'];
const loaded=new Map(),materials=new Map();
const bird=new Set(['owl','harpy','toucan','breast-feathers','yellow-feathers']);
const config={frog:[.46,.002],iguana:[.77,.006],boa:[.69,.004],grasshopper:[.65,.003],tapir:[.89,.002],sloth:[.96,.008]};
const palettes={
 frog:['66a744','80bc49','76ac3e','5a973b','80ac3b','7aae42','5d923b','76a13b'],
 iguana:['719843','a4b75a','81a647','9fb657','6b913f','aec765','a6b765','b4b56d','a8b66a'],
 grasshopper:['71aa46','a8c85b','9cba52','67993a','527f34','8db449','698f3f'],
 sloth:['8e8069','b0a189','b4a58b','94846b','85765f','91816a'],
 owl:['65523e','8e7857','695b49'],harpy:['43505a','45545a','718079'],
 agouti:['a37442','825b35','b38d60'],paca:['796044','b38d60'],
 tapir:['685b4c','857361','766452','665748'],peccary:['5d6255','807b67','716f5d','454e43'],
 coati:['9e7549','c5a477','a37b4d'],toucan:['222f2e','293630','2d423b','3c5448','2b3a30','263c35'],
 boa:['a0915e','a6996b'],ocelot:['c4aa75'],jaguar:['c7a251']
};
const bellies={agouti:['c9a26d'],paca:['c9b697'],coati:['cfb889'],ocelot:['e4d7ad','e8d9b5','f1e5c9'],jaguar:['e4d7ad','e8d9b5','f1e5c9'],sloth:['d9d0b4']};
function update(m){const pack=loaded.get(m.userData.skinKey);if(!pack)return;if(pack.albedo){m.map=pack.albedo;m.color.set('#'+m.userData.tint);}if(pack.height)m.bumpMap=pack.height;m.needsUpdate=true;}
export function applyAnimalTexture(key,channel,texture){if(!SKIN_IDS.includes(key)||!['albedo','height'].includes(channel))throw Error('Unknown animal texture');const pack=loaded.get(key)||{};pack[channel]=texture;loaded.set(key,pack);for(const m of materials.values())if(m.userData.skinKey===key)update(m);}
function material(key,tint='ffffff',side=T.FrontSide){const cacheKey=key+':'+tint+':'+side;if(materials.has(cacheKey))return materials.get(cacheKey);const [roughness,bumpScale]=config[key]||[bird.has(key)?.79:.94,bird.has(key)?.0035:.004];const m=new T.MeshPhysicalMaterial({color:'#'+tint,roughness,bumpScale,metalness:0,side,clearcoat:key==='frog'?.16:0,clearcoatRoughness:.5});m.name='wildlife-v4:'+key;m.userData={skinKey:key,tint,materialVersion:MATERIAL_VERSION};if(!loaded.get(key)?.albedo){const defaults={jaguar:'c7a251',ocelot:'c4aa75',paca:'796044',coati:'9e7549',sloth:'8e8069',agouti:'a37442',peccary:'5d6255',tapir:'685b4c',owl:'65523e',harpy:'43505a',iguana:'719843',boa:'a0915e',frog:'66a744',grasshopper:'71aa46',toucan:'222f2e','belly-fur':'efe0c8','breast-feathers':'eee9da','yellow-feathers':'f0cf53'};m.color.set('#'+defaults[key]);}update(m);materials.set(cacheKey,m);return m;}
function fitCoatUV(mesh,key){
 if(!['jaguar','ocelot','paca'].includes(key)||!mesh.geometry.attributes.uv||mesh.geometry.type==='TubeGeometry')return;
 // Shared primitives must be cloned before editing UVs. This keeps spots a
 // comparable physical size on the broad flank, smaller face and narrow legs.
 const geometry=mesh.geometry.clone();geometry.computeBoundingBox();const size=geometry.boundingBox.getSize(new T.Vector3()).multiply(mesh.scale);
 const around=T.MathUtils.clamp(Math.PI*Math.hypot(size.x,size.y)/2/1.25,.18,2.4),along=T.MathUtils.clamp(size.z/1.25,.16,2.8),uv=geometry.attributes.uv;
 for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*around+mesh.position.x*.35,uv.getY(i)*along+mesh.position.z*.3);uv.needsUpdate=true;mesh.geometry=geometry;
}
export function finishAnimalMaterials(g,id){
 // Replace old raised spot beads with the actual pigmentation in the new coat.
 const obsolete=id==='jaguar'?['4b4930','665433']:id==='ocelot'?['4a4933']:id==='paca'?['eadaba']:[];
 const remove=[];g.traverse(o=>{if(o.isMesh&&obsolete.includes(o.material?.color?.getHexString()))remove.push(o);});for(const o of remove)o.removeFromParent();
 g.traverse(o=>{if(!o.isMesh||!o.material?.color)return;const hex=o.material.color.getHexString();let key=null,tint='ffffff';
  if(palettes[id]?.includes(hex)||o.userData.surfaceType)key=id;
  if(bellies[id]?.includes(hex)){key='belly-fur';tint=id==='coati'?'dfcbb0':id==='agouti'?'d6bb96':'fff9ee';}
  if(id==='owl'&&['dcc49a','d8c6a7'].includes(hex)){key='breast-feathers';tint='c6ae88';}
  if(id==='harpy'&&['e5e6ce','bec7bf','84918c'].includes(hex)){key='breast-feathers';tint=hex==='84918c'?'929b9d':'f2f1e7';}
  if(id==='toucan'&&hex==='f0cf53')key='yellow-feathers';
  if(key){fitCoatUV(o,key);o.material=material(key,tint,o.material.side);o.userData.skinKey=key;o.userData.materialVersion=MATERIAL_VERSION;o.receiveShadow=true;}
  else if(['102b25','eeb73c','e86f35','eeb645','b99b56'].includes(hex)){o.material=o.material.clone();o.material.roughness=.18;}
 });
 g.userData.materialVersion=MATERIAL_VERSION;return g;
}
export function loadAnimalTextures(renderer){
 const loader=new T.TextureLoader(),anisotropy=renderer.capabilities?Math.min(8,renderer.capabilities.getMaxAnisotropy()):1;
 const status={loaded:0,total:SKIN_IDS.length*2,failed:[],version:MATERIAL_VERSION};
 const ready=Promise.all(SKIN_IDS.flatMap(key=>['albedo','height'].map(channel=>new Promise(resolve=>{
  loader.load(`./assets/skins-v4/${key}${channel==='height'?'-height':''}.webp`,texture=>{texture.colorSpace=channel==='albedo'?T.SRGBColorSpace:T.NoColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.anisotropy=anisotropy;texture.name=key+':'+channel;applyAnimalTexture(key,channel,texture);status.loaded++;resolve();},undefined,()=>{status.failed.push(key+':'+channel);console.warn('Animal texture unavailable',key,channel);resolve();});
 }))));return {status,ready};
}
