# WEBSITE SOURCE OF TRUTH — RECOVERY RECORD
**Fecha:** 2026-04-25 / Verificado: 2026-04-26  
**Estado:** ESTABLE — fuente real identificada y documentada

---

## Situación

Durante una sesión de limpieza local se ejecutó `git checkout HEAD -- website`. Esto restauró el
directorio `website/` desde la rama `main`, que está **3 commits por detrás** de la rama activa.
El resultado fue que el sitio local dejó de verse como producción.

### Por qué `git checkout HEAD -- website` rompió el sitio

`HEAD` en ese momento apuntaba al mismo commit que `main` (`949d702`), pero la rama activa de
trabajo (y la versión desplegada en producción) es `rescue/restore-home-production-look-20260425`,
que tiene 3 commits adicionales de fix visual. Al hacer checkout de `website/` desde `main` se
sobreescribieron los 4 archivos que contienen los fixes.

---

## Ramas y hashes

| Ref | Hash (full) | Hash (short) | Estado |
|-----|-------------|--------------|--------|
| `rescue/restore-home-production-look-20260425` | `c2a8155245ae716a4fc9bdd84da03c99375edf14` | `c2a8155` | **FUENTE REAL — HEAD actual** |
| `main` (local + origin) | `949d70202794186829e1e5c5789cd1e26de02e99` | `949d702` | DESACTUALIZADO — 3 commits atrás |

### Diferencia main → rescue (0 commits en main que rescue no tenga)

```
git rev-list --left-right --count main...rescue/...
0   3
```

### Archivos modificados en rescue que main no tiene

```
M  website/src/components/Header.astro
M  website/src/components/editorial/FeaturedBlock.astro
M  website/src/components/editorial/HomeFold.astro
M  website/src/components/editorial/TopicChips.astro
```

### Commits exclusivos de rescue (más nuevo → más viejo)

| Hash | Mensaje |
|------|---------|
| `c2a8155` | fix: remove all remaining line-clamp instances causing vertical text collapse |
| `9717570` | fix: remove line-clamp and break-words causing vertical collapse in FeaturedBlock and TopicChips |
| `f433362` | fix: restore home production layout - header copy SEÑAL CENTRAL / PILARES / SOBRE |

---

## Resultado del build (2026-04-26)

```
npm --prefix website run build
→ EXIT 0
→ 17 páginas generadas en 5.65s
→ 0 errores, 1 warning (import no usado en astro internals — ignorable)
```

### URLs verificadas localmente

| URL | Estado | Título |
|-----|--------|--------|
| `http://127.0.0.1:4321/` | ✅ HTTP 200 | Frecuencia Global — Análisis internacional con pulso electrónico |
| `http://127.0.0.1:4321/pilares/bass-and-borders` | ✅ HTTP 200 | BASS & BORDERS - Frecuencia Global |
| `http://127.0.0.1:4321/contenido/techno-detroit-historia-musica-electronica/` | ✅ HTTP 200 | El techno nació en Detroit, no en Berlín — Frecuencia Global |

---

## Regla operativa

> **Nunca ejecutar `git checkout HEAD -- website`** sin verificar primero en qué rama está HEAD.
> La rama de trabajo real es `rescue/restore-home-production-look-20260425`, no `main`.
> Si se necesita restaurar `website/`, usar:
> ```
> git checkout rescue/restore-home-production-look-20260425 -- website
> ```

---

## Recomendación — PR rescue → main

`main` está desactualizada. Para unificar la fuente de verdad:

1. Abrir PR en GitHub: `rescue/restore-home-production-look-20260425` → `main`
2. Título sugerido: `fix: sync main with production layout fixes (line-clamp, header, HomeFold)`
3. Incluir en descripción los 3 commits listados arriba
4. Merge strategy: **fast-forward o squash** (no hay divergencia, main tiene 0 commits exclusivos)
5. Tras el merge, `main` quedará en `c2a8155` y será la fuente única

**No hacer force push a main ni deploy manual — solo PR normal.**

---

## Estado post-recovery

- Rama activa: `rescue/restore-home-production-look-20260425`
- `website/` restaurado desde rama correcta
- Build local: PASS
- Dev server local: PASS (127.0.0.1:4321)
- Producción (`frecuenciaglobal.org`): OPERATIVA (misma versión)
