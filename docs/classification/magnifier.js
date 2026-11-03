/** Magnifies the displayed, object-fit:contain image, including its letterboxing. */
export function imageRect(nw,nh,w,h){const scale=Math.min(w/nw,h/nh);return {width:nw*scale,height:nh*scale,x:(w-nw*scale)/2,y:(h-nh*scale)/2};}
export function mountMagnifier(image){
 const frame=document.createElement('div');frame.className='magnifier-frame';frame.tabIndex=0;frame.setAttribute('role','region');frame.setAttribute('aria-label','圖片放大鏡；可用方向鍵移動，Escape 隱藏放大鏡');
 image.before(frame);frame.append(image);image.draggable=false;
 const lens=document.createElement('canvas');lens.className='magnifier-lens';lens.setAttribute('aria-hidden','true');lens.hidden=true;frame.append(lens);
 const controls=document.createElement('div');controls.className='magnifier-controls';
 const toggle=document.createElement('button');toggle.type='button';toggle.textContent='🔍 放大鏡：已開啟';toggle.setAttribute('aria-pressed','true');
 const label=document.createElement('label');label.textContent='放大倍率 ';const select=document.createElement('select');select.setAttribute('aria-label','圖片放大倍率');
 for(const z of [2,3,4]){const option=document.createElement('option');option.value=String(z);option.textContent=z+' 倍';option.selected=z===3;select.append(option);}label.append(select);controls.append(toggle,label);frame.after(controls);
 const tip=document.createElement('p');tip.className='magnifier-tip';tip.textContent='滑鼠移到圖片上，或按住圖片拖曳。鍵盤可用方向鍵移動；放大細節取決於原圖解像度。';controls.after(tip);
 let enabled=true,x=.5,y=.5,activePointer=null;
 function hide(){lens.hidden=true;}
 function draw(){
  if(!enabled||!image.complete||!image.naturalWidth)return hide();
  const rect=image.getBoundingClientRect(),w=rect.width,h=rect.height;if(!w||!h)return;
  const size=Math.min(170,w*.6,h*.8),radius=size/2,dpr=Math.min(window.devicePixelRatio||1,2),z=Number(select.value),px=x*w,py=y*h;
  lens.style.width=lens.style.height=size+'px';lens.style.left=Math.max(0,Math.min(w-size,px-radius))+'px';lens.style.top=Math.max(0,Math.min(h-size,py-radius))+'px';
  lens.width=Math.round(size*dpr);lens.height=Math.round(size*dpr);const ctx=lens.getContext('2d');if(!ctx)return;
  ctx.scale(dpr,dpr);ctx.fillStyle='#e8edda';ctx.fillRect(0,0,size,size);
  const r=imageRect(image.naturalWidth,image.naturalHeight,w,h);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(image,radius+(r.x-px)*z,radius+(r.y-py)*z,r.width*z,r.height*z);
  ctx.strokeStyle='#173e3380';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(radius-8,radius);ctx.lineTo(radius+8,radius);ctx.moveTo(radius,radius-8);ctx.lineTo(radius,radius+8);ctx.stroke();lens.hidden=false;
 }
 function point(e){const r=image.getBoundingClientRect();x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));draw();}
 frame.addEventListener('pointerdown',e=>{if(!enabled||e.button!==0)return;activePointer=e.pointerId;frame.setPointerCapture(e.pointerId);point(e);});
 frame.addEventListener('pointermove',e=>{if(enabled&&(e.pointerType==='mouse'||activePointer===e.pointerId))point(e);});
 frame.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')point(e);});
 frame.addEventListener('pointerleave',()=>{if(activePointer===null)hide();});
 const release=e=>{activePointer=null;if(frame.hasPointerCapture(e.pointerId))frame.releasePointerCapture(e.pointerId);if(e.pointerType!=='mouse')hide();};
 frame.addEventListener('pointerup',release);frame.addEventListener('pointercancel',release);frame.addEventListener('lostpointercapture',()=>{activePointer=null;hide();});
 frame.addEventListener('keydown',e=>{const moves={ArrowLeft:[-.04,0],ArrowRight:[.04,0],ArrowUp:[0,-.04],ArrowDown:[0,.04]};if(e.key==='Escape'){if(!lens.hidden){e.preventDefault();e.stopPropagation();hide();}return;}if(!enabled||!moves[e.key])return;e.preventDefault();x=Math.max(0,Math.min(1,x+moves[e.key][0]));y=Math.max(0,Math.min(1,y+moves[e.key][1]));draw();});
 frame.addEventListener('focus',draw);frame.addEventListener('blur',hide);select.addEventListener('change',draw);
 toggle.onclick=()=>{enabled=!enabled;toggle.setAttribute('aria-pressed',String(enabled));toggle.textContent=enabled?'🔍 放大鏡：已開啟':'🔍 開啟放大鏡';frame.classList.toggle('magnifier-off',!enabled);if(enabled){frame.focus();draw();}else hide();};
 image.addEventListener('error',()=>{hide();toggle.disabled=true;tip.textContent='圖片暫時未能載入，請稍後重新開啟觀察卡。';});
 image.addEventListener('load',()=>{if(!lens.hidden)draw();});
 const resize=new ResizeObserver(()=>{if(!lens.hidden)draw();});resize.observe(image);
 return ()=>{resize.disconnect();hide();};
}
