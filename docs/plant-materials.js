import * as THREE from './vendor/three.module.v3.js';
const textures=new Map();
function texture(name){if(!textures.has(name)){const t=new THREE.TextureLoader().load(new URL('./assets/plants/'+name+'.svg',import.meta.url).href);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=2;textures.set(name,t);}return textures.get(name);}
export function finishPlantMaterials(plant,id){
 if(typeof document==='undefined')return plant;
 plant.traverse(mesh=>{if(!mesh.isMesh)return;const isLeaf=mesh.geometry?.name==='botanical-leaf';const isBark=id==='fig'&&mesh.geometry?.type==='CylinderGeometry';if(!isLeaf&&!isBark)return;
 const material=mesh.material.clone();material.map=texture(isLeaf?id+'-leaf':'fig-bark');material.color.set('#ffffff');material.roughness=isLeaf?.66:.92;material.side=isLeaf?THREE.DoubleSide:material.side;material.needsUpdate=true;mesh.material=material;mesh.userData.plantTexture=isLeaf?'leaf':'bark';});return plant;
}
