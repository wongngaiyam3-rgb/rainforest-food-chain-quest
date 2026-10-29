import * as T from '../vendor/three.module.v3.js';
import {GLTFLoader} from '../vendor/GLTFLoader.js';
import {species,biome,mapId} from './data.js?v=savanna-hyena-v1';
import {SoftwareRenderer} from './software-renderer.js';
export function createWorld(container,quality='high'){
 let renderer;try{renderer=new T.WebGLRenderer({antialias:true});}catch{renderer=new SoftwareRenderer();}
 renderer.setPixelRatio(Math.min(devicePixelRatio,quality==='low'?1:1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=quality!=='low';renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;container.append(renderer.domElement);
 const scene=new T.Scene();scene.background=new T.Color(mapId==='ocean'?'#65bac8':mapId==='desert'?'#e9d5b1':'#c8d6b8');scene.fog=new T.FogExp2(mapId==='ocean'?'#65bac8':mapId==='desert'?'#e9d5b1':'#c8d6b8',.012);
 scene.add(new T.HemisphereLight('#e6ffff','#637d6d',2.8));const sun=new T.DirectionalLight('#f5ffeb',3);sun.position.set(-15,32,20);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-40,right:40,top:40,bottom:-40});sun.shadow.normalBias=.1;scene.add(sun);
 scene.userData.palette=mapId==='desert'?['#e6c99d','#d2af78','#c7a370']:mapId==='savanna'?['#bad3c3','#b1b783','#aca568']:['#5ab2c3','#84c8c6','#d2d9bd'];
 const camera=new T.PerspectiveCamera(48,innerWidth/innerHeight,.1,160),plants=[],animals=[];
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.83});
 function mesh(g,m,x,y,z,parent=scene){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 const ground=mesh(new T.PlaneGeometry(95,95),mat(biome.ground),0,-.06,0);ground.rotation.x=-Math.PI/2;
 const route=[[0,24],[3,19],[-5,13],[-10,8],[-17,1],[-16,-10],[-11,-20],[0,-28],[9,-20],[10,-8],[15,-1],[15,9],[8,16],[0,24]];
 const curve=new T.CatmullRomCurve3(route.map(([x,z])=>new T.Vector3(x,.02,z))),points=curve.getPoints(110);
 for(let i=0;i<points.length;i+=2){const q=points[i];const d=mesh(new T.CircleGeometry(.12,8),mat('#faf3cb'),q.x,.025,q.z);d.rotation.x=-Math.PI/2;}
 let seed=730;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<45;i++){const x=(rnd()-.5)*80,z=(rnd()-.5)*80;if(Math.abs(x)<25&&Math.abs(z)<31)continue;const r=.5+rnd()*2;const o=mesh(new T.DodecahedronGeometry(r,0),mat(['#83a9a0','#b8c9b2','#689e9f'][i%3]),x,r*.35,z);o.scale.y=.55;}
 if(mapId==='desert'){
 for(let i=0;i<18;i++){const a=i/18*Math.PI*2,x=Math.sin(a)*40,z=Math.cos(a)*40;const dune=mesh(new T.SphereGeometry(4+rnd()*4,20,8),mat(i%2?'#d9b77b':'#cfa86a'),x,-.3,z);dune.scale.set(1,.3,1.5);}
 const pool=mesh(new T.CircleGeometry(4,30),mat('#6ca7a2'),22,.012,20);pool.rotation.x=-Math.PI/2;
}else if(mapId==='savanna'){
 const blades=new T.InstancedMesh(new T.ConeGeometry(.075,.6,3),mat('#8b9450'),600),dummy=new T.Object3D();
 for(let i=0;i<600;i++){dummy.position.set((rnd()-.5)*75,.2,(rnd()-.5)*75);dummy.rotation.y=rnd()*6;dummy.scale.setScalar(.4+rnd());dummy.updateMatrix();blades.setMatrixAt(i,dummy.matrix);}scene.add(blades);
 for(let i=0;i<10;i++){const a=i/10*Math.PI*2,x=Math.sin(a)*38,z=Math.cos(a)*38;mesh(new T.CylinderGeometry(.15,.4,5,7),mat('#776348'),x,2.5,z);const crown=mesh(new T.SphereGeometry(3.8,10,6),mat('#657b43'),x,5,z);crown.scale.y=.3;}
}
 // Floating expedition marker: a simple yellow underwater observation rover.
 const explorer=new T.Group();scene.add(explorer);const body=mesh(new T.SphereGeometry(.38,16,10),mat('#f3c764'),0,.72,0,explorer);body.scale.set(1,.8,1.5);mesh(new T.SphereGeometry(.19,12,8),mat('#155b75'),0,.8,-.38,explorer);for(const x of [-.43,.43]){const fin=mesh(new T.BoxGeometry(.38,.08,.55),mat('#e9a83d'),x,.62,.13,explorer);}if(mapId!=='ocean'){body.material.color.set('#d9a54c');const head=mesh(new T.SphereGeometry(.22,12,8),mat('#e7ba8a'),0,1.2,0,explorer);mesh(new T.CylinderGeometry(.34,.34,.06,16),mat('#b99859'),0,1.4,0,explorer);for(const x of [-.16,.16])mesh(new T.BoxGeometry(.17,.43,.18),mat('#536953'),x,.28,0,explorer);}
 const player=explorer.position;player.set(0,0,24);
 const ring=mesh(new T.RingGeometry(.65,.7,32),new T.MeshBasicMaterial({color:'#fff4b7',side:T.DoubleSide}),0,.035,24);ring.rotation.x=-Math.PI/2;
 const glow=mesh(new T.RingGeometry(1.1,1.18,32),new T.MeshBasicMaterial({color:'#fff0a0',side:T.DoubleSide,transparent:true,opacity:0}),0,.04,0);glow.rotation.x=-Math.PI/2;
 let focused=null,theta=0,pitch=.52,distance=10,lastRender=0;const target=new T.Vector3(),desired=new T.Vector3(),ray=new T.Raycaster();
 const loader=new GLTFLoader();let count=0;
 async function load(s){const gltf=await loader.loadAsync(`./assets/${mapId}/${s.id}.glb`);const model=gltf.scene;
 model.traverse(o=>{if(!o.isMesh)return;o.castShadow=o.receiveShadow=true;o.userData.tripoModel=true;for(const m of(Array.isArray(o.material)?o.material:[o.material])){m.userData.skinKey=s.id;m.roughness=Math.max(.65,m.roughness||0);}});
 model.updateMatrixWorld(true);let box=new T.Box3().setFromObject(model),size=box.getSize(new T.Vector3());if(s.kind==='consumer'&&size.x>size.z*1.2)model.rotation.y=-Math.PI/2;model.updateMatrixWorld(true);box=new T.Box3().setFromObject(model);size=box.getSize(new T.Vector3());const center=box.getCenter(new T.Vector3()),scale=s.size/Math.max(size.x,size.y,size.z);model.scale.setScalar(scale);model.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);
 const root=new T.Group();root.add(model);const bottom=['urchin','shrimp','crab','octopus'].includes(s.id)||s.kind==='producer';const y=mapId==='ocean'&&!bottom?1.1:0;root.position.set(s.x,y,s.z);scene.add(root);const a={id:s.id,model:root,home:new T.Vector3(s.x,y,s.z),point:new T.Vector3(s.x,y+.4,s.z),radius:3.6,index:species.indexOf(s),bottom};(s.kind==='producer'?plants:animals).push(a);
 count++;document.querySelector('#loading small').textContent=`已準備 ${count} / ${species.length} 種${biome.name}生物`;return a;
 }
 // Three concurrent loads keep memory and network use bounded on tablets.
 const queue=[...species];const ready=Promise.all(Array.from({length:3},async()=>{while(queue.length)await load(queue.shift());}));
 function initialCamera(){camera.position.set(player.x+Math.sin(theta)*9,6,player.z+Math.cos(theta)*9);camera.lookAt(player.x,1,player.z);}initialCamera();
 function update(dt,t,input,paused){if(!paused){const dx=Math.cos(theta)*input.x-Math.sin(theta)*input.y,dz=-Math.sin(theta)*input.x-Math.cos(theta)*input.y;player.x=T.MathUtils.clamp(player.x+dx*dt*4.5,-31,31);player.z=T.MathUtils.clamp(player.z+dz*dt*4.5,-32,32);if(Math.hypot(dx,dz)>.05){focused=null;explorer.rotation.y=Math.atan2(-dx,-dz);}body.position.y=.72+Math.sin(t*1.6)*.07;ring.position.set(player.x,.035,player.z);
 for(const a of animals){const phase=t*(a.bottom?.12:.23)+a.index;const r=a.bottom?.45:1.4;a.model.position.set(a.home.x+Math.sin(phase)*r,a.home.y+(mapId==='ocean'&&!a.bottom?Math.sin(phase*1.7)*.15:0),a.home.z+Math.cos(phase)*r*.65);a.model.rotation.y=phase+Math.PI/2;a.point.copy(a.model.position).y+=.4;}
 }
 target.copy(focused?focused.point:player);if(!focused)target.y+=1;desired.set(target.x+Math.sin(theta)*Math.cos(pitch)*distance,target.y+Math.sin(pitch)*distance,target.z+Math.cos(theta)*Math.cos(pitch)*distance);camera.position.lerp(desired,1-Math.exp(-Math.max(dt,.016)*9));camera.lookAt(target);
 }
 function observe(previous){const options=[...plants,...animals].map(a=>({a,d:Math.hypot(player.x-a.point.x,player.z-a.point.z)})).filter(o=>o.d<(o.a===previous?4.3:3.6)).sort((a,b)=>a.d-b.d);const keep=options.find(o=>o.a===previous);return keep&&keep.d<options[0].d+.6?previous:options[0]?.a??null;}
 function highlight(a,t){glow.visible=!!a;if(a){glow.position.set(a.point.x,.04,a.point.z);glow.material.opacity=.6+Math.sin(t*3)*.15;}}
 function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}
 function pickGround(x,y){camera.updateMatrixWorld();ray.setFromCamera(new T.Vector2(x/innerWidth*2-1,1-y/innerHeight*2),camera);const out=new T.Vector3();return ray.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),0),out)?out:null;}
 return {ready,route,scene,camera,renderer,player,plants,animals,update,observe,highlight,resize,pickGround,
 portraits:()=>Object.fromEntries(species.map(s=>[s.id,`./assets/${mapId}/${s.id}.webp`])),
 inputToward(x,z){const dx=x-player.x,dz=z-player.z,len=Math.hypot(dx,dz)||1;return{x:(Math.cos(theta)*dx-Math.sin(theta)*dz)/len,y:(-Math.sin(theta)*dx-Math.cos(theta)*dz)/len};},
 zone:()=>player.z>18?'探索營地':player.z< -15?'獵手觀察區':mapId==='desert'?(player.x<0?'沙地植物區':'綠洲邊緣'):mapId==='savanna'?(player.x<0?'草食動物區':'草原小徑'):(player.x<0?'海草與沙地':'淺海觀察區'),
 render(){const now=performance.now();if(renderer.isSoftware&&now-lastRender<220)return;lastRender=now;for(const a of [...plants,...animals])a.model.visible=!renderer.isSoftware||a===focused||Math.hypot(a.point.x-player.x,a.point.z-player.z)<11;renderer.render(scene,camera);},
 focusAnimal(a){focused=a;distance=a?Math.max(3,new T.Box3().setFromObject(a.model).getSize(new T.Vector3()).length()*1.3/Math.min(1,camera.aspect)):10;pitch=.3;},
 rotate(dx,dy){theta-=dx*.006;pitch=T.MathUtils.clamp(pitch+dy*.004,.22,.94);},zoom(d){distance=T.MathUtils.clamp(distance+d,focused?2:5,18);},center(){theta=0;pitch=.52;distance=10;},home(){focused=null;player.set(0,0,24);theta=0;pitch=.52;distance=10;initialCamera();},setQuality(q){renderer.setPixelRatio(Math.min(devicePixelRatio,q==='low'?1:1.5));renderer.shadowMap.enabled=q!=='low';resize();}
 };
}
