# REGLA — Visual Consistency

**Sistema:** Frecuencia Global  
**Código:** RULE_Visual_Consistency  
**Severidad:** BLOQUEANTE  
**Aplica a:** Design Production Agent, Brand System Agent, QA/Consistency Agent

---

## PRINCIPIO

Toda pieza visual de Frecuencia Global debe ser inmediatamente reconocible como parte del sistema. Si alguien ve una pieza fuera de contexto, debe poder identificarla como FG en <2 segundos.

---

## 1. PALETA CROMÁTICA — CERRADA

| Rol | Color | Hex | RGB | Uso |
|-----|-------|-----|-----|-----|
| Base | Negro profundo | `#0A0A0F` | 10,10,15 | Background principal |
| Acento primario | Cian eléctrico | `#00E5FF` | 0,229,255 | Marca, títulos, frequency line |
| Acento secundario | Magenta neón | `#FF00E5` | 255,0,229 | Energía, urgencia, Bass & Borders |
| Superficie | Gris pizarra | `#1A1A2E` | 26,26,46 | Cards, zonas de texto, separadores |
| Terciario | Verde ácido | `#B8FF00` | 184,255,0 | Datos, highlights, Frecuencia Global |
| Texto primario | Blanco puro | `#FFFFFF` | 255,255,255 | Todo texto sobre fondo oscuro |
| Texto secundario | Gris claro | `#A0A0B8` | 160,160,184 | Subtítulos, metadata, descripciones |
| Pilar: Behind the Policy | Azul profundo | `#4A6BFF` | 74,107,255 | Exclusivo de Behind the Policy |

**CERO EXCEPCIONES.** No se usan colores fuera de esta paleta. Si se necesita un color nuevo, solicitar a Brand System Agent con justificación.

### Color dominante por pilar

| Pilar | Color dominante | Uso |
|-------|-----------------|-----|
| Geopolitik Drop | `#00E5FF` Cian | Pills, acentos, frequency lines |
| Bass & Borders | `#FF00E5` Magenta | Pills, acentos, nodos |
| Frecuencia Global | `#B8FF00` Verde ácido | Pills, acentos, highlights |
| Behind the Policy | `#4A6BFF` Azul | Pills, acentos, líneas |

---

## 2. TIPOGRAFÍA — CERRADA

| Nivel | Fuente | Peso | Tamaños | Uso | Regla |
|-------|--------|------|---------|-----|-------|
| Display | Bebas Neue | Regular (400) | 48-120px | Títulos | **SIEMPRE UPPERCASE** |
| Headlines | Space Grotesk | Bold (700) | 24-36px | Subtítulos, secciones | Sentence case |
| Body | Space Grotesk | Regular (400) | 14-18px | Texto descriptivo | Sentence case |
| Data | JetBrains Mono | Regular (400) | 12-16px | Fechas, tags, metadata | lowercase o UPPERCASE |
| Micro | Space Grotesk | Medium (500) | 10-12px | Credits, disclaimers | lowercase |

**Tres familias. Sin excepciones.** No Comic Sans, no Helvetica, no "la fuente que viene por defecto en Canva".

---

## 3. COMPONENTES VISUALES — DEL CATÁLOGO

Todo elemento visual debe ser del catálogo definido:

| Componente | Descripción | Archivo fuente |
|------------|-------------|---------------|
| Frequency Line | Línea horizontal con picos de audio, color cian + glow | v5/Element_FrequencyLine |
| Signal Node | Círculo luminoso (8-16px), 4 variantes de color | v5/Element_SignalNode |
| Brackets | Corchetes estilizados `[ ]` para metadata | Assets_Base/fg_corchetes.svg |
| Grid | Patrón de líneas (3-5% opacidad, blanco) | v5/BG_DarkGrid |
| Pill de pilar | Rectángulo redondeado con nombre del pilar | Color del pilar |
| Wordmark | "FRECUENCIA GLOBAL" en 4 variantes | Assets_Base/fg_wordmark_*.svg |
| Isotipo | Ícono de marca (onda + nodo) | Assets_Base/fg_isotipo.svg |

**No inventar componentes nuevos.** Si se necesita algo que no existe, solicitar a Brand System.

---

## 4. COMPOSICIÓN — REGLAS DE LAYOUT

### Jerarquía visual
```
1. Título (más grande, más arriba, mayor contraste)
2. Subtítulo / dato clave
3. Texto de soporte
4. Metadata / fuentes
5. Marca (logo, pill)
```

### Espaciado
- Padding mínimo: 40px desde bordes en 1080px wide
- Espacio entre elementos: mínimo 20px
- No apilar texto sin espacio

### Contraste
- Texto blanco sobre fondo oscuro (ratio >4.5:1)
- No texto claro sobre fondo claro
- No texto de color sobre fondo de color similar

### Safe areas por plataforma
| Plataforma | Safe area |
|-----------|-----------|
| YouTube Thumbnail | Evitar esquina inferior derecha (timestamp) |
| Instagram Feed | Cuadrado central seguro |
| TikTok/Reels | 150px arriba/abajo, 60px laterales |
| Stories | 250px arriba (nombre), 200px abajo (responder) |

---

## 5. BACKGROUNDS — USO CORRECTO

| Background | Cuándo usar |
|-----------|-------------|
| DarkSolid (`#0A0A0F`) | Default. Slides interiores, posts simples |
| DarkGrid | Cuando se necesita textura sutil. Thumbnails, covers |
| CyanField | Piezas de Geopolitik Drop con más energía visual |
| PolicyField | Piezas de Behind the Policy |
| ModularFrame | Layouts con múltiples zonas de contenido |
| NewsField | Piezas de Frecuencia Global (noticias rápidas) |

---

## 6. RESOLUCIONES — EXACTAS

| Formato | Dimensiones | DPI |
|---------|------------|-----|
| YouTube Thumbnail | 1280×720 | 72 |
| YouTube Banner | 2560×1440 | 72 |
| Instagram Feed (cuadrado) | 1080×1080 | 72 |
| Instagram Carrusel | 1080×1350 | 72 |
| Instagram Story / Reel | 1080×1920 | 72 |
| TikTok | 1080×1920 | 72 |
| X/Twitter Header | 1500×500 | 72 |
| LinkedIn Post | 1200×627 | 72 |
| Avatar (todas) | 400×400 mínimo | 72 |

---

## 7. GLOW EFFECTS

- Aplicar glow sutil en elementos de color (cian, magenta, verde)
- Glow = mismo color con blur 10-20px y opacidad 30-50%
- No abusar — máximo 2-3 elementos con glow por pieza
- Nunca glow en texto (afecta legibilidad)

---

## CHECKLIST RÁPIDO DE CONSISTENCIA VISUAL

```
□ Solo colores del sistema (verificar hex)
□ Solo tipografías del sistema (Bebas/SpaceGrotesk/JetBrainsMono)
□ Bebas Neue siempre en UPPERCASE
□ Componentes del catálogo (no elementos freelance)
□ Background del sistema
□ Safe areas respetadas
□ Legible en mobile (test zoom 50%)
□ Pill de pilar presente con color correcto
□ Logo/wordmark presente
□ Resolución exacta para plataforma
□ Contraste >4.5:1 en texto principal
```

---

*La consistencia visual es lo que convierte piezas sueltas en un sistema. Un sistema es lo que convierte un proyecto en una marca.*
