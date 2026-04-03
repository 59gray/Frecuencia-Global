# RSS.com Podcast Setup

**Objetivo:** usar `RSS.com` como host principal del podcast de Frecuencia Global y dejar el `website` como soporte editorial opcional.

---

## Decisión operativa

- `RSS.com` es el host principal del audio.
- `RSS.com` entrega el feed para Spotify, Apple Podcasts y demás directorios.
- `YouTube` sigue siendo la salida del videopodcast largo.
- El `website` puede enlazar episodios, show notes y embeds, pero no bloquea la distribución.

---

## Datos que debemos guardar

Cuando el show esté creado en RSS.com, registrar estos valores:

- `FG_PODCAST_HOST=rss.com`
- `FG_PODCAST_SHOW_URL=<url publica del show en RSS.com>`
- `FG_PODCAST_RSS_URL=<feed xml publico del show en RSS.com>`

Slug provisional recomendado de marca:

- `FG_PODCAST_SLUG=frecuencia-global-podcast`
- show provisional: `https://rss.com/podcasts/frecuencia-global-podcast`
- feed provisional: `https://media.rss.com/frecuencia-global-podcast/feed.xml`

Recomendado: guardarlos en variables de entorno usadas por scripts y workflows.

---

## Uso en el sistema

- `WF-001` debe tratar `RSS.com` como salida principal de audio para episodios `EP_###`.
- `WF-006` debe generar `PublishReady` con:
  - show principal en RSS.com
  - feed RSS principal
  - pagina editorial opcional
  - metadata para YouTube y derivados sociales
- `scripts/n8n_platform_healthcheck.py` debe validar el show y feed de RSS.com.
- Ver matriz recomendada de alcance en `07_Operaciones/Podcast_Distribution_Matrix_RSScom.md`.
- Usar `07_Operaciones/RSScom_Launch_Checklist.md` como checklist de alta y claim inicial.

---

## Criterio de publicación

Un episodio se considera listo para distribución cuando existen:

- audio master final
- portada cuadrada
- show notes
- URL publica del show o episodio en RSS.com
- feed RSS funcional
- paquete YouTube listo
- clips derivados listos

---

## Pendientes al crear la cuenta

- Crear show `Frecuencia Global Podcast`
- Definir portada y categoría
- Obtener URL pública del show
- Obtener feed XML público
- Conectar Spotify y Apple Podcasts
- Copiar los valores a las variables `FG_PODCAST_SHOW_URL` y `FG_PODCAST_RSS_URL`
