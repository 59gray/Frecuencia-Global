# D37 — Paquete Buffer (Detroit OG v02)

**Estado:** preparación únicamente — **no publicar**, **no programar en Buffer**, **sin APIs**, **sin credenciales**, **sin deploy**, **sin cambios de producto**, **sin Notion**.

**Fecha:** 2026-04-27

---

## Referencias canónicas

| Campo | Valor |
|--------|--------|
| **URL artículo (www)** | `https://www.frecuenciaglobal.org/contenido/techno-detroit-historia-musica-electronica/` |
| **OG validado (ruta relativa)** | `/images/articles/FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png` |
| **OG absoluto (apex, coherente con metas)** | `https://frecuenciaglobal.org/images/articles/FG_DETROIT_P2_IMG_OG_v02_BILLBOARD_CANONICAL.png` |
| **Asset fallback (card social, cuadrado / feed)** | `https://frecuenciaglobal.org/images/articles/FG_DETROIT_P2_IMG_CARD_SOCIAL_v01_20260502_CANONICAL.png` |
| **Título corto (marca)** | El techno nació en Detroit, no en Berlín |

---

## Modos de publicación

| Modo | Cuándo | Qué usar |
|------|--------|----------|
| **Link post** | Plataforma muestra preview OG al pegar URL | Solo URL + copy; preview debe tomar OG v02 |
| **Media post** | Preview roto, recorte feo o política de red que favorece imagen nativa | Subir **fallback** + URL al final del caption (o primer comentario si la red lo permite) |

---

## LinkedIn

| Campo | Contenido |
|-------|-----------|
| **Modo recomendado** | **Link post** (OG verificado en Post Inspector — D36) |
| **Título corto** | El techno nació en Detroit, no en Berlín |
| **Caption** | Detroit no es un adorno en la historia del techno: es matriz negra y urbana donde el género tomó forma antes de volverse “visible” en Europa. Artículo sobre origen, memoria y cómo se cuenta el presente del techno. |
| **Hashtags mínimos** | `#Techno` `#Detroit` `#MusicaElectronica` `#Cultura` |
| **URL** | `https://www.frecuenciaglobal.org/contenido/techno-detroit-historia-musica-electronica/` |
| **Asset fallback** | `https://frecuenciaglobal.org/images/articles/FG_DETROIT_P2_IMG_CARD_SOCIAL_v01_20260502_CANONICAL.png` |
| **Notas de riesgo** | Preview puede pasar por CDN LinkedIn (normal). Si el thumbnail no refresca: inspeccionar URL en Post Inspector y repetir Inspect; como último recurso, **media post** con card + link en última línea. |

---

## Facebook

| Campo | Contenido |
|-------|-----------|
| **Modo recomendado** | **Link post** (Sharing Debugger OK — D36; aviso opcional `fb:app_id`) |
| **Título corto** | El techno nació en Detroit, no en Berlín |
| **Caption** | ¿Por qué el mapa del techno suele arrancar en Europa y no donde empezó la escena? Una lectura desde Detroit: ciudad-fábrica, memoria y cómo se proyecta el género hoy. |
| **Hashtags mínimos** | `#Techno` `#Detroit` `#MusicaElectronica` |
| **URL** | `https://www.frecuenciaglobal.org/contenido/techno-detroit-historia-musica-electronica/` |
| **Asset fallback** | Mismo card social (arriba) u OG v02 si Buffer permite imagen 1200×630 |
| **Notas de riesgo** | Caché de Meta: si el preview es viejo, usar Sharing Debugger → **Scrape Again** antes de programar. |

---

## X (Twitter)

| Campo | Contenido |
|-------|-----------|
| **Modo recomendado** | **Link post** primero (`twitter:card` = `summary_large_image` validado en Card Validator — D36). **Media post** si el composer no muestra bien la imagen. |
| **Título corto** | Detroit ≠ la única historia del techno |
| **Caption (≤ ~240 chars útiles dejando margen)** | Detroit como matriz del techno —no solo mitos europeos. Lectura FG sobre memoria, escena y cómo se cuenta el género 👇 |
| **Hashtags mínimos** | `#Techno #Detroit` (opcional `#FG`; evitar sobrecarga por límite) |
| **URL** | `https://www.frecuenciaglobal.org/contenido/techno-detroit-historia-musica-electronica/` |
| **Asset fallback** | Card social (mejor legibilidad en móvil) o crop de OG v02 si Buffer recorta mal |
| **Notas de riesgo** | Validador oficial prioriza **log**; vista previa gráfica → **Tweet Composer**. Conteo de caracteres con URL acortada por X al publicar. |

---

## Threads

| Campo | Contenido |
|-------|-----------|
| **Modo recomendado** | **Media post + URL en texto** suele funcionar mejor que link-only en muchas cuentas; si el preview enlazado es correcto, probar primero **link post** ligero. |
| **Título corto** | Detroit y el techno |
| **Caption** | Detrás del club europeo está otra historia: Detroit como origen material del techno. Pieza FG — lectura corta, densidad grande. |
| **Hashtags mínimos** | `#Techno` `#Detroit` `#FrecuenciaGlobal` |
| **URL** | `https://www.frecuenciaglobal.org/contenido/techno-detroit-historia-musica-electronica/` |
| **Asset fallback** | **Card social** (formato más estable en feed vertical) |
| **Notas de riesgo** | Menos garantía de preview OG que FB/LI; preparar siempre imagen adjunta. Evitar duplicar asset si Meta ya muestra bien el link en cruces Instagram/Threads según política vigente de la cuenta. |

---

## Mapa rápido — modo por plataforma

| Plataforma | Modo prioritario | Fallback |
|------------|------------------|----------|
| LinkedIn | Link post | Media + link |
| Facebook | Link post | Media + link |
| X | Link post | Media + link |
| Threads | Media + link (o link si preview OK) | Card social |

---

## Checklist antes de publicar / programar en Buffer

1. [ ] Confirmar URL en navegador (200, artículo correcto).
2. [ ] Opcional: repetir **Meta Sharing Debugger** → Scrape Again si hubo cambios recientes de OG.
3. [ ] Opcional: **LinkedIn Post Inspector** → Inspect si el último deploy fue después del último scrape.
4. [ ] Copiar captions desde este doc; revisar límites de caracteres por red en Buffer.
5. [ ] Si **media post**: tener descargados OG v02 y/o card fallback para subir sin depender del CDN del sitio en Buffer.
6. [ ] Horario y zona horaria revisados en Buffer (sin disparar hasta autorización explícita).
7. [ ] No pegar tokens ni credenciales en notas Buffer/comentarios internos.

---

## Pendientes explícitos (fuera de este archivo)

- **Autorización** para crear cuenta/envío Buffer o conectar cuentas (no hecho aquí).
- **Commit** de este archivo en git solo si se autoriza (D37 regla: sin commit automático).
