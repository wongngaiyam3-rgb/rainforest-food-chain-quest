import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {animalSpecies} from '../docs/data.js';
import {TRIPO_IDS} from '../docs/tripo-model.js?v=tripo-all-v6';
test('every remaining animal has a complete unrigged textured Tripo GLB',async()=>{
 assert.deepEqual([...TRIPO_IDS].sort(),animalSpecies.map(s=>s.id).sort());
 for(const id of TRIPO_IDS){const b=await readFile(new URL(`../docs/assets/models/${id}-tripo-h31.glb`,import.meta.url));assert.equal(b.toString('ascii',0,4),'glTF');assert.equal(b.readUInt32LE(4),2);assert.equal(b.readUInt32LE(8),b.length);
  const n=b.readUInt32LE(12),g=JSON.parse(b.toString('utf8',20,20+n));assert.ok(g.meshes.length);assert.ok(g.images.length);assert.equal(g.skins?.length||0,0);assert.equal(g.animations?.length||0,0);assert.ok(!g.extensionsRequired?.length,'unsupported mesh compression');
  for(const view of g.bufferViews)assert.ok((view.byteOffset||0)+view.byteLength<=g.buffers[0].byteLength,`${id}: truncated buffer`);
  for(const im of g.images)assert.ok(Number.isInteger(im.bufferView),'textures must travel inside GLB');
  for(const mesh of g.meshes)for(const primitive of mesh.primitives){const position=g.accessors[primitive.attributes.POSITION];assert.ok(position.count>100);assert.ok([...position.min,...position.max].every(Number.isFinite));assert.ok(primitive.material>=0);}
 }
});
