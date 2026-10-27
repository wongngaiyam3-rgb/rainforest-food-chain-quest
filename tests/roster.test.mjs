import test from 'node:test';
import assert from 'node:assert/strict';
import {species,animalSpecies,byId,edges,cleanSave,checkChain} from '../docs/data.js';
test('removed animals have no discovery cards or food-chain links',()=>{
 assert.equal(species.length,13);assert.equal(animalSpecies.length,11);
 for(const id of ['sloth','owl','paca','ocelot'])assert.equal(byId[id],undefined);
 for(const edge of edges)for(const id of edge)assert.ok(byId[id],`Dangling food-chain member ${id}`);
 for(const s of species)assert.ok(!/樹懶|眼鏡鴞|無尾刺豚鼠|虎貓/.test(s.diet+' '+s.food));
});
test('existing saves retain valid progress and discard removed animals and chains',()=>{
 const valid=['fig','agouti','boa','harpy'];const save=cleanSave({discovered:[...valid,'owl','sloth','paca','ocelot'],chains:[valid,['fig','paca','jaguar']],muted:true});
 assert.deepEqual(save.discovered,valid);assert.deepEqual(save.chains,[valid]);assert.equal(save.muted,true);
 assert.equal(checkChain(valid,species.map(s=>s.id)).status,'success');
 assert.equal(checkChain(['broadleaf','grasshopper','coati','jaguar'],species.map(s=>s.id)).status,'success');
});
