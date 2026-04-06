# FG Publishing Contract
## Contrato Canónico de Publicación para Cualquier Pieza

**Versión:** 1.0
**Fecha:** 2026-04-05
**Ámbito:** Todas las piezas de contenido FG

---

## Propósito

Este documento define el contrato canónico que cualquier pieza debe cumplir para ser publicable en el sistema FG. Establece campos obligatorios, assets mínimos, metadata requerida y el ciclo de vida de publicación.

---

## Campos Obligatorios de una Pieza

### Identificación

| Campo | Descripción | Formato | Ejemplo |
|-------|-------------|---------|---------|
| `pieza_id` | Identificador único | `P{N}_{NNN}` o `EP_{NNN}` | `P1_001`, `EP_001` |
| `tipo` | Tipo de contenido | Enum | `carrusel`, `video`, `podcast`, `texto`, `imagen` |
| `estado` | Estado en pipeline | Enum | `DRAFT`, `REVIEW`, `PUBLISH_READY`, `PUBLISHED` |
| `fecha_creacion` | Fecha de creación | ISO 8601 | `2026-04-01` |
| `plataformas_target` | Plataformas destino | Array | `["instagram", "x", "threads"]` |

> **NOTA:** LinkedIn está FUERA del MVP real (bloqueado por verificación de app). Solo Threads, Instagram y X son objetivos viables hoy.

### Contenido Editorial

| Campo | Descripción | Requerido | Constraints |
|-------|-------------|-----------|-------------|
| `titulo` | Título principal | ✅ | Max 100 chars |
| `caption_instagram` | Texto para Instagram | Si `instagram` en targets | Max 2,200 chars |
| `caption_x` | Texto para X/Twitter | Si `x` en targets | Max 280 chars |
| `caption_linkedin` | Texto para LinkedIn | Si `linkedin` en targets | Max 3,000 chars |
| `caption_threads` | Texto para Threads | Si `threads` en targets | Max 500 chars |

> **NOTA:** LinkedIn requiere app verificada (no disponible). Campo existe para futuro pero no es parte del MVP operativo.
| `hashtags` | Hashtags comunes | ✅ | Min 3, max 10 |
| `menciones` | Menciones @ | Opcional | Validar existencia |
| `cta` | Call-to-action | Opcional | Max 50 chars |

---

## Assets Mínimos

### Por Tipo de Pieza

#### Carrusel (Instagram)

| Asset | Especificación | Formato | Ubicación |
|-------|----------------|---------|-----------|
| Imagen principal | 1080×1350px (4:5) o 1080×1080px (1:1) | PNG/JPG | `06_Assets/{pieza_id}/*IG*.png` |
| Imagen alternativa | 1080×1920px (9:16) Stories | PNG/JPG | `06_Assets/{pieza_id}/*STORY*.png` |
| Caption | Texto formateado | Markdown | `04_Produccion/{pieza_id}_PublishReady.md` |

#### Post X (Twitter)

| Asset | Especificación | Formato | Ubicación |
|-------|----------------|---------|-----------|
| Texto | <= 280 caracteres | Plain text | `04_Produccion/{pieza_id}_PublishReady.md` |
| Imagen opcional | 1200×675px (16:9) | PNG/JPG | `06_Assets/{pieza_id}/*X*.png` |

#### LinkedIn Company Page (FUTURO - No disponible)

> **ESTADO:** Bloqueado - App no verificada. No incluir en MVP.

| Asset | Especificación | Formato | Ubicación |
|-------|----------------|---------|-----------|
| Texto | <= 3,000 caracteres | Markdown | `04_Produccion/{pieza_id}_PublishReady.md` |
| Imagen opcional | 1200×627px (1.91:1) | PNG/JPG | `06_Assets/{pieza_id}/*LI*.png` |

#### Threads

| Asset | Especificación | Formato | Ubicación |
|-------|----------------|---------|-----------|
| Texto | <= 500 caracteres | Plain text | `04_Produccion/{pieza_id}_PublishReady.md` |
| Imagen | 1080×1350px preferido | PNG/JPG | Reutiliza IG o TK asset |

---

## Metadata Mínima

### Archivo PublishReady

Todo archivo `{pieza_id}_PublishReady.md` debe contener:

```markdown
# Publish Ready — {pieza_id}

**Pieza:** {pieza_id}
**Fecha:** YYYY-MM-DD
**Estado:** PUBLISH_READY
**Formato:** [x] Tipo
**Plataformas:** [x] Lista

---

## X (Twitter)
```
Texto del tweet
#hashtags
```
_Longitud: **XXX/280** caracteres_

---

## Instagram

**Caption:**
Texto completo del caption

#hashtag1 #hashtag2

---

## LinkedIn

Texto completo del post

#hashtag1 #hashtag2

---

## Threads

Texto para threads

---

## TikTok (FUTURO - No disponible)

> **ESTADO:** Bloqueado - Sin capacidad de publicación.

```
Texto del caption
```
_Longitud: **XXX/300** caracteres_

---

> Generado el YYYY-MM-DD. Revisar antes de publicar.
```

### Validaciones Automáticas

| Validación | Método | Gate |
|------------|--------|------|
| Existencia de archivo | `os.path.exists()` | Bloqueante |
| Parseo de secciones | Regex `## {Platform}` | Bloqueante |
| Longitud X | `len(text) <= 280` | Bloqueante |
| Longitud Threads | `len(text) <= 500` | Bloqueante |
| Existencia imagen | `Path.exists()` | Warning |
| Formato imagen | `.suffix in ('.png', '.jpg', '.jpeg')` | Bloqueante |

---

## Outputs Esperados por Publicación

### Consola/CLI

```
[OK] Pieza: P1_001
[OK] Imagen: FG_P1_001_IG_Cover_v1.png
[OK] Caption: 1,247 chars
[OK] Longitud X: 112/280
[OK] Longitud Threads: 245/500
[INFO] Publicando a: [instagram, x, threads]
[OK] Instagram: Publicado
[OK] X: Publicado
[OK] Threads: https://threads.net/@frecuenciaglobal/post/182163...
```

### Archivos Generados

| Archivo | Ubicación | Propósito |
|---------|-----------|-----------|
| Log de publicación | `07_Operaciones/logs/` | Traza de ejecución |
| Screenshot debug | `scripts/tmp_*_debug/` | Evidencia visual |
| Estado de pieza | `system/memory/STATE_PROJECT.json` | Estado centralizado |

---

## Naming y Rutas Canónicas

### Estructura de Directorios

```
04_Produccion/
├── {pieza_id}_Brief.md              # Brief original
├── {pieza_id}_PublishReady.md       # Este contrato
└── {pieza_id}_Metadata_Final.md     # Metadatos extendidos

06_Assets/
└── {pieza_id}/
    ├── FG_{pieza_id}_IG_Cover_v{N}_{YYYYMMDD}_{N}.png
    ├── FG_{pieza_id}_TK_Cover_v{N}_{YYYYMMDD}_{N}.png
    ├── FG_{pieza_id}_X_Cover_v{N}_{YYYYMMDD}_{N}.png
    └── EXPORT_MANIFEST_{pieza_id}.json

07_Operaciones/
├── logs/
│   └── publish_{pieza_id}_{timestamp}.log
└── PLATFORM_READINESS_MATRIX.md
```

### Convención de Naming

| Elemento | Pattern | Ejemplo |
|----------|---------|---------|
| Pieza ID | `P{seccion}_{numero}` | `P1_001`, `EP_001` |
| Imagen IG | `FG_{pieza}_IG_{tipo}_v{ver}_{fecha}_{idx}.png` | `FG_P1_001_IG_Cover_v1_20260404_0.png` |
| Imagen TK | `FG_{pieza}_TK_{tipo}_v{ver}_{fecha}_{idx}.png` | `FG_P1_002_TK_Cover_v1_20260405_0.png` |
| PublishReady | `{pieza_id}_PublishReady.md` | `P1_001_PublishReady.md` |

---

## Estados del Ciclo de Publicación

### Diagrama de Estados

```
┌─────────┐    ┌──────────┐    ┌─────────────┐    ┌───────────┐    ┌──────────┐
│  DRAFT  │───→│  REVIEW  │───→│ PUBLISH_READY│───→│ PUBLISHING │───→│PUBLISHED │
└─────────┘    └──────────┘    └─────────────┘    └───────────┘    └──────────┘
     ↑                                                              │
     └──────────────────────── ROLLBACK ───────────────────────────┘
```

### Definición de Estados

| Estado | Descripción | Transiciones Permitidas |
|--------|-------------|------------------------|
| `DRAFT` | Contenido en creación | → `REVIEW` |
| `REVIEW` | En revisión editorial | → `PUBLISH_READY`, → `DRAFT` |
| `PUBLISH_READY` | Aprobado para publicación | → `PUBLISHING` |
| `PUBLISHING` | Publicación en progreso | → `PUBLISHED`, → `ERROR` |
| `PUBLISHED` | Publicado en todas las plataformas target | → (final) |
| `ERROR` | Fallo en publicación | → `PUBLISH_READY` (retry) |
| `PARTIAL` | Publicado en algunas plataformas | → `PUBLISHING` (completar) |

### Gates de Transición

| Transición | Validaciones Requeridas |
|------------|------------------------|
| DRAFT → REVIEW | Assets completos, caption presente |
| REVIEW → PUBLISH_READY | Aprobación editorial, QA checklist pass |
| PUBLISH_READY → PUBLISHING | Sesiones activas validadas, dry-run pass |
| PUBLISHING → PUBLISHED | Confirmación de publicación en todas las plataformas |
| ANY → ERROR | Captura de error, log generado |

---

## Extensiones para n8n (FUTURO - No implementado)

> **IMPORTANTE:** Las siguientes especificaciones son aspiracionales. No implementar hasta tener:
> - Instagram Business Account + token válido
> - X API paga o solución de bridge estable
> - LinkedIn app verificada

### Payload de Entrada (n8n Webhook) - ASPIRACIONAL

```json
{
  "pieza_id": "P1_001",
  "plataformas": ["threads"],
  "dry_run": false,
  "prioridad": "normal",
  "metadata": {
    "autor": "sistema",
    "campania": "cables_submarinos",
    "etiquetas": ["geopolitica", "tecnologia"]
  }
}
```

> **MVP REAL:** Solo `threads` es viable vía API hoy. Instagram y X requieren browser automation local (no n8n). LinkedIn está bloqueado.

### Payload de Salida (n8n Response)

```json
{
  "ok": true,
  "pieza_id": "P1_001",
  "resultados": {
    "threads": {"ok": true, "id": "18216358396316291"}
  },
  "timestamp": "2026-04-05T14:30:00Z",
  "nota": "MVP REAL: Solo Threads vía API. Instagram/X requieren ejecución manual local."
}
```

> **MVP REAL:** Solo `threads` retorna URL real. Otros requieren ejecución manual vía scripts locales.

---

## Referencias

- Template PublishReady: `04_Produccion/P1_001_PublishReady.md`
- Scripts de publicación: `scripts/*_publish_post.py`
- Matrix de plataformas: `07_Operaciones/PLATFORM_READINESS_MATRIX.md`
- Control Plane: `07_Operaciones/LOCAL_CONTROL_PLANE.md`
