# Portafolio — María Ignacia Delfau

Sitio estático (HTML + CSS + JS puro, sin framework ni build). Publicado en
**https://ignaciadelfau.com** vía GitHub Pages.

---

## 🚀 PUBLICAR CAMBIOS

Esta carpeta es un repo git conectado a `ignaciadelfau.github.io`:

```bash
git add -A
git commit -m "qué cambiaste"
git push
```

GitHub Pages reconstruye solo en ~1 minuto.

> ⚠️ **Nunca subas archivos por la web de GitHub** ("Add file → Upload files").
> Eso fue lo que en agosto 2026 creó una carpeta llamada `assets ` — con un
> espacio al final — que dejó **las 46 imágenes y la tipografía del sitio en
> 404 durante días**, más un `index_1.html` duplicado y 9 archivos `prueba`.
> GitHub no sobreescribe archivos al subirlos: los renombra.

**Si el push falla por permisos:** esta Mac tiene dos cuentas de GitHub.
Verificá con `gh api user --jq .login` y cambiá con
`gh auth switch -u ignaciadelfau` (la cuenta `nachotono` es de solo lectura).

### Ver el sitio en local antes de publicar

```bash
python3 -m http.server 8000
```

Y abrí http://localhost:8000

---

## 🔒 NO BORRAR NUNCA

| Archivo | Por qué |
|---|---|
| `CNAME` | Contiene `ignaciadelfau.com`. Sin él el dominio deja de funcionar. |
| `_config.yml` | Mantiene `CLAUDE.md`, `README.md`, `wrangler.jsonc` y `tools/` fuera del sitio público. Si agregás archivos internos, sumalos ahí. |

---

## 📁 ESTRUCTURA REAL

```
PORTAFOLIO/
├── index.html                  ← Home: hero + carrusel solar
├── about.html
├── project.html                ← B2E Inspection Tool
├── project-openbank.html
├── project-unification.html
├── project-rebrand.html
├── project-garage.html
│
├── css/
│   ├── style.css               ← tokens, nav, home, resets
│   ├── project.css             ← librería de componentes cs-* (132 clases)
│   └── about.css
│
├── js/
│   └── main.js                 ← array PROJECTS + carrusel + contraseña
│
├── assets/
│   ├── fonts/NeutraText-Bold.otf
│   └── images/                 ← una subcarpeta por proyecto
│
├── tools/                      ← scripts para regenerar favicon y preview
├── favicon.ico · favicon-32.png · apple-touch-icon.png
├── CNAME · _config.yml
└── CLAUDE.md                   ← guía técnica detallada
```

---

## 🎨 SISTEMA DE DISEÑO

| Token          | Valor      | Uso                                |
|----------------|------------|------------------------------------|
| `--bg`         | `#FFFFFF`  | Fondo general                      |
| `--ink`        | `#111111`  | Texto principal                    |
| `--ink-muted`  | `#555555`  | Texto secundario                   |
| `--ink-faint`  | `#999999`  | Labels                             |
| `--blue`       | `#1000FF`  | Color de acento (home)             |
| `--blue-a11y`  | `#0500CC`  | Versión accesible del azul         |
| `--yellow`     | `#FAC601`  | Decorativo SÓLO (gradiente hero)   |

**Tipografía:** `Syne` para headlines, `Montserrat` para body.
`NeutraText-Bold` es la del logo y la imagen de preview.

**Color por caso de estudio** — cada proyecto se re-skinea con una sola variable:

| Proyecto | `--cs-accent` |
|---|---|
| Openbank | `#E31252` |
| Unification | `#EC0000` |
| Rebrand | `#EC6270` |
| Garage Beer | `#FFAC00` |

---

## ➕ AGREGAR UN PROYECTO NUEVO

1. Duplicá `project-garage.html` (el más simple) y renombralo.
2. Poné `<body class="case-body case-<nombre>">` y agregá
   `.case-<nombre> { --cs-accent: #HEX; }` en `css/project.css`.
3. Reusá las clases `cs-` existentes; lo bespoke va **al final** de
   `project.css`, bajo un banner de comentario.
4. Imágenes en `assets/images/<nombre>/`.
5. **Registrá el proyecto en el array `PROJECTS` de `js/main.js`.**
   El home no tiene cards escritas a mano — se construyen desde ese array.
6. Copiá el `<script>` del final de otra página de proyecto (el
   `IntersectionObserver` de las animaciones de scroll).

---

## 🔐 CONTRASEÑA

Hay **una sola contraseña global** (`SITE_PASSWORD` en `js/main.js`) que
desbloquea todos los proyectos con `locked: true` durante la sesión del
navegador. No hay contraseñas por proyecto.

> Es una cortina, no seguridad: la contraseña se lee en texto plano abriendo
> el código fuente de `js/main.js` desde el navegador. Sirve para que un
> reclutador casual no entre. **No la uses como protección de material bajo
> NDA.**

---

## 🖼 IMÁGENES

| Archivo | Tamaño ideal | Ratio |
|---|---|---|
| `face.jpg` | 400×400 | 1:1 |
| `about-portrait.jpg` | 900×1200 | 3:4 |
| `project-N.jpg` (thumbnails) | 1200×900 | 4:3 |
| Diagramas / mockups | ~2000px de ancho | libre |

- Comprimí con **squoosh.app** antes de subir (apuntá a <300 KB).
- Poné siempre `alt` y `loading="lazy"` salvo en lo que se ve sin scrollear.
- Los mockups de dispositivos son PNG transparentes con sombra incorporada:
  **no** les agregues `box-shadow` ni `border-radius` por CSS.
- Preferí SVG hecho a mano para diagramas (ver `assets/images/garage/sitemap.svg`).

---

## 🛠 REGENERAR FAVICON O IMAGEN DE PREVIEW

```bash
python3 tools/generar-favicons.py    # favicon.ico, favicon-32, apple-touch-icon
python3 tools/generar-og-image.py    # assets/images/og-image.jpg (1200×630)
```

Corré el segundo si cambiás tu nombre o tu titular: esa imagen es la que se
ve al compartir el link en LinkedIn o WhatsApp. Requiere Pillow
(`pip3 install Pillow`).

---

© 2026 María Ignacia Delfau
