"""Package the three authorized Higgsfield 3x2 material atlases for the game.
No invented coat patterns: albedo is cropped from the generated texture sheets.
High-pass luminance removes pigment from the subtle fine-relief channel.
"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageChops

root=Path(__file__).resolve().parents[1]
groups=[['jaguar','ocelot','paca','coati','sloth','belly-fur'],
        ['agouti','peccary','tapir','owl','harpy','breast-feathers'],
        ['iguana','boa','frog','grasshopper','toucan','yellow-feathers']]
out=root/'docs/assets/skins-v4'
out.mkdir(parents=True,exist_ok=True)
for n,ids in enumerate(groups,1):
    im=Image.open(root/f'assets-source/material-atlas-{n}.png').convert('RGB')
    w,h=im.size
    for i,key in enumerate(ids):
        col,row=i%3,i//3
        tile=im.crop((round(col*w/3)+4,round(row*h/2)+4,round((col+1)*w/3)-4,round((row+1)*h/2)-4)).resize((640,640),Image.Resampling.LANCZOS)
        tile.save(out/f'{key}.webp',quality=91,method=6)
        gray=tile.convert('L').resize((320,320),Image.Resampling.LANCZOS)
        detail=ImageChops.subtract(gray,gray.filter(ImageFilter.GaussianBlur(2.5)),scale=1,offset=128)
        # Keep relief modest: black coat spots must never become deep pits.
        detail=detail.point(lambda v:round(128+(v-128)*.42))
        detail.save(out/f'{key}-height.webp',quality=87,method=6)
        print(key,(out/f'{key}.webp').stat().st_size)
