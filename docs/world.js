import * as T from './vendor/three.module.js';
import {createAnimal,createExplorer,createPlant,animateModel,applySurfaceTextures} from './models.js?v=anatomy-v3';
import {animalSpecies} from './data.js';
import {SoftwareRenderer} from './software-renderer.js';

export function createWorld(container,quality='high'){
 let renderer;try{renderer=new T.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});}catch{renderer=new SoftwareRenderer();}
 renderer.setPixelRatio(Math.min(devicePixelRatio,quality==='low'?1:1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=quality!=='low';renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;container.append(renderer.domElement);
 const textureLoader=new T.TextureLoader();const surfaces={};for(const key of ['scales','fur','feathers']){textureLoader.load(`./assets/surfaces/${key}.webp`,texture=>{texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(key==='fur'?3:2,key==='fur'?3:2);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;surfaces[key]=texture;applySurfaceTextures(surfaces);},undefined,()=>console.warn('Surface texture unavailable:',key));}
 const scene=new T.Scene();scene.background=new T.Color('#a3c4a3');scene.fog=new T.FogExp2('#9cbb98',.019);
 const camera=new T.PerspectiveCamera(48,innerWidth/innerHeight,.1,150);const hemi=new T.HemisphereLight('#e0f4d7','#486c3c',2.4);scene.add(hemi);
 const sun=new T.DirectionalLight('#fff0c2',3.4);sun.position.set(-22,38,15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-40;sun.shadow.camera.right=40;sun.shadow.camera.top=40;sun.shadow.camera.bottom=-40;sun.shadow.normalBias=.1;sun.shadow.bias=-.0004;scene.add(sun);
 const mats=new Map();function mat(c,extra={}){const key=c+JSON.stringify(extra);if(!mats.has(key))mats.set(key,new T.MeshStandardMaterial({color:c,roughness:.95,...extra}));return mats.get(key);}
 const meshes=[];const solids=[];const plants=[];const animals=[];const decorations=[];
 function mesh(geo,m,x=0,y=0,z=0,parent=scene){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function cylinderBetween(a,b,r,c,parent=scene){const dir=new T.Vector3().subVectors(b,a);const o=mesh(new T.CylinderGeometry(r*.7,r,dir.length(),7),mat(c),0,0,0,parent);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize());return o;}
 const ground=mesh(new T.PlaneGeometry(92,92),mat('#718a4d'),0,-.05,0);ground.rotation.x=-Math.PI/2;ground.castShadow=false;
 const pathPoints=[[0,26],[0,14],[-11,10],[-19,-2],[-16,-14],[-2,-23],[12,-16],[17,-2],[10,13],[0,14]];
 function path(points,width=3.5,color='#c4b682'){
  const curve=new T.CatmullRomCurve3(points.map(([x,z])=>new T.Vector3(x,.012,z)));const ps=curve.getPoints(160);const vertices=[],idx=[];
  for(let i=0;i<ps.length;i++){const tangent=curve.getTangent(i/(ps.length-1));const right=new T.Vector3(-tangent.z,0,tangent.x).normalize().multiplyScalar(width/2);vertices.push(ps[i].x+right.x,.015,ps[i].z+right.z,ps[i].x-right.x,.015,ps[i].z-right.z);if(i<ps.length-1){let n=i*2;idx.push(n,n+2,n+1,n+1,n+2,n+3);}}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setIndex(idx);geo.computeVertexNormals();const o=mesh(geo,mat(color));o.castShadow=false;return curve;
 }
 path(pathPoints);path([[0,14],[8,5],[15,3],[23,4]],2.9);path([[-19,-2],[-22,-7],[-17,-11]],2.6);path([[12,-16],[12,-11],[8,-9]],2.6);
 function distanceToRoute(x,z){let best=1e3;for(let k=0;k<pathPoints.length-1;k++){const [ax,az]=pathPoints[k],[bx,bz]=pathPoints[k+1];const v=((x-ax)*(bx-ax)+(z-az)*(bz-az))/((bx-ax)**2+(bz-az)**2);const u=Math.max(0,Math.min(1,v));best=Math.min(best,Math.hypot(x-ax-(bx-ax)*u,z-az-(bz-az)*u));}return best;}
 // River: a gently curved ribbon, with reachable banks and a bridge.
 const riverPoints=[];for(let z=-39;z<=39;z+=4)riverPoints.push([23+Math.sin(z*.11)*2,z]);path(riverPoints,4.2,'#619e99');
 const water=scene.children.at(-1);water.material=mat('#6baea4',{roughness:.3,metalness:.13});
 const bankMaterial=mat('#859963');for(let z=-37;z<38;z+=2.6)for(const s of [-1,1])mesh(new T.DodecahedronGeometry(.35+Math.abs(Math.sin(z))*.25,0),bankMaterial,23+Math.sin(z*.11)*2+s*2.5,.12,z);
 function deck(x,z,w=4,d=3){mesh(new T.BoxGeometry(w,.28,d),mat('#9b7d4c'),x,.12,z);for(let i=0;i<d/.3;i++)mesh(new T.BoxGeometry(w,.045,.25),mat(i%2?'#c0a274':'#b19565'),x,.28,z-d/2+i*.3);}
 deck(23,4,7,2.6);deck(-18,-10,5,4);deck(10,-12,5,3);deck(-2,-23,5,3);
 // All observation platforms are low and accessible, with no precision jumping.
 function sign(text,x,z,rot=0){const cv=document.createElement('canvas');cv.width=512;cv.height=128;const ctx=cv.getContext('2d');ctx.fillStyle='#e2ce97';ctx.fillRect(0,0,512,128);ctx.strokeStyle='#aa8a50';ctx.lineWidth=8;ctx.strokeRect(8,8,496,112);ctx.fillStyle='#365b39';ctx.font='bold 47px "Microsoft JhengHei",sans-serif';ctx.textAlign='center';ctx.fillText(text,256,82);const tx=new T.CanvasTexture(cv);const g=new T.Group();mesh(new T.BoxGeometry(.12,1.2,.12),mat('#795b38'),0,.6,0,g);mesh(new T.BoxGeometry(2.7,.69,.10),new T.MeshStandardMaterial({map:tx,roughness:1}),0,1.2,0,g);g.position.set(x,0,z);g.rotation.y=rot;scene.add(g);}
 sign('探索營地',-2.9,24,.2);sign('闊葉林',-12,9,.5);sign('溪流葉叢',13,7,-.25);sign('榕樹觀察區',-20,-6,.4);sign('林冠觀察地',-5,-20,.2);
 const tent=new T.Group();const tentGeo=new T.ConeGeometry(2.4,2.8,4);mesh(tentGeo,mat('#e5bc68'),0,1.4,0,tent).rotation.y=Math.PI/4;mesh(new T.PlaneGeometry(1.1,1.65),mat('#4c6847',{side:T.DoubleSide}),0,.83,1.71,tent);tent.position.set(-6,0,26);scene.add(tent);
 for(let i=0;i<3;i++)mesh(new T.CylinderGeometry(.18,.18,2.5,7),mat('#9a7547'),3,.25,24+i*.45).rotation.z=Math.PI/2;
 let seed=4138;function rnd(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
 const canopyGeo=new T.IcosahedronGeometry(1,1);const treeColors=['#3a7040','#497f42','#5d8a45','#6b944d','#437b4f'];
 function tree(x,z,h=9,sc=1,obstacle=true){
  const g=new T.Group();g.position.set(x,0,z);scene.add(g);const trunk=mesh(new T.CylinderGeometry(.24*sc,.48*sc,h,8),mat('#766447'),0,h/2,0,g);if(obstacle)solids.push({x,z,r:.65*sc,mesh:trunk});
  for(let j=0;j<3;j++){const a=j*2.094;const end=new T.Vector3(Math.cos(a)*2.2*sc,h*.8,Math.sin(a)*2.2*sc);cylinderBetween(new T.Vector3(0,h*.57,0),end,.15*sc,'#7e6b48',g);const crown=mesh(canopyGeo,mat(treeColors[(j+Math.floor(rnd()*3))%5]),end.x,h*.9,end.z,g);crown.scale.set(2.7*sc,1.8*sc,2.6*sc);decorations.push(crown);}
  for(let j=0;j<4;j++){const a=j*Math.PI/2;cylinderBetween(new T.Vector3(0,.9,0),new T.Vector3(Math.cos(a)*1.15*sc,.03,Math.sin(a)*1.15*sc),.16*sc,'#766447',g);}
  if(rnd()>.45){const pts=[new T.Vector3(.3,h*.8,0),new T.Vector3(.8,h*.5,.4),new T.Vector3(.5,1.2,.1)];mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),10,.035,4,false),mat('#64834a'),0,0,0,g);}
 }
 for(let i=0;i<128;i++){const x=(rnd()-.5)*85,z=(rnd()-.5)*85;if(Math.hypot(x,z)<33&&distanceToRoute(x,z)<5)continue;if(Math.hypot(x,z-24)<9||Math.hypot(x-15,z-3)<6||Math.hypot(x+18,z+10)<7||Math.hypot(x-10,z+12)<6||Math.hypot(x+2,z+23)<6||Math.abs(x-(23+Math.sin(z*.11)*2))<3.5)continue;tree(x,z,7+rnd()*6,.8+rnd()*.5);}
 tree(-23,-12,10,1.5);tree(14,-14,9,1.2);tree(-7,-26,12,1.4);
 const leafGeo=new T.ConeGeometry(.12,.9,4);const grassMaterial=mat('#5b8646');
 const grass=new T.InstancedMesh(leafGeo,grassMaterial,700);const dummy=new T.Object3D();for(let i=0;i<700;i++){const x=(rnd()-.5)*77,z=(rnd()-.5)*77;dummy.position.set(x,.2,z);dummy.rotation.set((rnd()-.5)*.3,rnd()*6,(rnd()-.5)*.6);dummy.scale.setScalar(distanceToRoute(x,z)<2?0:.5+rnd());dummy.updateMatrix();grass.setMatrixAt(i,dummy.matrix);}scene.add(grass);
 for(let i=0;i<38;i++){const x=(rnd()-.5)*70,z=(rnd()-.5)*70;if(distanceToRoute(x,z)<2.5||Math.hypot(x,z-24)<6)continue;const rock=mesh(new T.DodecahedronGeometry(.4+rnd()*.6,0),mat('#819173'),x,.25,z);rock.scale.y=.6;}
 function plant(id,x,z,scale=1){const g=createPlant(id);g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g);plants.push({id,model:g,point:new T.Vector3(x,.5,z),radius:id==='fig'?4.3:3.4});return g;}
 plant('broadleaf',3.1,19,1.2);plant('broadleaf',-7,12,1.4);plant('broadleaf',-14,5,1.4);plant('broadleaf',13,4,1.4);plant('broadleaf',14,-2,1.2);plant('fig',-18,-7,1.1);plant('fig',-15,-14,1.1);plant('fig',-5,-20,1);
 const animalDefs=[['grasshopper',4.2,16,0],['grasshopper',-8,10,0],['grasshopper',-12,4,0],['grasshopper',13,2,0],['iguana',-13,7,0],['iguana',-17,0,0],['sloth',-18,-11,1.3],['sloth',-14,-13,1.3],['frog',14,2,.55],['frog',15,-2,.5],['frog',12,0,.4],['owl',10,-12,2.0],['harpy',-1.5,-23,2.0],['agouti',-5,18,0],['agouti',-9,13,0],['paca',-19,0,0],['tapir',14,12,0],['peccary',-17,4,0],['coati',7,9,0],['toucan',-13,-8,2],['boa',13,-7,0],['ocelot',-12,-18,0],['jaguar',3,-22,0]];
 for(let i=0;i<animalDefs.length;i++){
  const [id,x,z,y]=animalDefs[i];const g=createAnimal(id);g.position.set(x,y,z);g.rotation.y=rnd()*6.28;const scale={grasshopper:.38,frog:.52,iguana:1.1,sloth:1.05,owl:.9,harpy:1.25,agouti:.8,paca:.85,tapir:1.35,peccary:1.05,coati:1,toucan:.95,boa:1.1,ocelot:1.05,jaguar:1.3}[id]||1;g.scale.setScalar(scale);g.userData.sceneModelVersion='anatomy-v3';scene.add(g);
  const a={id,model:g,home:new T.Vector3(x,y,z),point:new T.Vector3(x,y+.5,z),radius:4.3,phase:rnd()*20,index:i,moving:0};animals.push(a);
  if(['sloth','owl','harpy','toucan'].includes(id)){cylinderBetween(new T.Vector3(x-2.2,y+(id==='sloth'?1.35:0),z),new T.Vector3(x+2,y+(id==='sloth'?1.35:0),z),.15,'#8b704d');for(const side of [-1,1])mesh(new T.CylinderGeometry(.12,.18,y+1.6,7),mat('#7b6746'),x+side*2,y/2+.2,z);}
 }
 const explorer=createExplorer();explorer.position.set(0,0,24);scene.add(explorer);const player=explorer.position;let focused=null;let theta=0,pitch=.52,distance=9.3,walk=0;const target=new T.Vector3();const desired=new T.Vector3();
 const ring=mesh(new T.RingGeometry(.65,.72,32),new T.MeshBasicMaterial({color:'#fcf2b2',transparent:true,opacity:.65,side:T.DoubleSide,depthWrite:false}),0,.045,24);ring.rotation.x=-Math.PI/2;ring.castShadow=false;
 const cameraRay=new T.Raycaster();
 const glow=mesh(new T.RingGeometry(1.0,1.07,40),new T.MeshBasicMaterial({color:'#f9dc85',transparent:true,opacity:0,side:T.DoubleSide,depthWrite:false}),0,.055,0);glow.rotation.x=-Math.PI/2;glow.castShadow=false;
 const fireflyGeo=new T.BufferGeometry();const firePos=[];for(let i=0;i<65;i++)firePos.push((rnd()-.5)*65,1+rnd()*7,(rnd()-.5)*65);fireflyGeo.setAttribute('position',new T.Float32BufferAttribute(firePos,3));const motes=new T.Points(fireflyGeo,new T.PointsMaterial({color:'#ffefb6',size:.075,transparent:true,opacity:.65}));scene.add(motes);
 function update(dt,t,input,paused){
  if(!paused){
   const dx=(Math.cos(theta)*input.x-Math.sin(theta)*input.y),dz=(-Math.sin(theta)*input.x-Math.cos(theta)*input.y);const amount=Math.min(1,Math.hypot(dx,dz));walk+=dt*amount;
   const nextX=player.x+dx*dt*3.8,nextZ=player.z+dz*dt*3.8;
   function valid(x,z){if(Math.abs(x)>32||Math.abs(z)>33)return false;const riverX=23+Math.sin(z*.11)*2;if(Math.abs(x-riverX)<1.8&&Math.abs(z-4)>1.6)return false;return !solids.some(s=>Math.hypot(x-s.x,z-s.z)<s.r+.35);}
   if(valid(nextX,player.z))player.x=nextX;if(valid(player.x,nextZ))player.z=nextZ;
   if(amount>.05){focused=null;const desiredAngle=Math.atan2(dx,dz);let diff=desiredAngle-explorer.rotation.y;diff=Math.atan2(Math.sin(diff),Math.cos(diff));explorer.rotation.y+=diff*Math.min(1,dt*12);}
   animateModel(explorer,walk,amount);ring.position.set(player.x,.045,player.z);ring.material.opacity=.35+Math.sin(t*3)*.07;
   for(const p of plants)animateModel(p.model,t,0);
   for(const a of animals){const p=a.home,g=a.model,phase=t+a.phase;let moving=0;
    if(a.id==='grasshopper'||a.id==='frog'){const cycle=(phase%(a.id==='frog'?7:5));const hop=cycle<1.2;const f=hop?cycle/1.2:1;const base=Math.floor(phase/(a.id==='frog'?7:5));const prev=new T.Vector2(Math.sin(base*1.4),Math.cos(base*1.1));const next=new T.Vector2(Math.sin((base+1)*1.4),Math.cos((base+1)*1.1));const x=p.x+T.MathUtils.lerp(prev.x,next.x,f)*1.1,z=p.z+T.MathUtils.lerp(prev.y,next.y,f)*.8;g.position.set(x,p.y+(hop?Math.sin(f*Math.PI)*.6:0),z);if(hop)g.rotation.y=Math.atan2(next.x-prev.x,next.y-prev.y);moving=hop?1:0;
    }else if(['iguana','agouti','paca','tapir','peccary','coati','ocelot','jaguar'].includes(a.id)){const period=['ocelot','jaguar'].includes(a.id)?22:17;const f=(phase%period);moving=f<8?1:0;const progress=Math.floor(phase/period)*8+Math.min(f,8);const speed=['tapir','peccary'].includes(a.id)?.16:.22;g.position.x=p.x+Math.sin(progress*speed)*1.4;g.position.z=p.z+Math.cos(progress*speed)*1.1;g.rotation.y=progress*speed+Math.PI/2;
    }else if(a.id==='boa'){g.position.x=p.x+Math.sin(phase*.11)*1.2;g.position.z=p.z+Math.cos(phase*.11)*.6;g.rotation.y=phase*.11+Math.PI/2;moving=.6;
    }else if(a.id==='sloth'){g.position.x=p.x+Math.sin(phase*.12)*.6;g.rotation.y=.2;moving=.2;
    }else{const cycle=phase%23;if(cycle>16){const f=(cycle-16)/7;g.position.set(p.x+Math.sin(f*2*Math.PI)*2.3,p.y+Math.sin(f*Math.PI)*2,p.z+Math.sin(f*Math.PI)*1.8);g.rotation.y=Math.PI/2+f*2*Math.PI;moving=1;}else{g.position.copy(p);g.rotation.y=Math.sin(phase*.3)*.25+Math.PI;}}
    animateModel(g,phase,moving);a.moving=moving;a.point.copy(g.position).y+=.5;
   }
   motes.rotation.y=t*.006;
  }
  target.copy(focused?focused.point:player);if(!focused)target.y+=1.1;desired.set(target.x+Math.sin(theta)*Math.cos(pitch)*distance,target.y+Math.sin(pitch)*distance,target.z+Math.cos(theta)*Math.cos(pitch)*distance);const camDirection=desired.clone().sub(target);cameraRay.set(target,camDirection.clone().normalize());cameraRay.far=camDirection.length();const hits=cameraRay.intersectObjects(solids.map(s=>s.mesh),false);if(hits.length&&hits[0].distance>2.4)desired.copy(target).add(camDirection.normalize().multiplyScalar(Math.max(2.4,hits[0].distance-.5)));camera.position.lerp(desired,1-Math.exp(-dt*9));camera.lookAt(target);
 }
 function initialCamera(){camera.position.set(player.x+Math.sin(theta)*8,6,player.z+Math.cos(theta)*8);camera.lookAt(player.x,1,player.z);}initialCamera();
 const ray=new T.Raycaster();function visible(targetPoint){const origin=player.clone().add(new T.Vector3(0,1.1,0));const delta=targetPoint.clone().sub(origin);ray.set(origin,delta.clone().normalize());ray.far=delta.length()-.1;return !ray.intersectObjects(solids.map(s=>s.mesh),false).length;}
 function observe(previous){const all=[...plants,...animals];const options=all.map(a=>({a,d:player.distanceTo(a.point)})).filter(o=>o.d<(previous===o.a?o.a.radius+1:o.a.radius)&&visible(o.a.point)).sort((a,b)=>a.d-b.d);if(previous){const current=options.find(o=>o.a===previous);if(current&&(!options[0]||current.d<options[0].d+1))return previous;}return options[0]?.a??null;}
 function highlight(a,t){if(a){glow.position.set(a.point.x,.055,a.point.z);glow.material.opacity=.45+Math.sin(t*4)*.15;}else glow.material.opacity=0;}
 function portraits(){const result=Object.fromEntries(animalSpecies.map(s=>[s.id,`./assets/animals/${s.id}.webp`]));const ps=new T.Scene();ps.background=new T.Color('#dfe8cc');ps.add(new T.HemisphereLight('#ffffff','#809557',3));const light=new T.DirectionalLight('#fff2d1',3);light.position.set(3,7,5);ps.add(light);const cam=new T.PerspectiveCamera(38,1,.1,30);const oldSize=renderer.getSize(new T.Vector2());const oldRatio=renderer.getPixelRatio();renderer.setPixelRatio(1);renderer.setSize(256,256,false);for(const id of ['broadleaf','fig']){const g=createPlant(id);ps.add(g);const box=new T.Box3().setFromObject(g);const center=box.getCenter(new T.Vector3());const size=box.getSize(new T.Vector3());const d=Math.max(size.x,size.y,size.z)*2.1;cam.position.set(center.x+d*.6,center.y+d*.27,center.z+d*.9);cam.lookAt(center);renderer.render(ps,cam);result[id]=renderer.domElement.toDataURL('image/png');ps.remove(g);}renderer.setPixelRatio(oldRatio);renderer.setSize(oldSize.x,oldSize.y,false);return result;}
 function zone(){const x=player.x,z=player.z;return z>18?'探索營地':x<-10&&z<-3?'榕樹林':z<-18?'林冠觀察地':x>7&&z<-7?'溪流觀察台':x>7?'溪流葉�