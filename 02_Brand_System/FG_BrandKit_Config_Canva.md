# Configuración Brand Kit en Canva — Frecuencia Global

**Brand Kit ID:** `kAGEfgAcmZ0`
**URL directa:** https://www.canva.com/brand/brand-kit

---

## 1. COLORES (copiar hex exacto)

### Paleta Principal
| Nombre en Canva | Hex | Rol |
|:---|:---|:---|
| Negro Profundo | `#0A0A0F` | Fondo principal |
| Cian Eléctrico | `#00E5FF` | Acento insignia / Geopolitik Drop |
| Magenta Neón | `#FF00E5` | Segundo acento / Bass & Borders |
| Grafito Azulado | `#1A1A2E` | Superficie / cards |
| Verde Ácido | `#B8FF00` | Datos / Frecuencia Global pilar |
| Blanco Puro | `#FFFFFF` | Texto principal |
| Gris Claro | `#A0A0B8` | Texto secundario |
| Azul Profundo | `#4A6BFF` | Behind the Policy pilar |

### Cómo agregar:
1. Ir a **Brand Kit** → sección **Brand colors**
2. Click **+ Add a new color** por cada uno
3. Pegar hex sin el `#` (solo `0A0A0F`)
4. Nombrar cada color según la tabla

---

## 2. TIPOGRAFÍAS

### Fuentes a configurar:
| Fuente | Categoría en Canva | Peso | Rol |
|:---|:---|:---|:---|
| **Bebas Neue** | Heading | Regular (400) | Títulos, display (MAYÚSCULAS siempre) |
| **Space Grotesk** | Subheading + Body | Bold (700) + Regular (400) | Subtítulos + texto corrido |
| **JetBrains Mono** | Body text | Regular (400) | Datos, metadata, fechas, fuentes |

### Cómo configurar:
1. Ir a **Brand Kit** → sección **Brand fonts**
2. Click **Add a font combination**
3. Configurar:
   - **Heading:** Bebas Neue Regular
   - **Subheading:** Space Grotesk Bold
   - **Body:** Space Grotesk Regular
4. Para **JetBrains Mono**: si no aparece en Canva nativo, subir los archivos desde `static/` del workspace

### Archivos de fuente disponibles localmente:
```
static/SpaceGrotesk-Bold.ttf
static/SpaceGrotesk-Light.ttf
static/SpaceGrotesk-Medium.ttf
static/SpaceGrotesk-Regular.ttf
static/SpaceGrotesk-SemiBold.ttf
```

> **Nota:** Bebas Neue y Space Grotesk están disponibles nativamente en Canva. JetBrains Mono puede requerir upload.

---

## 3. LOGOS

### Logos para subir al Brand Kit:

| Asset | Archivo local | Descripción |
|:---|:---|:---|
| FG Monograma | Canva Design `DAHFf-nM5sA` | Logo "FG" editado — exportar y subir |
| Isotipo | `Frecuencia_Global_Assets_Base/assets/fg_isotipo.svg` | Ícono de frecuencia/onda |
| Wordmark Dark | `Frecuencia_Global_Assets_Base/assets/fg_wordmark_dark.svg` | "FRECUENCIA GLOBAL" sobre fondo oscuro |
| Wordmark Light | `Frecuencia_Global_Assets_Base/assets/fg_wordmark_light.svg` | "FRECUENCIA GLOBAL" sobre fondo claro |
| Corchetes | `Frecuencia_Global_Assets_Base/assets/fg_corchetes.svg` | Elemento de marca [ ] |
| Nodo | `Frecuencia_Global_Assets_Base/assets/fg_nodo.svg` | Punto de señal con glow |

### Cómo agregar logos:
1. Ir a **Brand Kit** → sección **Logos**
2. Click **Upload a logo**
3. Subir SVGs desde la carpeta `Frecuencia_Global_Assets_Base/assets/`
4. Para el monograma FG: abrir diseño `DAHFf-nM5sA` → descargar como PNG transparente → subir

---

## 4. FOTOS/GRÁFICOS DE MARCA (opcional)

### Fondos base para subir:
Estos se pueden crear como diseños en Canva y guardar como elementos de marca:
- Fondo sólido `#0A0A0F`
- Fondo grafito con grid
- Gradiente `#0A0A0F` → `#1A1A2E` vertical
- Gradiente con halo cian en esquina

---

## 5. VERIFICACIÓN

Después de configurar, verificar que al generar un nuevo diseño con `brand_kit_id: kAGEfgAcmZ0`:
- [ ] Aparecen los 8 colores de marca
- [ ] Bebas Neue disponible como Heading  
- [ ] Space Grotesk disponible como Subheading y Body
- [ ] JetBrains Mono disponible para datos
- [ ] Al menos 1 logo visible en la sección de logos

---

*Referencia completa: `02_Brand_System/FG_Brand_Kit_Operativo.md`*
