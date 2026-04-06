# Especificación Técnica — Thumbnail EP_001 Final

**Pieza:** EP_001 (P1_001) — Frecuencia Global Podcast  
**Base:** `FG_GD_THB_Cables-Poder_EP001_v1_20260405_0_raw.png` (1024×572 px)  
**Output final:** 1280×720 px PNG  
**Herramienta:** Canva o Figma  
**Fecha especificación:** 2026-04-05  

---

## 1. SETUP INICIAL (Canva/Figma)

### Canvas/Base
- **Dimensiones:** 1280 × 720 px (16:9)
- **Color fondo:** #0A0A0F (Negro Profundo) — si el raw no cubre todo
- **Importar raw:** `FG_GD_THB_Cables-Poder_EP001_v1_20260405_0_raw.png`
- **Escala raw:** Escalar para cubrir 1280×720 manteniendo proporción o ligeramente stretch si es necesario

### Guías/Safe Zones
```
┌─────────────────────────────────────────────┐ ← 0px (top)
│  ┌─────────────────────────────────────┐    │
│  │                                     │    │ ← 149px (safe top)
│  │      ZONA SEGURA 1546×423           │    │
│  │      (en 1280×720 = ~1230×385)       │    │
│  │                                     │    │
│  │   LEFT THIRD: Título principal      │    │
│  │   CENTER: Visual cables             │    │
│  │   RIGHT: Wordmark FG                │    │
│  │                                     │    │ ← 535px (safe bottom)
│  └─────────────────────────────────────┘    │
│  Margen lateral: ~207px                       │
└─────────────────────────────────────────────┘ ← 720px (bottom)
```

**Safe zone real (1280×720):**
- Margen superior: 149px
- Margen inferior: 149px  
- Margen lateral: 207px
- Área segura central: ~866×422 px

---

## 2. OVERLAY TIPOGRÁFICO — TEXTO EXACTO

### Capa 1: Título Principal (Zona izquierda)

| Atributo | Valor |
|----------|-------|
| **Texto** | `CABLES DE PODER` |
| **Fuente** | Bebas Neue (Regular 400) |
| **Tamaño** | 72-80px (ajustar a 2 líneas máximo) |
| **Color** | Blanco puro #FFFFFF |
| **Efecto** | Drop shadow negro 80%, offset 2px, blur 4px |
| **Tracking** | +3% (ligeramente abierto) |
| **Transform** | MAYÚSCULAS |
| **Posición** | Left third, centrado vertical en safe zone |
| **Alineación** | Izquierda |
| **Máx ancho** | 400px (para legibilidad) |

**Layout opción A (1 línea):**
```
CABLES DE PODER
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ (línea de frecuencia debajo)
```

**Layout opción B (2 líneas, si 72px es muy grande):**
```
CABLES
DE PODER
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
```

### Capa 2: Línea de Frecuencia (Elemento gráfico)

| Atributo | Valor |
|----------|-------|
| **Tipo** | Línea horizontal estilizada como waveform |
| **Posición** | Inmediatamente debajo del título |
| **Color** | Cian #00E5FF |
| **Grosor** | 3-4px |
| **Longitud** | ~80% del ancho del título |
| **Efecto** | Outer glow 30% opacidad, 8-12px radio |
| **Estilo** | Puede ser: línea sólida, línea punteada, o waveform simple |

### Capa 3: Wordmark FG (Esquina superior derecha)

| Atributo | Valor |
|----------|-------|
| **Texto** | `FRECUENCIA GLOBAL` |
| **Fuente** | Bebas Neue (Regular 400) |
| **Tamaño** | 24-28px |
| **Color** | Blanco #FFFFFF |
| **Efecto** | Outer glow cian sutil 20% opacidad |
| **Posición** | Esquina superior derecha, margen 40px de bordes |
| **Alineación** | Derecha |

### Capa 4: Identificador Episodio (Esquina inferior izquierda)

| Atributo | Valor |
|----------|-------|
| **Texto** | `EP 001` |
| **Fuente** | JetBrains Mono (Regular 400) |
| **Tamaño** | 14-16px |
| **Color** | Cian #00E5FF |
| **Background** | Opcional: rectángulo #0A0A0F al 80% detrás |
| **Posición** | Esquina inferior izquierda, margen 40px de bordes |
| **Alineación** | Izquierda |

### Capa 5: Tag de Pilar (Opcional — esquina superior izquierda)

| Atributo | Valor |
|----------|-------|
| **Texto** | `[GD]` |
| **Fuente** | JetBrains Mono (Regular 400) |
| **Tamaño** | 16-18px |
| **Color** | Cian #00E5FF |
| **Posición** | Esquina superior izquierda, margen 40px de bordes |

---

## 3. JERARQUÍA VISUAL

```
Prioridad visual (de mayor a menor):

1. TÍTULO "CABLES DE PODER" (zona izquierda)
   → Más grande, blanco puro, sombra para contraste
   
2. ELEMENTO VISUAL CABLES (centro-derecha)
   → El raw generado, cables cyan con glow
   
3. LÍNEA DE FRECUENCIA (debajo título)
   → Elemento de marca, cian glow
   
4. WORDMARK "FRECUENCIA GLOBAL" (sup derecha)
   → Branding, blanco con glow cian sutil
   
5. [GD] TAG (sup izquierda — opcional)
   → Identificación de pilar
   
6. EP 001 (inf izquierda)
   → Metadatos, cian
```

---

## 4. CONTRASTE Y LEGIBILIDAD

### Requisitos WCAG AA
- Contraste mínimo título: **4.5:1** ✅
  - Blanco #FFFFFF sobre fondo #0A0A0F = 21:1 ✅
- Contraste wordmark: **4.5:1** ✅
  - Blanco #FFFFFF sobre cables cyan ≈ 7:1 (verificar visualmente)

### Test de legibilidad
1. Exportar a 200px de ancho (preview YouTube pequeño)
2. ¿Se lee "CABLES DE PODER" claramente?
3. ¿Se distingue el visual de cables?
4. ¿Wordmark FG es reconocible?

Si NO pasa el test: aumentar tamaño del título o ajustar posición.

---

## 5. PASOS DE EJECUCIÓN (Checklist de diseño)

### Paso 1: Setup
- [ ] Crear canvas 1280×720 px en Canva/Figma
- [ ] Importar raw: `FG_GD_THB_Cables-Poder_EP001_v1_20260405_0_raw.png`
- [ ] Escalar raw para cubrir canvas (manteniendo calidad)
- [ ] Agregar guías en márgenes 149px (sup/inf) y 207px (lat)

### Paso 2: Título
- [ ] Texto: "CABLES DE PODER"
- [ ] Fuente: Bebas Neue, 72-80px
- [ ] Color: #FFFFFF
- [ ] Sombra: negro 80%, offset 2px, blur 4px
- [ ] Posición: Left third, centrado vertical safe zone

### Paso 3: Línea de frecuencia
- [ ] Crear línea waveform debajo del título
- [ ] Color: #00E5FF
- [ ] Grosor: 3-4px
- [ ] Longitud: ~80% ancho del título
- [ ] Glow: 30% opacidad, 10px radio

### Paso 4: Wordmark
- [ ] Texto: "FRECUENCIA GLOBAL"
- [ ] Fuente: Bebas Neue, 24-28px
- [ ] Color: #FFFFFF
- [ ] Glow cian sutil: 20% opacidad
- [ ] Posición: Esquina sup derecha, margen 40px

### Paso 5: EP 001
- [ ] Texto: "EP 001"
- [ ] Fuente: JetBrains Mono, 14-16px
- [ ] Color: #00E5FF
- [ ] Posición: Esquina inf izquierda, margen 40px

### Paso 6: [GD] Tag (opcional)
- [ ] Texto: "[GD]"
- [ ] Fuente: JetBrains Mono, 16-18px
- [ ] Color: #00E5FF
- [ ] Posición: Esquina sup izquierda, margen 40px

### Paso 7: Exportación
- [ ] Exportar PNG 1280×720
- [ ] Verificar tamaño archivo < 2MB
- [ ] Guardar como: `FG_GD_THB_Cables-Poder_EP001_v1_20260405_0.png`

---

## 6. REFERENCIAS

**Raw base:**
`06_Assets/production/P1_001/review/FG_GD_THB_Cables-Poder_EP001_v1_20260405_0_raw.png`

**Brand Kit:**
`02_Brand_System/FG_Brand_Kit_Operativo.md`

**Specs thumbnails:**
`06_Assets/_system/export_specs.json`

---

## 7. NAMING FINAL DEL ARCHIVO

```
FG_GD_THB_Cables-Poder_EP001_v1_20260405_0.png
```

**Desglose:**
- `FG_` — Prefijo marca
- `GD_` — Pilar Geopolitik Drop
- `THB_` — Formato Thumbnail
- `Cables-Poder_` — Tema del thumbnail
- `EP001_` — Identificador episodio
- `v1_` — Versión mayor
- `20260405_` — Fecha
- `0_` — Índice del día
- `.png` — Extensión

---

*Especificación para cierre manual en Canva/Figma*
*FG-ASSET-OPS-EP001-THUMB-SPEC-v1.0*
