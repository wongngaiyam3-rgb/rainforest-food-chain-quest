// Lightweight CPU projection fallback. Main experience uses Three.js WebGLRenderer.
// This keeps navigation and learning usable when the browser disables WebGL.
import * as T from './vendor/three.module.js';
export class SoftwareRenderer{
 constructor(){this.domElement=document.createElement('canvas');this.ctx=this.domElement.getContext('2d');this.shadowMap={};this.ratio=1;this.w=800;this.h=600;this.isSoftware=true;this.frame=0;this.list=[];this.cache=new WeakMap();}
 setPixelRatio(r){this.ratio=Math.min(r,1);}
 getPixelRatio(){return this.ratio;}
 setSize(w,h,style=true){this.w=w;this.h=h;this.domElement.width=w;this.domElement.height=h;if(style){this.domElement.style.width=w+'px';this.domElement.style.height=h+'px';}}
 getSize(v){return v.set(this.w,this.h);}
 render(scene,camera){
  const ctx=this.ctx,w=this.w,h=this.h;scene.updateMatrixWorld();camera.updateMatrixWorld();const vp=new T.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);const v=new T.Vector3(),p=new T.Vector3(),sc=new T.Vector3(),quat=new T.Quaternion();
  const project=(x,y,z,m)=>{v.set(x,y,z).applyMatrix4(m);const world=v.clone();const view=world.clone().applyMatrix4(camera.matrixWorldInverse);p.copy(v).applyMatrix4(vp);return {x:(p.x*.5+.5)*w,y:(.5-p.y*.5)*h,z:p.z,depth:-view.z,view,world};};
  const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#adcdb3');bg.addColorStop(.45,'#8fa773');bg.addColorStop(1,'#80945a');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  const draw=[];const maxDist=scene.fog?65:100;
  scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||!o.visible||!o.geometry||!o.material)return;for(let parent=o.parent;parent;parent=parent.parent)if(!parent.visible)return;const g=o.geometry,m=Array.isArray(o.material)?o.material[0]:o.material;if(m.opacity===0)return;
   const center=new T.Vector3().setFromMatrixPosition(o.matrixWorld);const distance=center.distanceTo(camera.position);if(distance>maxDist)return;const c=project(0,0,0,o.matrixWorld);if(c.depth<.15||c.depth>camera.far)return;
   o.matrixWorld.decompose(v,quat,sc);const scale=sc.clone();const param=g.parameters||{};const type=g.type;let color=m.color?'#'+m.color.getHexString():'#7c9667';const opacity=m.transparent?m.opacity:1;
   if(type==='PlaneGeometry'&&param.width>50)return;
   if(type==='RingGeometry'){
    const pts=[];for(let i=0;i<=24;i++){const a=i/24*Math.PI*2;pts.push(project(Math.cos(a)*param.outerRadius,Math.sin(a)*param.outerRadius,0,o.matrixWorld));}if(pts.some(p=>p.depth<.2))return;draw.push({z:c.depth,fn:()=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=color;ctx.globalAlpha=opacity;ctx.lineWidth=2;ctx.stroke();}});return;
   }
   if(type==='TubeGeometry'){
    const pts=param.path.getPoints(7).map(p=>project(p.x,p.y,p.z,o.matrixWorld));if(pts.some(p=>p.depth<.2))return;const a=project(param.radius||.03,0,0,o.matrixWorld);const width=Math.max(.7,Math.hypot(a.x-c.x,a.y-c.y)*2);draw.push({z:c.depth,fn:()=>{ctx.beginPath();pts.filter(p=>p.z<1&&p.z>-1).forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.lineWidth=width;ctx.lineCap='round';ctx.strokeStyle=color;ctx.stroke();}});return;
   }
   if(type==='SphereGeometry'||type==='IcosahedronGeometry'||type==='DodecahedronGeometry'){
    const radius=param.radius||1;const worldRadius=radius*Math.max(Math.abs(scale.x),Math.abs(scale.y),Math.abs(scale.z));if(c.depth<worldRadius+.2)return;const ax=project(radius,0,0,o.matrixWorld),ay=project(0,radius,0,o.matrixWorld),az=project(0,0,radius,o.matrixWorld);const basis=[ax,ay,az].map(q=>[q.x-c.x,q.y-c.y]);let xx=0,yy=0,xy=0;for(const a of basis){xx+=a[0]*a[0];yy+=a[1]*a[1];xy+=a[0]*a[1];}const theta=.5*Math.atan2(2*xy,xx-yy),disc=Math.sqrt((xx-yy)**2+4*xy**2),rx=Math.sqrt(Math.max(0,(xx+yy+disc)/2)),ry=Math.sqrt(Math.max(0,(xx+yy-disc)/2));if(!Number.isFinite(rx+ry)||rx>w*2||ry>h*2||rx<.4||ry<.3||c.x+rx<0||c.x-rx>w||c.y+rx<0||c.y-rx>h)return;draw.push({z:c.depth,fn:()=>{ctx.save();ctx.translate(c.x,c.y);ctx.rotate(theta);ctx.beginPath();if(type==='SphereGeometry')ctx.ellipse(0,0,Math.min(rx,5000),Math.min(ry,5000),0,0,Math.PI*2);else{for(let i=0;i<9;i++){const a=i/9*Math.PI*2;i?ctx.lineTo(Math.cos(a)*rx,Math.sin(a)*ry):ctx.moveTo(Math.cos(a)*rx,Math.sin(a)*ry);}ctx.closePath();}ctx.fillStyle=color;ctx.fill();if(m.map?.image&&m.map.image.complete&&m.map.image.naturalWidth){ctx.save();ctx.clip();ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.7;ctx.drawImage(m.map.image,-rx,-ry,rx*2,ry*2);ctx.restore();}const gradient=ctx.createLinearGradient(-rx,-ry,rx,ry);gradient.addColorStop(0,'#fff7bd22');gradient.addColorStop(.5,'#ffffff00');gradient.addColorStop(1,'#17392733');ctx.fillStyle=gradient;ctx.fill();ctx.restore();}});return;
   }
   if(type==='CylinderGeometry'||type==='ConeGeometry'){
    const hh=param.height/2,rt=param.radiusTop??0,rb=param.radiusBottom??param.radius??1;const a=project(0,hh,0,o.matrixWorld),b=project(0,-hh,0,o.matrixWorld),aa=project(rt,hh,0,o.matrixWorld),bb=project(rb,-hh,0,o.matrixWorld);if([a,b,aa,bb].some(p=>p.depth<.2))return;const ra=Math.max(.5,Math.hypot(aa.x-a.x,aa.y-a.y)),rr=Math.max(.5,Math.hypot(bb.x-b.x,bb.y-b.y));if(ra>w||rr>w)return;const angle=Math.atan2(b.y-a.y,b.x-a.x)+Math.PI/2;const nx=Math.cos(angle),ny=Math.sin(angle);draw.push({z:c.depth,fn:()=>{ctx.beginPath();ctx.moveTo(a.x+nx*ra,a.y+ny*ra);ctx.lineTo(a.x-nx*ra,a.y-ny*ra);ctx.lineTo(b.x-nx*rr,b.y-ny*rr);ctx.lineTo(b.x+nx*rr,b.y+ny*rr);ctx.closePath();ctx.fillStyle=color;ctx.fill();}});return;
   }
   const pos=g.attributes.position,index=g.index;if(!pos)return;const count=index?index.count:pos.count;for(let i=0;i<count;i+=3){const verts=[];for(let k=0;k<3;k++){const j=index?index.getX(i+k):i+k;verts.push(project(pos.getX(j),pos.getY(j),pos.getZ(j),o.matrixWorld));}if(verts.some(p=>p.depth<.2||p.depth>camera.far))continue;if(verts.every(p=>p.x<0)||verts.every(p=>p.x>w)||verts.every(p=>p.y<0)||verts.every(p=>p.y>h))continue;const z=verts.reduce((a,p)=>a+p.depth,0)/3;draw.push({z,fn:()=>{ctx.beginPath();verts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=color;ctx.fill();}});}
  });
  draw.sort((a,b)=>b.z-a.z);for(const d of draw){ctx.globalAlpha=1;d.fn();}ctx.globalAlpha=1;
 }
}
