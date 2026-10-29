"""Deterministic render of the Animals, Herding, and Mobility locator map (revision 2).

Follows the Akkad locator standard: Natural Earth hypsometric shaded relief
(HYP_50M_SR_W, the same raster the Akkad and Hammurabi maps use), recoloured with the
Akkad palette formula (source blue-red chroma -> water; source luminance -> relief),
terracotta site markers with cream halos, cream-haloed serif labels, and an inset.

Usage: python3 render_herding_map.py <HYP_50M_SR_W.tif> <NE2_50M_SR_W.tif> <out.png>
The NE2 raster (same 10800x5400 grid) supplies the water mask, because the hypsometric
tints colour humid forests blue-green and would otherwise read as water.
Zones are broad and approximate glows, not borders. Site markers are larger than sites.
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

Image.MAX_IMAGE_PIXELS = None
SERIF = "/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf"
SERIF_ITALIC = "/usr/share/fonts/truetype/google-fonts/Lora-Italic-Variable.ttf"
INK, HALO, MARK, LEADER = (23, 62, 75), (255, 244, 215), (165, 63, 39), (141, 61, 43)

MAIN = dict(west=-22.0, east=82.0, south=-20.0, north=56.0, ppd=16)   # 1664 x 1216
INSET_SRC = dict(west=-84.0, east=-32.0, south=-42.0, north=12.7)
INSET_BOX = (34, 790, 414, 1190)                                       # x0, y0, x1, y1

# name, lon, lat, label anchor offset (dx, dy), text anchor
SITES = [
    ("Ganj Dareh", 47.50, 34.32, (-28, -58), "rd"),
    ("Takarkori", 10.33, 24.88, (0, 36), "mt"),
    ("Lothagam North", 36.0, 2.9, (34, 0), "lm"),
    ("Mustatil near AlUla", 38.2, 26.6, (30, 6), "lm"),
]
# zone glows: lon, lat, rx_deg, ry_deg, angle
ZONES = [(41.5, 35.8, 7.0, 3.6, -12), (69.0, 28.0, 3.4, 4.4, 0), (12.0, 22.0, 15.0, 6.0, 0), (47.0, 50.5, 13.0, 3.6, 0)]
REGION_LABELS = [  # text, lon, lat, size, italic
    ("Fertile Crescent", 35.0, 30.4, 54, False),
    ("Indus Valley", 70.0, 34.0, 52, False),
    ("Sahara", 8.0, 31.2, 60, False),
    ("Western steppe", 47.0, 50.4, 56, False),
]
WATER_LABELS = [("Mediterranean Sea", 17.0, 36.4, 46), ("Indian Ocean", 68.0, -6.0, 52)]
LAND_LABELS = [("AFRICA", 22.0, 7.0, 52), ("EUROPE", 10.0, 50.5, 50), ("ASIA", 72.0, 49.5, 52), ("ARABIA", 46.0, 19.0, 40)]


def colorize(rgb, mask_rgb):
    a = rgb.astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    light = r * 0.3 + g * 0.59 + b * 0.11
    mr, mg, mb = [mask_rgb[..., k].astype(float) for k in range(3)]
    water = np.clip((mb - mr - 14) / 20, 0, 1) * (mb > mg - 6)
    ys, xs = np.mgrid[0:a.shape[0], 0:a.shape[1]].astype(np.int64)
    grain = ((((xs * 374761393 + ys * 668265263) ^ (xs * 1274126177)) & 0xFFFFFFFF) % 11 - 5) * 0.36
    shade = (light - 178) * 0.63
    land = np.stack([217 + shade + grain, 180 + shade * 0.86 + grain, 119 + shade * 0.72 + grain], -1)
    sea_shade = (light - 214) * 0.45
    sea = np.stack([89 + sea_shade + grain, 151 + sea_shade + grain, 177 + sea_shade + grain], -1)
    out = land * (1 - water[..., None]) + sea * water[..., None]
    return np.clip(np.round(out), 0, 255).astype(np.uint8), water


def crop(src, w, e, s, n, width, height):
    sw, sh = src.size
    box = ((w + 180) / 360 * sw, (90 - n) / 180 * sh, (e + 180) / 360 * sw, (90 - s) / 180 * sh)
    return src.resize((width, height), Image.LANCZOS, box=box)


def text(draw, xy, label, size, italic=False, anchor="mm"):
    font = ImageFont.truetype(SERIF_ITALIC if italic else SERIF, size)
    try:
        font.set_variation_by_name("SemiBold" if not italic else "Medium Italic")
    except Exception:
        pass
    draw.text(xy, label, font=font, fill=INK, anchor=anchor, stroke_width=max(4, size // 9), stroke_fill=HALO)


def glow_layer(size, project, ppd, water, zones, alpha=150, blur=12):
    layer = Image.new("L", size, 0)
    for lon, lat, rx, ry, ang in zones:
        cx, cy = project(lon, lat)
        tile = Image.new("L", (int(rx * ppd * 2 + 80), int(ry * ppd * 2 + 80)), 0)
        ImageDraw.Draw(tile).ellipse((40, 40, tile.width - 40, tile.height - 40), fill=alpha)
        tile = tile.rotate(ang, expand=True, resample=Image.BICUBIC)
        layer.paste(tile, (int(cx - tile.width / 2), int(cy - tile.height / 2)), tile)
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    arr = (np.asarray(layer).astype(float) * (1 - water)).astype(np.uint8)
    rgba = np.zeros((size[1], size[0], 4), np.uint8)
    rgba[..., 0], rgba[..., 1], rgba[..., 2], rgba[..., 3] = 196, 88, 46, arr
    return Image.fromarray(rgba)


def marker(draw, x, y, r=13):
    draw.ellipse((x - r - 9, y - r - 9, x + r + 9, y + r + 9), fill=(255, 240, 202, 220))
    draw.ellipse((x - r, y - r, x + r, y + r), fill=MARK, outline=(255, 249, 231), width=4)


src = Image.open(sys.argv[1]).convert("RGB")
mask_src = Image.open(sys.argv[2]).convert("RGB")
m = MAIN
W, H = int((m["east"] - m["west"]) * m["ppd"]), int((m["north"] - m["south"]) * m["ppd"])
base_rgb, water = colorize(np.asarray(crop(src, m["west"], m["east"], m["south"], m["north"], W, H)), np.asarray(crop(mask_src, m["west"], m["east"], m["south"], m["north"], W, H)))
img = Image.fromarray(base_rgb).convert("RGBA")
proj = lambda lon, lat: ((lon - m["west"]) * m["ppd"], (m["north"] - lat) * m["ppd"])
img.alpha_composite(glow_layer(img.size, proj, m["ppd"], water, ZONES))
d = ImageDraw.Draw(img)
for label, lon, lat, size in LAND_LABELS:
    font = ImageFont.truetype(SERIF, size)
    d.text(proj(lon, lat), " ".join(label), font=font, fill=(120, 84, 44, 150), anchor="mm")
for label, lon, lat, size in WATER_LABELS:
    text(d, proj(lon, lat), label, size, italic=True)
for label, lon, lat, size, italic in REGION_LABELS:
    text(d, proj(lon, lat), label, size, italic=italic)
for label, lon, lat, (dx, dy), anchor in SITES:
    x, y = proj(lon, lat)
    lx, ly = x + dx, y + dy
    if abs(dx) > 20 or abs(dy) > 40:
        d.line((x, y, lx + (8 if dx < 0 else -8 if dx > 0 else 0), ly + (8 if dy < 0 else -8 if dy > 0 else 0)), fill=LEADER, width=4)
    marker(d, x, y)
    text(d, (lx, ly), label, 60, anchor=anchor)

# South America inset (same raster, same palette)
x0, y0, x1, y1 = INSET_BOX
iw, ih = x1 - x0, y1 - y0
i = INSET_SRC
inset_rgb, inset_water = colorize(np.asarray(crop(src, i["west"], i["east"], i["south"], i["north"], iw, ih)), np.asarray(crop(mask_src, i["west"], i["east"], i["south"], i["north"], iw, ih)))
inset = Image.fromarray(inset_rgb).convert("RGBA")
ippd = iw / (i["east"] - i["west"])
iproj = lambda lon, lat: ((lon - i["west"]) * ippd, (i["north"] - lat) * ippd)
inset.alpha_composite(glow_layer(inset.size, iproj, ippd, inset_water, [(-70.0, -16.0, 3.0, 11.0, 26)], alpha=170, blur=5))
idraw = ImageDraw.Draw(inset)
text(idraw, iproj(-55.0, -27.5), "South America", 36)
idraw.line((*iproj(-61.0, -12.0), *iproj(-68.5, -15.0)), fill=LEADER, width=4)
text(idraw, iproj(-54.0, -11.0), "Andes", 48)
d.rounded_rectangle((x0 - 10, y0 - 10, x1 + 10, y1 + 10), radius=10, fill=(255, 242, 209, 255), outline=(147, 87, 47, 255), width=4)
img.alpha_composite(inset, (x0, y0))
img.convert("RGB").save(sys.argv[3])
print(img.size)
