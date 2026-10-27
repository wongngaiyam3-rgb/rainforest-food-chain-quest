import * as T from './vendor/three.module.v3.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
const assets=new Map();
const targetHeight={jaguar:1.65,harpy:1.65,agouti:1.1,tapir:1.65,peccary:1.1,coati:2,toucan:1.4};
const targetLength={grasshopper:1.5,iguana:3,frog:1.3,boa:3.2};
export const TRIPO_IDS=['jaguar','grasshopper','iguana','frog','harpy','agouti','tapir','peccary','coati','toucan','boa'];
export function attachTripoAnimal(root,id){
 if(typeof document==='undefined'||!TRIPO_IDS.includes(id))return root;
 let asset=assets.get(id);
 if(!asset)asset=new GLTFLoader().loadAsync(`./assets/models/${id}-tripo-h31.glb`).then(async gltf=>{
  const model=gltf.scene;
  const converted=new Map();
  const jobs=[];model.traverse(o=>{if(!o.isMesh)return;o.castShadow=o.receiveShadow=true;o.userData.tripoModel=true;for(const m of (Array.isArray(o.material)?o.material:[o.material])){m.userData.skinKey='tripo-'+id;m.roughness=Math.max(.7,m.roughness);if(m.map?.image&&!m.map.image.naturalWidth){const source=m.map.image;if(!converted.has(source))converted.set(source,new Promise((resolve,reject)=>{const canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height;canvas.getContext('2d').drawImage(source,0,0);const image=new Image();image.onload=()=>{source.close?.();resolve(image);};image.onerror=()=>reject(Error("Texture decode failed"));image.src=canvas.toDataURL();}));jobs.push(converted.get(source).then(image=>{m.map.image=image;m.map.needsUpdate=true;}));}}});
  await Promise.all(jobs);const box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3());
  if(size.x>size.z*1.3)model.rotation.y=-Math.PI/2;
  model.updateMatrixWorld(true);const b=new T.Box3().setFromObject(model),s=b.getSize(new T.Vector3()),c=b.getCenter(new T.Vector3());
  const scale=targetLength[id]?targetLength[id]/Math.max(s.x,s.y,s.z):(targetHeight[id]||1.5)/s.y;model.scale.multiplyScalar(scale);model.position.set(-c.x*scale,-b.min.y*scale,-c.z*scale);return model;
 });
 assets.set(id,asset);
 asset.then(model=>{root.clear();root.add(model.clone(true));root.userData.parts={};root.userData.modelVersion='tripo-h31';root.userData.materialVersion='Tripo H3.1';window.dispatchEvent(new CustomEvent('tripo-model-ready',{detail:{id}}));}).catch(error=>{assets.delete(id);console.warn('Tripo model unavailable; using existing model',id,error);window.dispatchEvent(new CustomEvent('tripo-model-error',{detail:{id}}));});return root;
}
