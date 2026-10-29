"""Build a small, magnified microalgae teaching model and matching card.

Stylized spherical cells and a diatom chain, not a species identification model.
All geometry, texture and illustration are authored here; no external assets.
"""
import io
import json
import math
import struct
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/maps/assets/ocean'
OUT.mkdir(parents=True, exist_ok=True)
positions, normals, uvs, indices = [], [], [], []
cells = [(-.68,.6,.08,.28,1),(-.25,1.02,-.13,.24,1),(.3,1.35,.02,.32,1),
         (.79,.72,.12,.23,1),(.18,.28,.3,.28,1),(-.73,1.48,.16,.19,1),
         (.72,1.83,-.15,.18,1)]
# A chain of short golden cylinders (diatoms), shown as flattened ellipsoids.
cells += [(x,.96+i*.04,-.48,.19,.44) for i,x in enumerate([-.65,-.32,.01,.34,.67])]
for cx,cy,cz,r,flatten in cells:
    base = len(positions)//3
    for j in range(9):
        v=j/8; phi=v*math.pi
        for i in range(17):
            u=i/16; theta=u*2*math.pi
            nx,ny,nz=math.sin(phi)*math.cos(theta),math.cos(phi),math.sin(phi)*math.sin(theta)
            positions.extend([cx+r*nx,cy+r*ny*flatten,cz+r*nz])
            normal=[nx,ny/flatten,nz]; length=math.sqrt(sum(x*x for x in normal))
            normals.extend(x/length for x in normal)
            uvs.extend([u*.45+(0 if flatten==1 else .55),v])
    for j in range(8):
        for i in range(16):
            a=base+j*17+i; b=a+17
            indices.extend([a,b,a+1,a+1,b,b+1])

texture=Image.new('RGB',(128,64)); px=texture.load()
for y in range(64):
    for x in range(128):
        t=.7+.2*math.sin(x*.45)*math.sin(y*.5)
        base=(105,166,52) if x<64 else (193,158,59)
        px[x,y]=tuple(int(c*t) for c in base)
buf=io.BytesIO();texture.save(buf,format='PNG')
binary=bytearray(); views=[]; accessors=[]
def add_blob(data,target=None):
    while len(binary)%4:binary.append(0)
    view={'buffer':0,'byteOffset':len(binary),'byteLength':len(data)}
    if target:view['target']=target
    views.append(view);binary.extend(data)
    return len(views)-1
def attribute(data,width,kind):
    view=add_blob(struct.pack('<'+'f'*len(data),*data),34962)
    a={'bufferView':view,'componentType':5126,'count':len(data)//width,'type':kind}
    if kind=='VEC3':
        a['min']=[min(data[i::width]) for i in range(width)]
        a['max']=[max(data[i::width]) for i in range(width)]
    accessors.append(a);return len(accessors)-1
pos=attribute(positions,3,'VEC3');normal=attribute(normals,3,'VEC3');uv=attribute(uvs,2,'VEC2')
view=add_blob(struct.pack('<'+'H'*len(indices),*indices),34963)
accessors.append({'bufferView':view,'componentType':5123,'count':len(indices),'type':'SCALAR'})
image_view=add_blob(buf.getvalue())
gltf={'asset':{'version':'2.0','generator':'Authored magnified microalgae teaching model'},
      'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'mesh':0,'name':'Magnified phytoplankton'}],
      'meshes':[{'primitives':[{'attributes':{'POSITION':pos,'NORMAL':normal,'TEXCOORD_0':uv},'indices':3,'material':0}]}],
      'materials':[{'pbrMetallicRoughness':{'baseColorTexture':{'index':0},'metallicFactor':0,'roughnessFactor':.65},'doubleSided':True}],
      'textures':[{'source':0}],'images':[{'bufferView':image_view,'mimeType':'image/png'}],
      'bufferViews':views,'accessors':accessors,'buffers':[{'byteLength':len(binary)}]}
raw=json.dumps(gltf,separators=(',',':')).encode();raw+=b' '*((-len(raw))%4)
binary.extend(b'\0'*((-len(binary))%4))
glb=struct.pack('<4sII',b'glTF',2,28+len(raw)+len(binary))+struct.pack('<I4s',len(raw),b'JSON')+raw+struct.pack('<I4s',len(binary),b'BIN\0')+binary
(OUT/'phytoplankton.glb').write_bytes(glb)

# Draw the same microalgae arrangement as a crisp, transparent diagram card.
im=Image.new('RGBA',(640,640));d=ImageDraw.Draw(im)
for cx,cy,cz,r,f in sorted(cells,key=lambda c:c[2]):
    x=320+cx*220;y=540-cy*220;rx=r*220;ry=rx*f
    gold=f!=1;fill='#c9a858' if gold else '#87b35b';outline='#937237' if gold else '#467a4c'
    d.ellipse((x-rx,y-ry,x+rx,y+ry),fill=fill,outline=outline,width=5)
    if gold:
        for a in [-.55,-.2,.2,.55]:
            xx=x+a*rx;d.line((xx,y-ry*.6,xx,y+ry*.6),fill='#f5df9e',width=3)
    else:
        d.ellipse((x-rx*.55,y-ry*.62,x-rx*.04,y-ry*.18),fill='#c3d78e')
        d.ellipse((x+rx*.1,y+ry*.05,x+rx*.53,y+ry*.46),fill='#618d45')
im.save(OUT/'phytoplankton.webp',format='WEBP',quality=94)
print(f'phytoplankton: {len(glb)} bytes, {len(indices)//3} triangles')
