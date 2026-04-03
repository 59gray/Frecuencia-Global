# Platform Web Audit and Post Test Readiness

**Sistema:** Frecuencia Global  
**Fecha:** 2026-04-02  
**Objetivo:** auditar la identidad visible en web y dejar una base clara para iniciar pruebas de posteo.

---

## 1. Resumen ejecutivo

| Superficie | Estado publico | Veredicto de identidad | Estado para pruebas |
|---|---|---|---|
| Website | Preview publico operativo, title/description coherentes, links a redes correctos | `Parcialmente alineado` | `Bloqueado` por canonical que apunta a un dominio con `401` |
| Instagram | Handle correcto, bio correcta, avatar presente, display name no visible, `0 posts` | `Parcial` | `No listo` |
| Threads | Handle correcto, bio correcta, `0 threads`, solo se detecta link a YouTube | `Parcial` | `No listo` |
| TikTok | Handle correcto, avatar presente, bio correcta, display name sigue como handle, `0 videos` | `Parcial` | `No listo` |
| LinkedIn | Company page activa, sector/tamano definidos, website apunta a YouTube en vez del sitio | `Inconsistente` | `No listo` |
| YouTube | Canal activo, nombre correcto, vanity URL resuelve, descripcion vacia | `Parcial` | `No listo` |
| X | Validado manualmente en modo incognito el `2026-04-02`; identidad visible correcta | `Alineado` | `Listo para prueba` |

---

## 2. Hallazgos publicos

### 2.1 Website

- URL revisada: `https://website-three-rho-26.vercel.app/`
- Title publico: `Frecuencia Global — Análisis internacional a otro ritmo — Frecuencia Global`
- Description publica: `Geopolítica, cultura y tecnología con estética de club nocturno. Análisis internacional para una nueva generación.`
- Footer publico con links correctos a:
  - `https://instagram.com/globalfrequency.es`
  - `https://youtube.com/@FrecuenciaGlobal`
  - `https://tiktok.com/@frecuenciaglobal`
  - `https://x.com/frec_global`
  - `https://www.linkedin.com/company/frecuencia-global`
- Hallazgo critico:
  - El `canonical` del sitio sigue apuntando a `https://frecuenciaglobal.vercel.app/`
  - Ese dominio responde `401 Unauthorized`
  - Para pruebas de posteo y previews, el URL operativo hoy es `https://website-three-rho-26.vercel.app`

### 2.2 Instagram

- URL revisada: `https://www.instagram.com/globalfrequency.es/`
- Handle visible: `@globalfrequency.es`
- Bio publica detectada:
  - `Análisis internacional con pulso electrónico`
  - `Geopolítica × música electrónica × datos`
- Estado publico detectado:
  - `1 follower`
  - `0 posts`
- Hallazgo critico:
  - El `og:title` no expone display name antes del handle
  - Eso sugiere que el nombre visible del perfil sigue vacio o no se guardo correctamente

### 2.3 Threads

- URL revisada: `https://www.threads.com/@globalfrequency.es`
- Handle visible: `@globalfrequency.es`
- Bio publica detectada:
  - `Análisis internacional con pulso electrónico`
  - `Geopolítica × música electrónica × datos`
- Estado publico detectado:
  - `0 Followers`
  - `0 Threads`
- Hallazgos:
  - El title publico muestra solo `@globalfrequency.es`
  - No aparece un display name visible en metadata publica
  - El unico `rel="me"` detectado publicamente es `https://youtube.com/@FrecuenciaGlobal`
  - No se detectan publicamente links a website, X, TikTok o LinkedIn

### 2.4 TikTok

- URL revisada: `https://www.tiktok.com/@frecuenciaglobal`
- Handle publico: `@frecuenciaglobal`
- Display name publico detectado en metadata:
  - `nickname = frecuenciaglobal`
- Bio publica detectada:
  - `Análisis internacional con pulso electrónico`
  - `Geopolítica, cultura y poder`
- Estado publico detectado:
  - `0 Followers`
  - `0 Following`
  - `0 Likes`
  - `0 videos`
- Hallazgo critico:
  - El nombre visible sigue sin humanizarse a `Frecuencia Global`
  - Segun restriccion actual de la cuenta, ese cambio no se podra hacer hasta despues del `2026-04-05`

### 2.5 LinkedIn

- URL revisada: `https://www.linkedin.com/company/frecuencia-global/`
- Title publico: `Frecuencia Global | LinkedIn`
- Website publico detectado:
  - redirecciona a `https://www.youtube.com/@frecuencia.global`
- Industry publica:
  - `Online Audio and Video Media`
- Company size publica:
  - `1 employee`
- Hallazgo critico:
  - El campo `Website` esta mal configurado para la etapa actual
  - Debe apuntar temporalmente a `https://website-three-rho-26.vercel.app`
  - El URL actual hacia YouTube ademas usa un handle con punto (`@frecuencia.global`) que no coincide con el estandar del sistema (`@FrecuenciaGlobal`)

### 2.6 YouTube

- URL revisada: `https://www.youtube.com/@FrecuenciaGlobal`
- Title publico: `Frecuencia Global`
- Vanity URL resuelta por metadata publica:
  - `http://www.youtube.com/@frecuenciaglobal`
- RSS publico:
  - `https://www.youtube.com/feeds/videos.xml?channel_id=UCpGHGplr9uX0o2QHjArQQYQ`
- Hallazgo critico:
  - La `description` publica del canal esta vacia
  - Falta terminar la capa basica de identidad del canal antes de usarlo como link principal de perfil en otras redes

### 2.7 X

- URL objetivo: `https://x.com/frec_global`
- Hallazgo:
  - El fetch publico de X es inestable desde este entorno por la capa de carga y protecciones del sitio
  - La validacion manual en incognito del `2026-04-02` confirma:
    - nombre correcto `Frecuencia Global`
    - handle correcto `@frec_global`
    - avatar y banner correctos
    - bio nueva visible
    - sin publicaciones nuevas aun
  - El snapshot tecnico anterior en `scripts/tmp_x_diag/diag.json` queda como evidencia historica, pero ya no es el estado operativo vigente

---

## 3. Bloqueadores P0 antes de pruebas

1. Unificar temporalmente todos los links de perfil al URL publico que si responde hoy:
   - `https://website-three-rho-26.vercel.app`
2. Corregir el `canonical` del website para que no apunte a un dominio con `401`.
3. Instagram:
   - Guardar display name exacto `Frecuencia Global`
4. Threads:
   - Guardar display name exacto `Frecuencia Global`
   - Agregar links de website, X, TikTok y LinkedIn
5. TikTok:
   - Cambiar display name a `Frecuencia Global`
   - Esperar a que se libere completamente el lockout para hacer la prueba privada
   - Considerar este punto bloqueado hasta despues del `2026-04-05`
6. LinkedIn:
   - Reemplazar el field `Website` por `https://website-three-rho-26.vercel.app`
7. YouTube:
   - Agregar descripcion corta y links base del ecosistema
8. Definir dominio final:
   - mientras se registra un dominio mas simple y el sitio definitivo, mantener el preview URL como destino operativo temporal

---

## 4. Preparacion para pruebas de posteo

### 4.1 Secuencia recomendada

1. `LinkedIn`
   - Primer test: post solo texto
   - Motivo: menor friccion tecnica y utilidad alta para validar copy y link
2. `Instagram`
   - Primer test: story placeholder o close friends story
   - Motivo: valida identidad, highlights y compresion sin contaminar el feed
3. `Threads`
   - Primer test: post de presentacion corto
   - Motivo: perfil vacio, cero riesgo tecnico, buena plataforma para warm-up
4. `X`
   - Primer test: post corto o thread corto
5. `TikTok`
   - Primer test: upload privado `solo yo` cuando se levante el bloqueo
6. `YouTube`
   - Dejar primero la metadata lista; no usar como plataforma activa de prueba hasta tener pieza real

### 4.2 Estado de workflows n8n

- `WF-007` X:
  - Workflow existe
  - Aun falta prueba operativa real
- `WF-008` Instagram:
  - Bloqueado por `IG_PUBLISH_WEBHOOK_URL`
- `WF-009` LinkedIn:
  - Bloqueado por `LINKEDIN_AUTHOR_URN`
- `WF-010` TikTok:
  - Bloqueado por `TIKTOK_PUBLISH_WEBHOOK_URL`

### 4.3 Variables pendientes

Archivo: `08_n8n/.env.cloud`

- `IG_PUBLISH_WEBHOOK_URL=`
- `TIKTOK_PUBLISH_WEBHOOK_URL=`
- `LINKEDIN_AUTHOR_URN=`

Mientras esos tres sigan vacios, X queda como la unica superficie con workflow de publicacion mas cerca de ser testeada.

---

## 5. Accion inmediata sugerida

### P0 hoy

1. Corregir manualmente en plataforma:
   - Instagram display name
   - Threads display name + links
   - TikTok display name
   - LinkedIn website
2. Validar manualmente X en incognito o logged-out
3. Mantener `https://website-three-rho-26.vercel.app` como URL de perfil para pruebas

### P1 siguiente sesion

1. Ejecutar test de LinkedIn
2. Ejecutar test de Instagram story
3. Ejecutar test de Threads
4. Ejecutar test de X
5. Reintentar TikTok solo despues del enfriamiento

---

## 6. Veredicto

**Estado actual:** `IDENTIDAD PARCIALMENTE DEFINIDA, NO LISTA TODAVIA PARA PRUEBAS DE POSTEO FULL`

**Lectura operativa:**

- El sistema visual ya esta bastante alineado entre sitio, Instagram, Threads y TikTok
- Los gaps reales ya no son de diseño; son de `campos mal configurados`, `links inconsistentes`, `metadata incompleta` y `credenciales de publicacion`
- X ya quedo suficientemente validado para prueba controlada
- TikTok queda condicionado por la restriccion de cambio de nombre hasta despues del `2026-04-05`
- Si se completan los P0 restantes, el arranque de pruebas puede comenzar por `LinkedIn -> Instagram -> Threads -> X -> TikTok`
