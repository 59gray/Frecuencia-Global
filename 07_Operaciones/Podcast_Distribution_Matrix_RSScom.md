# PODCAST DISTRIBUTION MATRIX - RSS.com

**Proyecto:** Frecuencia Global Podcast  
**Fecha de verificacion:** 2026-04-02  
**Host principal:** RSS.com

---

## Objetivo

Definir una estrategia practica para distribuir `Frecuencia Global Podcast` en la mayor cantidad de plataformas relevantes sin duplicar trabajo ni romper el flujo editorial.

---

## Capas de distribucion

### 1. Prioridad inmediata

Estas deben quedar activas primero:

- RSS.com show page
- RSS feed publico
- Spotify
- Apple Podcasts
- Amazon Music

### 2. Prioridad de descubrimiento

Estas amplian alcance y SEO interno del podcast:

- Podcast Index
- Listen Notes

### 3. Prioridad de expansion

Estas requieren pasos guiados o submission manual:

- YouTube Podcasts / YouTube Music
- Pandora
- iHeartRadio
- Deezer
- TuneIn / Alexa
- Stitcher

---

## Estrategia recomendada

### Ruta A - Distribucion automatica desde RSS.com

Usar primero la distribucion automatica de RSS.com para:

- Apple Podcasts
- Spotify
- Amazon Music
- Podcast Index
- Listen Notes

Esta ruta reduce friccion y nos deja el feed base funcionando rapido.

### Ruta B - Distribucion guiada o manual

Despues de publicar el show y al menos un episodio:

- Pandora
- iHeartRadio
- Deezer
- TuneIn / Alexa
- Stitcher

Estas plataformas suelen requerir pegar el feed RSS manualmente, verificar ownership o guardar la URL del perfil resultante.

### Ruta C - YouTube

Hay dos opciones:

1. Publicar el videopodcast largo de forma nativa en YouTube.
2. Usar la integracion de RSS.com con YouTube para convertir audio a video.

Para Frecuencia Global se recomienda:

- mantener `YouTube` como canal nativo del videopodcast largo
- usar `RSS.com` como host principal del audio
- no depender de la conversion automatica de RSS.com para el videopodcast principal

Motivo:

- nuestro formato requiere visualizer editorial, thumbnails, capitulos, branding y clips derivados
- RSS.com sirve muy bien para audio y feed
- YouTube sigue siendo mejor como superficie de video controlada manualmente

---

## Matriz operativa

| Plataforma | Tipo | Estado recomendado | Accion |
|------------|------|--------------------|--------|
| RSS.com | Host principal | Obligatoria | Crear show y feed publico |
| Spotify | Automatica RSS.com | Obligatoria | Activar y luego reclamar show |
| Apple Podcasts | Automatica RSS.com | Obligatoria | Activar y luego reclamar show |
| Amazon Music | Automatica RSS.com | Obligatoria | Activar |
| Podcast Index | Automatica RSS.com | Recomendada | Activar |
| Listen Notes | Automatica RSS.com | Recomendada | Activar |
| YouTube | Canal nativo | Obligatoria | Subida manual del videopodcast |
| Pandora | Guiada/manual | Recomendada | Submit con feed RSS |
| iHeartRadio | Guiada/manual | Recomendada | Submit con feed RSS |
| Deezer | Guiada/manual | Recomendada | Submit con feed RSS |
| TuneIn / Alexa | Guiada/manual | Opcional | Submit cuando reabran aceptacion |
| Stitcher | Manual | Baja prioridad | Solo si sigue siendo relevante al momento |

---

## Orden de ejecucion

1. Crear show en RSS.com
2. Publicar cover, metadata y primer episodio
3. Activar distribucion automatica
4. Reclamar Spotify y Apple Podcasts
5. Subir videopodcast largo a YouTube
6. Enviar manualmente a Pandora, iHeartRadio y Deezer
7. Revisar TuneIn / Alexa segun disponibilidad actual

Checklist detallado:

- `07_Operaciones/RSScom_Launch_Checklist.md`

---

## Datos que debemos registrar

Guardar en variables o tracker:

- `FG_PODCAST_SHOW_URL`
- `FG_PODCAST_RSS_URL`
- URL Spotify del show
- URL Apple Podcasts del show
- URL Amazon Music del show
- URL YouTube playlist o canal del podcast
- URL Pandora del show
- URL iHeart del show
- URL Deezer del show

---

## Decision actual

`Frecuencia Global Podcast` operara asi:

- audio hosteado en RSS.com
- distribucion automatica a plataformas principales
- videopodcast largo subido manualmente a YouTube
- pagina web usada como soporte editorial, no como dependencia critica del feed
