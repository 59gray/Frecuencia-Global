# INSTRUCCIÓN OPERATIVA PARA LIMPIEZA DEL WORKSPACE “FRECUENCIA GLOBAL”

1. MOVER a `_archivo/` (NO BORRAR, SOLO MOVER):
- Todos los PDFs sueltos en raíz
- Todos los ZIPs en raíz
- Todos los DOCX y PDF de assets/documentos no activos
- Archivos TXT misceláneos
- TTF duplicado en raíz
- Checkpoint obsoleto: `01_Estrategia/FG_Checkpoint_Proyecto.md`
- HTML duplicados: `01_Estrategia/FG_Blueprint_Maestro.html`, `01_Estrategia/FG_Diagnostico_Brechas.html`

2. ARCHIVAR dentro de `scripts/_archive/`:
- Todos los scripts `step1` a `step71` y PNGs de debugging
- Conservar solo `configure_brandkit.js` y `make_banner.js` si funcionan (verificar manualmente antes de borrar cualquier otro .js)

3. CONSOLIDAR dentro de `06_Assets/`:
- Mover carpetas `Frecuencia_Global_Activos_Canva_v1/` a `v6_Mockups/` y `Frecuencia_Global_Assets_Base/assets/` bajo subcarpetas descriptivas en `06_Assets/`
- Crear/actualizar `06_Assets/README_Assets_Index.md` con inventario real

4. DUPLICADOS a MARCAR:
- Fonts TTF en raíz y en `static/` (conservar solo en `static/`)
- README.txt (si no es del proyecto, mover a `_archivo/`)

5. ARCHIVOS NO TOCAR:
- Todo en `system/`
- Todo en `03_Editorial/`, `04_Produccion/`, `01_Estrategia/`, `02_Brand_System/` salvo los listados arriba
- `README.md` principal
- `AUDITORIA_FALTANTES_FG.md`, `AUDITORIA_FG_2026-03-31.md`

6. REVISAR MANUALMENTE ANTES DE MOVER:
- Cualquier archivo con nombre críptico o sin extensión clara
- Cualquier archivo modificado en los últimos 7 días
- Cualquier archivo que no esté listado aquí pero no esté documentado en el inventario

7. DOCUMENTAR LA LIMPIEZA:
- Mantener un log de cambios: qué se movió, de dónde a dónde, fecha y responsable
- No eliminar nada de forma irreversible hasta que el responsable confirme que todo funciona tras la limpieza
- Reportar cualquier archivo dudoso antes de mover

8. EXIGENCIA:
- Revisión cuidadosa, cero eliminación irreversible de inicio
- Uso de rutas exactas y evidencia de archivos
- Reporte final de cambios ejecutados, con distinción clara entre “mover”, “archivar”, “conservar”, “revisar”
- No tocar archivos críticos del sistema activo
