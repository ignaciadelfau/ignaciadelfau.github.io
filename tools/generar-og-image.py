#!/usr/bin/env python3
"""
Genera assets/images/og-image.jpg (1200x630) — la tarjeta que se ve al
compartir el link del portafolio en LinkedIn, WhatsApp, Slack, etc.

Uso:   python3 tools/generar-og-image.py
Requiere: pip3 install Pillow

Volvé a correrlo si cambiás tu nombre o tu titular. Si cambiás el texto,
acordate de actualizar también los <meta property="og:*"> de las 7 páginas.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

NOMBRE_1 = "María Ignacia"
NOMBRE_2 = "Delfau"
SUBTITULO = "UX/UI Designer  ·  Barcelona"

W, H = 1200, 630
BG = (255, 255, 255)
INK = (17, 17, 17)
MUTED = (85, 85, 85)
BLUE = (16, 0, 255)      # --blue
YELLOW = (250, 198, 1)   # --yellow

# --- fondo: orbes difusos, guiño al gradiente del hero ---
img = Image.new("RGB", (W, H), BG)
azul = Image.new("RGB", (W, H), BG)
ImageDraw.Draw(azul).ellipse([720, -170, 1320, 430], fill=BLUE)
img = Image.blend(img, azul, 0.10)

amarillo = Image.new("RGB", (W, H), BG)
ImageDraw.Draw(amarillo).ellipse([620, 300, 1140, 820], fill=YELLOW)
img = Image.blend(img, amarillo, 0.14)

img = img.filter(ImageFilter.GaussianBlur(110))
d = ImageDraw.Draw(img)

# --- tipografias ---
FUTURA = "/System/Library/Fonts/Supplemental/Futura.ttc"
FALLBACKS = [FUTURA, "/System/Library/Fonts/Helvetica.ttc", "/Library/Fonts/Arial.ttf"]


def cargar(preferida, tam):
    for ruta in [preferida] + FALLBACKS:
        try:
            return ImageFont.truetype(ruta, tam)
        except Exception:
            continue
    return ImageFont.load_default()


f_nombre = cargar(os.path.join(ROOT, "assets/fonts/NeutraText-Bold.otf"), 92)
f_sub = cargar(FUTURA, 36)

PAD = 88

# --- logo ---
try:
    logo = Image.open(os.path.join(ROOT, "assets/images/logo.png")).convert("RGBA")
    alto = 54
    logo = logo.resize((int(logo.width * alto / logo.height), alto), Image.LANCZOS)
    img.paste(logo, (PAD, PAD), logo)
except Exception as e:
    print("aviso: no se pudo pegar el logo →", e)

# --- nombre, regla azul y subtitulo ---
y = 250
d.text((PAD, y), NOMBRE_1, font=f_nombre, fill=INK)
d.text((PAD, y + 104), NOMBRE_2, font=f_nombre, fill=INK)

y_regla = y + 232
d.rectangle([PAD, y_regla, PAD + 96, y_regla + 6], fill=BLUE)
d.text((PAD, y_regla + 34), SUBTITULO, font=f_sub, fill=MUTED)

salida = os.path.join(ROOT, "assets/images/og-image.jpg")
img.save(salida, "JPEG", quality=88, optimize=True)
print(f"OK → {salida}  ({os.path.getsize(salida) // 1024} KB, {img.size[0]}x{img.size[1]})")
