#!/usr/bin/env python3
"""
Genera los iconos del navegador a partir de assets/images/logo.png:
la marca calada en blanco sobre un cuadrado del azul de marca.

  favicon.ico          (16/32/48, para /favicon.ico)
  favicon-32.png
  apple-touch-icon.png (180x180, iOS)

Uso:   python3 tools/generar-favicons.py
Requiere: pip3 install Pillow

Sólo hace falta correrlo si cambia el logo.
"""
from PIL import Image
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AZUL = (16, 0, 255)  # --blue

logo = Image.open(os.path.join(ROOT, "assets/images/logo.png")).convert("RGBA")
# el PNG del logo trae margen alrededor: recortar al contenido real
marca = logo.crop(logo.split()[3].getbbox())


def tile(lado, margen=0.16):
    """Cuadrado azul con la marca centrada y calada en blanco."""
    lienzo = Image.new("RGBA", (lado, lado), AZUL + (255,))
    disponible = int(lado * (1 - margen * 2))
    escala = min(disponible / marca.width, disponible / marca.height)
    ancho = max(1, int(marca.width * escala))
    alto = max(1, int(marca.height * escala))
    m = marca.resize((ancho, alto), Image.LANCZOS)
    # usar el alfa de la marca como máscara para pintarla blanca
    blanco = Image.new("RGBA", (ancho, alto), (255, 255, 255, 255))
    lienzo.paste(blanco, ((lado - ancho) // 2, (lado - alto) // 2), m)
    return lienzo


for lado, nombre in [(32, "favicon-32.png"), (180, "apple-touch-icon.png")]:
    destino = os.path.join(ROOT, nombre)
    tile(lado).convert("RGB").save(destino, "PNG", optimize=True)
    print(f"OK → {nombre} ({os.path.getsize(destino)} bytes)")

ico = os.path.join(ROOT, "favicon.ico")
tile(64).convert("RGB").save(ico, sizes=[(16, 16), (32, 32), (48, 48)])
print(f"OK → favicon.ico ({os.path.getsize(ico)} bytes)")
