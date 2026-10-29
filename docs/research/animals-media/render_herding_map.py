"""Deterministic render of the Animals, Herding, and Mobility locator map.

Base: Natural Earth II with Shaded Relief and Water, 1:50m, v3.2.0 (NE2_50M_SR_W.tif,
Public Domain, https://www.naturalearthdata.com/). Equirectangular, 1/30 degree per pixel.
Usage: python3 render_herding_map.py <NE2_50M_SR_W.tif> <out.png>
Zones are broad and approximate; markers mark sites to within the marker size.
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

Image.MAX_IMAGE_PIXELS = None
W_LON, E_LON, S_LAT, N_LAT = -88.0, 98.0, -36.0, 60.0
OUT_W = 2000

# number, label (native text only), lon, lat
SITES = [
    (1, "Ganj Dareh", 47.50, 34.32),
    (4, "Takarkori", 10.33, 24.88),
    (5, "Lothagam North", 36.0, 2.9),
    (6, "Mustatil east of AlUla", 38.2, 26.6),
]
# number, lon, lat, rx_deg, ry_deg, angle_deg  (broad, approximate zones)
ZONES = [
    (None, 43.5, 35.3, 7.0, 4.0, -10),   # Fertile Crescent and Zagros
    (2, 69.5, 28.5, 3.6, 4.6, 0),        # Indus Valley
    (3, -71.0, -16.0, 3.2, 11.0, 28),   # central and southern Andes
    (None, 12.0, 21.5, 17.0, 6.5, 0),    # green Sahara (broad)
    (7, 47.0, 51.5, 13.0, 3.6, 0),       # western Eurasian steppe
]

src = Image.open(sys.argv[1]).convert("RGB")
sw, sh = src.size
def px(lon, lat):
    return (lon + 180.0) / 360.0 * sw, (90.0 - lat) / 180.0 * sh
x0, y0 = px(W_LON, N_LAT); x1, y1 = px(E_LON, S_LAT)
crop = src.crop((int(x0), int(y0), int(x1), int(y1)))
scale = OUT_W / crop.width
img = crop.resize((OUT_W, round(crop.height * scale)), Image.LANCZOS)
a = np.asarray(img).astype(float)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
water = (b > r + 18) & (b > g - 4)
water = np.asarray(Image.fromarray((water * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(5))) > 127
lum = (0.3 * r + 0.59 * g + 0.11 * b) / 255.0
# warm golden land: blend relief luminance into an ochre-to-cream ramp
dark = np.array([138, 92, 38.0]); light = np.array([244, 216, 150.0])
land = dark[None, None, :] * (1 - lum[..., None]) + light[None, None, :] * lum[..., None]
sea_deep = np.array([74, 140, 178.0]); sea_light = np.array([150, 196, 214.0])
sea = sea_deep[None, None, :] * (1 - lum[..., None]) + sea_light[None, None, :] * lum[..., None]
out = np.where(water[..., None], sea, land).clip(0, 255).astype(np.uint8)
img = Image.fromarray(out).convert("RGBA")

def opx(lon, lat):
    return (lon - W_LON) / (E_LON - W_LON) * img.width, (N_LAT - lat) / (N_LAT - S_LAT) * img.height
deg = img.width / (E_LON - W_LON)

overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
for _, lon, lat, rx, ry, ang in ZONES:
    cx, cy = opx(lon, lat)
    zone = Image.new("RGBA", (int(rx * deg * 2 + 40), int(ry * deg * 2 + 40)), (0, 0, 0, 0))
    d = ImageDraw.Draw(zone)
    d.ellipse((20, 20, zone.width - 20, zone.height - 20), fill=(196, 92, 52, 92), outline=(150, 62, 34, 210), width=5)
    zone = zone.rotate(ang, expand=True, resample=Image.BICUBIC)
    overlay.alpha_composite(zone, (int(cx - zone.width / 2), int(cy - zone.height / 2)))
ov = np.asarray(overlay).copy()
ov[..., 3] = (ov[..., 3] * (~water)).astype(np.uint8)
img.alpha_composite(Image.fromarray(ov))

font = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Bold.otf", 50)
d = ImageDraw.Draw(img)
def badge(n, cx, cy):
    rad = 38
    d.ellipse((cx - rad - 5, cy - rad - 5, cx + rad + 5, cy + rad + 5), fill=(255, 248, 232, 255))
    d.ellipse((cx - rad, cy - rad, cx + rad, cy + rad), fill=(178, 70, 38, 255))
    d.text((cx, cy + 2), str(n), font=font, fill=(255, 250, 240, 255), anchor="mm")
for n, _, lon, lat in SITES:
    badge(n, *opx(lon, lat))
for n, lon, lat, *_ in ZONES:
    if n is not None:
        badge(n, *opx(lon, lat))
img.convert("RGB").save(sys.argv[2])
print(img.size)
