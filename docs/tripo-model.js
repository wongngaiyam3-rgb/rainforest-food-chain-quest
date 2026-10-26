import * as T from './vendor/three.module.v3.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
let asset;
export function attachTripoJaguar(root){
 if(typeof document==='undefined')return root;
 if(!asset)asset=new GLTFLoader().loadAsync('./assets/models/jaguar-tripo-h31.glb').then(async gltf=>{
  const model=gltf.scene;
  const converted=new Map();
  const jobs=[];model.traverse(o=>{if(!o.isMesh)return;o.castShadow=o.receiveShadow=true;for(const m of (Array.isArray(o.material)?o.material:[o.material])){m.userData.skinKey='tripo-jaguar';m.roughness=Math.max(.7,m.roughness);if(m.map?.image&&!m.map.image.naturalWidth){const source=m.map.image;if(!converted.has(source))converted.set(source,new Promise(resolve=>{const canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height;canvas.getContext('2d').drawImage(source,0,0);const image=new Image();image.onload=()=>resolve(image);image.src=canvas.toDataURL();}));jobs.push(converted.get(source).then(image=>{m.map.image=image;m.map.needsUpdate=true;}));}}});
  await Promise.all(jobs);const box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3());
  if(size.x>size.z*1.3)model.rotation.y=-Math.PI/2;
  model.updateMatrixWorld(true);const b=new T.Box3().setFromObject(model),s=b.getSize(new T.Vector3()),c=b.getCenter(new T.Vector3());
  const scale=1.65/s.y;model.scale.multiplyScalar(scale);model.position.set(-c.x*scale,-b.min.y*scale,-c.z*scale);return model;
 });
 asset.then(model=>{root.clear();root.add(model.clone(true));root.userData.parts={};root.userData.modelVersion='tripo-h31';root.userData.materialVersion='Tripo H3.1';window.dispatchEvent(new Event('tripo-model-ready'));}).catch(error=>{console.warn('Tripo model unavailable; using existing model',error);});return root;
}
