import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as T from '../docs/vendor/three.module.v3.js';
import {createAnimal,animateModel} from '../docs/models.js';
import {animalSpecies} from '../docs/data.js';
import {SKIN_IDS,applyAnimalTexture} from '../docs/animal-materials.js?v=wildlife-v4';
import {textureAffine} from '../docs/software-renderer.js';
const meshes=g=>{const r=[];g.traverse(o=>{if(o.isMesh)r.push(o);});return r;};

test('15 animated species use their own coat, valid UVs and finite anatomy',()=>{
 assert.equal(animalSpecies.length,15);
 for(const {id} of animalSpecies){const g=createAnimal(id),body=meshes(g).filter(m=>m.userData.skinKey===id);assert.ok(body.length,`${id}: body has no own coat`);
  for(const m of body){assert.ok(m.geometry.attributes.uv,`${id}: missing UV coordinates`);assert.ok([...m.geometry.attributes.uv.array].every(Number.isFinite));}
  for(const t of [0,.7,8.2]){animateModel(g,t,1);g.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(g),size=bounds.getSize(new T.Vector3());assert.ok([...bounds.min.toArray(),...bounds.max.toArray()].every(Number.isFinite));assert.ok(size.toArray().every(n=>n>.1&&n<8));}
 }
});
test('async albedo and pigment-free relief update existing/future bodies without reaching eyes',()=>{
 const existing=animalSpecies.map(({id})=>createAnimal(id)),textures=new Map();
 const eyes=existing.flatMap(meshes).filter(m=>m.material.color?.getHexString()==='102b25');assert.ok(eyes.length>15);
 for(const key of SKIN_IDS){const albedo=new T.Texture(),height=new T.Texture();textures.set(key,{albedo,height});applyAnimalTexture(key,'albedo',albedo);applyAnimalTexture(key,'height',height);}
 for(const g of [...existing,...animalSpecies.map(({id})=>createAnimal(id))])for(const m of meshes(g).filter(m=>m.userData.skinKey)){const pack=textures.get(m.userData.skinKey);assert.equal(m.material.map,pack.albedo);assert.equal(m.material.bumpMap,pack.height);assert.notEqual(m.material.map,m.material.bumpMap);assert.equal(m.material.roughnessMap,null);assert.ok(m.material.bumpScale<=.008);}
 for(const eye of eyes)assert.equal(eye.material.map,null,'coat texture leaked onto an eye');
});
test('all new albedo and relief assets are complete WebP images',async()=>{
 for(const key of SKIN_IDS)for(const suffix of ['','-height']){const bytes=await readFile(new URL(`../docs/assets/skins-v4/${key}${suffix}.webp`,import.meta.url));assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.equal(bytes.readUInt32LE(4)+8,bytes.length);assert.ok(bytes.length>1000);}
});
test('Canvas fallback maps UV vertices to the correct screen triangle',()=>{
 const screen=[{x:5,y:8},{x:80,y:10},{x:20,y:90}],uv=[[0,0],[1,0],[0,1]],m=textureAffine(screen,uv,640,640);assert.ok(m);
 uv.forEach(([u,v],i)=>{const x=u*640,y=(1-v)*640;assert.ok(Math.abs(m[0]*x+m[2]*y+m[4]-screen[i].x)<1e-6);assert.ok(Math.abs(m[1]*x+m[3]*y+m[5]-screen[i].y)<1e-6);});assert.equal(textureAffine(screen,[[0,0],[0,0],[0,0]],640,640),null);
});
