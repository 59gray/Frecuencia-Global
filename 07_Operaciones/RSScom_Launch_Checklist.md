# RSS.com Launch Checklist

**Proyecto:** Frecuencia Global Podcast  
**Fecha:** 2026-04-03  
**Host principal:** RSS.com

---

## Objetivo

Checklist operativo para:

- crear el show en RSS.com
- publicar el primer episodio
- activar la distribucion automatica
- reclamar Spotify y Apple Podcasts
- registrar enlaces finales en el sistema

---

## Datos objetivo

Usar esta identidad inicial:

- Titulo: `Frecuencia Global Podcast`
- Slug deseado: `frecuencia-global-podcast`
- Autor: `Frecuencia Global`
- Idioma: `es-MX`
- Formato: `episodic`
- Explicit: `false`

URLs esperadas:

- Show: `https://rss.com/podcasts/frecuencia-global-podcast`
- Feed: `https://media.rss.com/frecuencia-global-podcast/feed.xml`

---

## Fase 1 - Crear cuenta y show

- [ ] Crear o validar cuenta en RSS.com
- [ ] Validar el email de la cuenta
- [ ] Crear un `New podcast`
- [ ] Capturar el titulo `Frecuencia Global Podcast`
- [ ] Capturar una descripcion corta del show
- [ ] Intentar reservar el slug `frecuencia-global-podcast`
- [ ] Cargar cover art oficial
- [ ] Elegir categoria primaria
- [ ] Elegir idioma `es-MX`
- [ ] Guardar show

Campos sugeridos:

- Descripcion corta:
  `Analisis internacional, cultura y tecnologia con salida en audio podcast y videopodcast en YouTube.`

- Categoria primaria sugerida:
  `News`

- Categoria secundaria sugerida:
  `Politics` o `Technology`

---

## Fase 2 - Publicar el primer episodio

- [ ] Crear episodio `EP_001`
- [ ] Subir audio master
- [ ] Titulo del episodio cargado
- [ ] Show notes cargadas
- [ ] Temporada y numero de episodio cargados
- [ ] Marcar `Full episode`
- [ ] Marcar explicit si aplica
- [ ] Guardar draft
- [ ] Publicar episodio

Checklist de episodio minimo:

- [ ] audio final
- [ ] portada del show lista
- [ ] description/show notes listas
- [ ] season/episode number listos
- [ ] CTA y links base listos

---

## Fase 3 - Activar distribucion automatica

Precondicion:

- [ ] cover art lista
- [ ] al menos 1 episodio publicado

Plataformas que RSS.com reporta como distribucion automatica:

- [ ] Apple Podcasts
- [ ] Spotify
- [ ] Amazon Music
- [ ] Podcast Index
- [ ] Listen Notes

Pasos:

- [ ] Ir a `Distribution`
- [ ] Click en `Submit now`
- [ ] Aceptar terminos requeridos
- [ ] Confirmar estados en dashboard

Registrar estados:

- [ ] Apple = `Processing` o `Active`
- [ ] Spotify = `Processing` o `Active`
- [ ] Amazon Music = `Processing` o `Active`
- [ ] Podcast Index = `Processing` o `Active`
- [ ] Listen Notes = `Processing` o `Active`

---

## Fase 4 - Reclamar Spotify

Precondiciones:

- [ ] Spotify ya aparece `Active` en RSS.com
- [ ] Cuenta normal de Spotify creada
- [ ] Email temporalmente visible en el feed RSS de RSS.com

Pasos:

- [ ] En RSS.com habilitar el email en el feed
- [ ] Ir a `Spotify for Creators`
- [ ] `Get Started`
- [ ] Elegir `I have a podcast`
- [ ] Elegir `Somewhere else`
- [ ] Login con cuenta Spotify
- [ ] Pegar la URL del feed RSS
- [ ] Pedir envio del codigo
- [ ] Recuperar el codigo por email
- [ ] Verificar codigo
- [ ] Completar idioma, ubicacion y categoria
- [ ] Enviar solicitud

Resultado esperado:

- [ ] Show reclamado en Spotify for Creators
- [ ] Analytics propias visibles

Notas:

- RSS.com indica que el email visible en el feed dura 12 horas

---

## Fase 5 - Reclamar Apple Podcasts

Precondiciones:

- [ ] Apple aparece `Active` y `Unclaimed` en RSS.com
- [ ] Apple ID listo

Pasos:

- [ ] Copiar la URL de Apple Podcasts desde RSS.com
- [ ] Entrar a Apple Podcasts Connect
- [ ] Ir a `My Podcasts`
- [ ] `Claim Existing Show`
- [ ] Pegar la URL del show en Apple
- [ ] Seleccionar el show
- [ ] Generar token
- [ ] Copiar token
- [ ] Volver a RSS.com
- [ ] Pegar token en la seccion de Apple Podcasts

Resultado esperado:

- [ ] Apple verifica el token
- [ ] El show se mueve a tu cuenta
- [ ] Acceso directo a analytics y ajustes de Apple

Notas:

- El token vale 7 dias
- RSS.com indica que la verificacion puede tardar 24 horas y el traspaso varios dias

---

## Fase 6 - Expansion a mas plataformas

Despues de Spotify y Apple:

- [ ] Amazon Music confirmado
- [ ] Podcast Index confirmado
- [ ] Listen Notes confirmado
- [ ] Pandora enviado
- [ ] iHeartRadio enviado
- [ ] Deezer enviado
- [ ] TuneIn / Alexa revisado

No enviar manualmente a apps que auto-descubren desde Apple o Podcast Index, salvo que haga falta:

- Overcast
- Pocket Casts
- Castro
- Player FM
- Podcast Addict

---

## Fase 7 - Registrar links finales en Frecuencia Global

Actualizar estas variables:

- [ ] `FG_PODCAST_SHOW_URL`
- [ ] `FG_PODCAST_RSS_URL`

Actualizar estos campos o lugares:

- [ ] `08_n8n/.env`
- [ ] `08_n8n/.env.cloud`
- [ ] `04_Produccion/EP_001_PublishReady.md`
- [ ] tracker / docs operativos si aplica

Comando util cuando ya tengas los valores reales:

```powershell
python scripts/podcast_apply_launch_values.py `
  --podcast-show-url "https://rss.com/podcasts/tu-show-real" `
  --podcast-rss-url "https://media.rss.com/tu-show-real/feed.xml" `
  --n8n-api-key "n8n_xxx" `
  --github-pat "ghp_xxx"
```

Links finales a guardar:

- [ ] RSS.com show
- [ ] RSS feed
- [ ] Spotify show
- [ ] Apple Podcasts show
- [ ] Amazon Music show
- [ ] YouTube videopodcast
- [ ] Pandora show
- [ ] iHeartRadio show
- [ ] Deezer show

---

## Fuentes oficiales

- RSS.com create show:
  `https://help.rss.com/en/support/solutions/articles/44000545708-how-do-i-create-my-first-podcast-`
- RSS.com create first episode:
  `https://help.rss.com/en/support/solutions/articles/44000495445-how-do-i-create-my-first-episode-`
- RSS.com automatic distribution:
  `https://help.rss.com/en/support/solutions/articles/44002320053-how-to-automatically-submit-my-podcast-to-all-podcast-directories`
- RSS.com claim Spotify:
  `https://help.rss.com/en/support/solutions/articles/44002440660-how-do-i-claim-my-rss-com-feed-on-spotify-for-creators-`
- RSS.com enable email in feed:
  `https://help.rss.com/en/support/solutions/articles/44002405274-how-to-enable-the-email-address-in-the-rss-feed`
- RSS.com claim Apple:
  `https://help.rss.com/en/support/solutions/articles/44002582104-how-to-claim-your-show-on-apple-podcasts-`
- RSS.com automatic vs guided distribution:
  `https://help.rss.com/en/support/solutions/articles/44002320093-what-s-the-difference-between-automatic-and-guided-distribution-`
