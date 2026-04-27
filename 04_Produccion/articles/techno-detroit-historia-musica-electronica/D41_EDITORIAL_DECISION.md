# D41 — Decisión de alcance editorial — Detroit Techno

- **Pieza:** `techno-detroit-historia-musica-electronica` — piloto web P2 / Bass & Borders  
- **Fecha decisión:** 2026-04-27  
- **Estado:** cerrado documentalmente (solo texto; sin APIs, sin deploy, sin redes, sin nuevas imágenes)

---

## Decisión

**Opción elegida: A — Versión corta web verificada** como **alcance oficial del piloto P2** para esta pieza en el repo actual.

La expansión a **texto largo editorial** queda **fuera de este ticket** y sujeta a backlog explícito (research + tiempo de edición dedicado), no a improvisación incremental.

---

## Justificación editorial

1. **Función piloto:** Detroit ya valida cadena investigación → canon (D39) → manifiesto visual (D40) → lectura web con hero, tres inlines y embed primario. El objetivo actual es **calibrar flujo** y límites verificados, no publicar el inventario completo del `EDITORIAL_BRIEF_VERIFIED`/`CLAIM_LEDGER`.

2. **Verificación donde está el cuerpo:** Los anclajes fuertes en línea están acotados (embed Kevin Saunderson; callout Heaven/DSC con URL; callout UMA). El pie declara límites sobre claims amplios — práctica correcta para corto verificado.

3. **Ritmo y claridad:** ~825 palabras en cuerpo (aprox.; fuente `website/src/content/articles/techno-detroit-historia-musica-electronica.md`). El arco respeta el esquema del canon (mapa imaginario → matriz Detroit → Berlín → memoria institucional → futuro/UMA → cierre prospectivo). Ampliar sin nueva investigación cerrada tendería a **densidad cosmética** frente al ledger.

4. **Canon & brief:** `DETROIT_CANON_PACK.md` ya reconoce la tensión **densidad brief vs texto corto** como elección deliberada; D41 formaliza que, **para el piloto**, esa tensión se resuelve **a favor del texto corto**, manteniendo ledgers como capa de profundidad separada del HTML.

---

## Riesgos de descartar ahora la opción B (texto largo)

| Riesgo | Mitigación sin convertir la pieza en largo ya |
|--------|-----------------------------------------------|
| Lectura “ligera” frente al volumen investigado | Homepage del tema = pieza corta + **ledgers/brief internos** como soporte; lectura extendida opcional fuera del artículo |
| **PROHIBIDO-04** (ecología más allá del trío): nombre listado incluye Heaven y Mojo en contexto; Collier/Hale menos visibles | Micro-estabilización futura (una frase anclada a fuente) o párrafo corto solo si ledger lo permite en bloque homogéneo |
| Pie de fuentes percibido como provisional | Lista mínima de URLs en cuerpo **o** disclaimer explícito ya presente — puede reforzarse en ticket editorial micro sin cambiar alcance largo |

---

## Cambios mínimos recomendados (post-D41; no ejecutados aquí)

Ordenados por impacto / esfuerzo; ninguno obliga texto largo.

1. **Estabilización** (preferida frente a recorte): revisar pie de fuentes vs **ZG-01** (enlace oficial UMA en cuerpo o pie si se afirma continuidad institucional); mantener tono “claim acotado”.
2. **Opcional micro:** una sola frase que nombre la **ecología** (radio/club/sellos/personas en red) sin abrir subsecciones nuevas — solo si cada nombre lleva correspondencia en `CLAIM_LEDGER`/`SOURCE_LEDGER`.
3. **No recortar secciones** salvo redundancia objetiva detectada en pasada humana; el texto ya es compacto.

---

## Si en el futuro se optara por texto largo — estructura propuesta (referencia)

*No implementar en D41.* Esqueleto para backlog cuando el objetivo sea “pieza referencia” y no piloto:

1. Gancho (imaginario europeo vs práctica Detroit) — *expandir con datos de reception/canon mediático solo con fuentes*.  
2. Matriz Detroit: Belleville + **Electrifying Mojo** (párrafo propio) + sintetizadores/radio con cita RBMA/Carnegie.  
3. Ecología no exclusiva del trío: Collier, Hale, Heaven — párrafos cortos con fuente cada uno.  
4. Contrapeso Berlín (1989+, mercado, visibilidad) sin caricatura — alinear con **C05/C06**.  
5. Influencias cruzadas (**ZG-02, ZG-03**) en subsección breve con vector Mojo/Kraftwerk y Chicago/May si el ledger lo sostiene.  
6. Continuidad: UR, Submerge, Movement, UMA — solo claims con fuente en línea.  
7. Cierre + pie de fuentes con **listado URL** alineado al cuerpo.

---

## Qué NO debe tocarse en una micro-edición posterior

- Rutas y convención `FG_DETROIT_P2_*_CANONICAL` (`ASSETS_MANIFEST.md`, `ARTICLE_VISUAL_BRIEF.md`).  
- Arquitectura de figuras y orden visual acordado en QA.  
- Tesis central y tono P2 “función en el sistema” (matriz vs visibilidad).  
- Embed de Kevin Saunderson como ancla de voz primaria.  
- Pieza como **piloto web**, no como paquete de redes.

---

## Próximo ticket sugerido

**D42 — OG v01 vs OG v02 billboard:** alinear `ogImage` del frontmatter con la estrategia documentada en ops/manifiesto o ratificar doble uso explícito.
