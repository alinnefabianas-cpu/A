import sys, subprocess, numpy as np, glob
from PIL import Image, ImageDraw, ImageFont
# usage: sheet.py clipfile start end n cols out
f,s,e,n,cols,out=sys.argv[1],float(sys.argv[2]),float(sys.argv[3]),int(sys.argv[4]),int(sys.argv[5]),sys.argv[6]
ts=np.linspace(s,e,n); ims=[]
for t in ts:
    raw=subprocess.run(["ffmpeg","-v","error","-ss",f"{t:.2f}","-i",f,"-frames:v","1","-vf","scale=400:400:force_original_aspect_ratio=decrease","-f","image2pipe","-vcodec","png","-"],capture_output=True).stdout
    import io; im=Image.open(io.BytesIO(raw)).convert("RGB")
    d=ImageDraw.Draw(im); d.rectangle([0,0,70,22],fill=(0,0,0)); d.text((3,3),f"{t:.1f}",fill=(255,255,0),font=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",16))
    ims.append(im)
w=max(i.width for i in ims); h=max(i.height for i in ims); rows=(len(ims)+cols-1)//cols
S=Image.new("RGB",(w*cols,h*rows))
for k,im in enumerate(ims): S.paste(im,((k%cols)*w,(k//cols)*h))
S.save(out,quality=85)
