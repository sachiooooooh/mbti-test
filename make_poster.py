#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 MBTI 测试传播海报（玻璃拟态风 + 二维码）。改 URL 后重跑即可。"""
import qrcode
from qrcode.constants import ERROR_CORRECT_M
from PIL import Image, ImageDraw, ImageFont, ImageFilter

URL = "https://sachiooooooh.github.io/mbti-test/"
OUT = "/Users/wuxi12/Desktop/mbti-test/docs/images/poster.png"
W, H = 1080, 1440

CJK = "/System/Library/Fonts/Hiragino Sans GB.ttc"
def font(size, bold=False):
    try:
        return ImageFont.truetype(CJK, size, index=1 if bold else 0)
    except Exception:
        return ImageFont.truetype(CJK, size)

# ---------- 背景渐变 ----------
def lerp(a, b, t): return tuple(int(a[i] + (b[i]-a[i])*t) for i in range(3))
C0, C1, C2 = (102,126,234), (118,75,162), (107,79,160)  # #667eea #764ba2 #6B4FA0
base = Image.new("RGBA", (W, H))
px = base.load()
for y in range(H):
    t = y / (H-1)
    c = lerp(C0, C1, t*1.8) if t < 0.55 else lerp(C1, C2, (t-0.55)/0.45)
    for x in range(W):
        px[x, y] = c + (255,)

# ---------- 柔光球 ----------
def orb(cx, cy, r, color):
    layer = Image.new("RGBA", (W, H), (0,0,0,0))
    ImageDraw.Draw(layer).ellipse([cx-r, cy-r, cx+r, cy+r], fill=color)
    return layer.filter(ImageFilter.GaussianBlur(130))
base = Image.alpha_composite(base, orb(150, 230, 300, (139,123,255,150)))
base = Image.alpha_composite(base, orb(W-130, H-260, 320, (255,158,216,120)))

# ---------- 玻璃卡 ----------
M = 70
card = [M, 150, W-M, H-150]
# 卡下方背景轻微模糊，强化玻璃感
region = base.crop(tuple(card)).filter(ImageFilter.GaussianBlur(14))
base.paste(region, (card[0], card[1]))
ov = Image.new("RGBA", (W, H), (0,0,0,0))
ImageDraw.Draw(ov).rounded_rectangle(card, radius=48, fill=(255,255,255,34), outline=(255,255,255,72), width=2)
base = Image.alpha_composite(base, ov)

d = ImageDraw.Draw(base)
cx = W // 2

# ---------- 顶部 badge（overlay 合成，半透明才正确）----------
bf = font(30)
btxt = "人格测试 · MBTI"
bw = d.textlength(btxt, font=bf)
bx0, by0, bx1, by1 = cx-bw/2-24, 230, cx+bw/2+24, 288
bov = Image.new("RGBA", (W, H), (0,0,0,0))
bd = ImageDraw.Draw(bov)
bd.rounded_rectangle([bx0, by0, bx1, by1], radius=29, fill=(255,255,255,30), outline=(255,255,255,95), width=1)
bd.text((cx, (by0+by1)//2), btxt, font=bf, fill=(255,255,255,230), anchor="mm")
base = Image.alpha_composite(base, bov)
d = ImageDraw.Draw(base)

# ---------- 标题 ----------
tf = font(86, bold=True)
d.text((cx, 358), "认识真实的", font=tf, fill=(255,255,255,255), anchor="mm")
d.text((cx, 460), "你自己", font=tf, fill=(255,216,110,255), anchor="mm")

# ---------- 副标题 ----------
mf = font(33, bold=True)
d.text((cx, 558), "48 道题  ·  5 分钟  ·  16 种人格", font=mf, fill=(255,255,255,235), anchor="mm")
sf = font(28)
d.text((cx, 606), "看清你思考、决策与生活的底层倾向", font=sf, fill=(255,255,255,180), anchor="mm")

# ---------- 二维码（白底卡） ----------
qr = qrcode.QRCode(error_correction=ERROR_CORRECT_M, box_size=10, border=0)
qr.add_data(URL); qr.make(fit=True)
qimg = qr.make_image(fill_color=(40,35,80), back_color="white").convert("RGBA")
QS = 380
qimg = qimg.resize((QS, QS), Image.NEAREST)
pad = 32
qcx, qcy = cx, 880
qcard = [qcx-QS//2-pad, qcy-QS//2-pad, qcx+QS//2+pad, qcy+QS//2+pad]
qov = Image.new("RGBA", (W, H), (0,0,0,0))
ImageDraw.Draw(qov).rounded_rectangle(qcard, radius=28, fill=(255,255,255,255))
base = Image.alpha_composite(base, qov)
base.paste(qimg, (qcx-QS//2, qcy-QS//2), qimg)

d = ImageDraw.Draw(base)
# ---------- 二维码下方引导 ----------
cf = font(34, bold=True)
d.text((cx, qcy+QS//2+pad+60), "长按识别二维码，开始免费测试", font=cf, fill=(255,255,255,245), anchor="mm")
uf = font(25)
d.text((cx, qcy+QS//2+pad+108), "sachiooooooh.github.io/mbti-test", font=uf, fill=(255,255,255,150), anchor="mm")

base.convert("RGB").save(OUT, "PNG")
print("saved:", OUT)
