"""Pack authorized Tripo GLBs with embedded web-sized PBR textures."""
from pathlib import Path
from urllib.request import urlretrieve
from PIL import Image
import io,json,struct,sys
root=Path(__file__).resolve().parents[1]
manifest=json.loads(Path(sys.argv[1]).read_text())
out=root/'docs/assets/models'
for item in manifest:
    key=item['id'];source=root/f'assets-source/{key}-tripo-original.glb'
    if not source.exists():urlretrieve(item['result_url'],source)
    b=source.read_bytes();assert b[:4]==b'glTF'
    n=struct.unpack_from('<I',b,12)[0];g=json.loads(b[20:20+n]);raw=b[28+n:]
    chunks=[];offset=0
    for k,view in enumerate(g['bufferViews']):
        start=view.get('byteOffset',0);data=raw[start:start+view['byteLength']]
        image=next((im for im in g.get('images',[]) if im.get('bufferView')==k),None)
        if image:
            im=Image.open(io.BytesIO(data));name=image.get('name','')
            edge=1536 if 'Color_' in name else 768 if image['mimeType']=='image/png' else 512
            im.thumbnail((edge,edge),Image.Resampling.LANCZOS);buf=io.BytesIO()
            fmt='PNG' if image['mimeType']=='image/png' else 'JPEG'
            im.save(buf,fmt,**({'compress_level':8} if fmt=='PNG' else {'quality':91}))
            data=buf.getvalue()
        view['byteOffset']=offset;view['byteLength']=len(data)
        chunks.append(data+b'\0'*((-len(data))%4));offset+=len(chunks[-1])
    g['buffers'][0]['byteLength']=offset
    j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);binary=b''.join(chunks)
    packed=struct.pack('<III',0x46546c67,2,28+len(j)+len(binary))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(binary),0x004e4942)+binary
    dest=out/f'{key}-tripo-h31.glb';dest.write_bytes(packed)
    print(key,len(b),'->',len(packed),'bytes',flush=True)
