# Portfolio V2 — María Ignacia Delfau
## Estructura, instrucciones y contraseñas

---

## 📁 ESTRUCTURA

```
portfolio/
│
├── index.html          ← Inicio (hero + bio strip + grilla proyectos)
├── about.html          ← About me
├── project.html        ← Template de proyecto (duplicar por cada proyecto)
│
├── css/
│   └── style.css       ← Todos los estilos
│
├── js/
│   └── main.js         ← Interacciones, contraseña, transiciones
│
└── assets/
    ├── images/
    │   ├── face.jpg            ← Tu foto (hover en la "O" + bio strip)
    │   ├── about-portrait.jpg  ← Retrato vertical para About
    │   ├── project-1.jpg       ← Thumbnail card proyecto 1
    │   ├── project-2.jpg       ← Thumbnail card proyecto 2
    │   ├── project-3.jpg       ← Thumbnail card proyecto 3
    │   ├── project-4.jpg       ← Thumbnail card proyecto 4
    │   └── project-hero.jpg    ← Hero full-bleed página de proyecto
    └── resume.pdf
```

---

## 🎨 SISTEMA DE DISEÑO

| Token       | Valor      | Uso                                         |
|-------------|------------|---------------------------------------------|
| `--bg`      | `#FFFFFF`  | Fondo general                               |
| `--ink`     | `#111111`  | Texto principal                             |
| `--blue`    | `#1000FF`  | Color secundario (textos, HELLO, elementos) |
| `--blue-a11y` | `#0500CC` | Versión accesible del azul (≥4.5:1 ratio) |
| `--yellow`  | `#FAC601`  | Decorativo SÓLO (gradiente del hero)        |

**Tipografía:**
- Headlines/Display: `Syne` — bold 700, extrabold 800
- Body/UI: `Montserrat` — regular 400, medium 500, semibold 600

---

## 🔐 CÓMO CONFIGURAR CONTRASEÑAS DE PROYECTOS

### En `js/main.js`, línea ~30:

```javascript
const PROJECT_PASSWORDS = {
  'project.html':        'mi-password-aqui',
  'proyecto-marca.html': 'otro-password',
  'proyecto-app.html':   'otro-mas',
};
```

Cambia los valores por las contraseñas que quieras. La clave del objeto es el nombre del archivo HTML del proyecto.

### En `index.html`, en cada card protegida:

```html
<div class="project-card-link project-card-locked"
     role="button" tabindex="0"
     data-project-title="Nombre del Proyecto"
     data-project-dest="proyecto-marca.html">
```

- `data-project-title`: Nombre que aparece en el modal
- `data-project-dest`: Nombre del archivo HTML — DEBE coincidir con la clave en `PROJECT_PASSWORDS`

### Cards públicas vs privadas:
- **Pública**: usa `<a href="project.html" class="project-card-link">`
- **Privada**: usa `<div class="project-card-link project-card-locked" ...>`

---

## ➕ AGREGAR UN PROYECTO NUEVO

1. Duplica `project.html` → renómbralo: `proyecto-nombre.html`
2. Edita el contenido del nuevo archivo
3. En `index.html`, agrega una nueva `<article class="project-card">` (copia una existente)
4. Si es privado: agrega la contraseña en `js/main.js`
5. Sube las imágenes a `assets/images/`
6. Commit y push a GitHub

---

## 📐 LAYOUTS DE GALERÍA DISPONIBLES

En `project.html`, dentro de `.project-gallery`:

```html
<!-- Una imagen full width -->
<div class="g-row g-1">
  <div class="g-img wide"><img src="..." /></div>
</div>

<!-- Dos columnas -->
<div class="g-row g-2">
  <div class="g-img"><img src="..." /></div>
  <div class="g-img"><img src="..." /></div>
</div>

<!-- Tres columnas -->
<div class="g-row g-3">
  <div class="g-img square"><img /></div>
  <div class="g-img square"><img /></div>
  <div class="g-img square"><img /></div>
</div>

<!-- Featured: imagen grande + pequeña (2:1) -->
<div class="g-row g-feat">
  <div class="g-img"><img /></div>
  <div class="g-img tall"><img /></div>
</div>

<!-- Featured invertido (1:2) -->
<div class="g-row g-feat-r">
  <div class="g-img tall"><img /></div>
  <div class="g-img"><img /></div>
</div>
```

**Modificadores de imagen:**
- `g-img` — ratio 16:10 por defecto
- `g-img tall` — ratio 4:5 (vertical)
- `g-img wide` — ratio 21:9 (panorámica)
- `g-img square` — ratio 1:1

---

## 🖼 IMÁGENES RECOMENDADAS

| Archivo               | Tamaño ideal        | Ratio  |
|-----------------------|---------------------|--------|
| `face.jpg`            | 400×400px           | 1:1    |
| `about-portrait.jpg`  | 900×1200px          | 3:4    |
| `project-N.jpg`       | 1200×900px          | 4:3    |
| `project-hero.jpg`    | 2000×1125px         | 16:9   |
| Galería (full)        | 2000px de ancho     | libre  |
| Galería (square)      | 1000×1000px         | 1:1    |

Comprime siempre con **squoosh.app** antes de subir (apunta a <300KB por imagen).

---

## 🐙 SUBIR A GITHUB (ruta correcta)

Los archivos deben ir en la **raíz** del repositorio, NO dentro de una carpeta.

**Estructura correcta en GitHub:**
```
ignaciadelfau.github.io/
├── index.html     ← aquí, en la raíz
├── about.html
├── project.html
├── css/
├── js/
└── assets/
```

**Pasos:**
1. Ve a tu repo en github.com
2. Click en "Add file" → "Upload files"
3. Arrastra los archivos **desde dentro** de la carpeta `portfolio/`
4. Commit → espera 2 minutos → listo en `https://ignaciadelfau.github.io`

---

© 2024 María Ignacia Delfau
