# D07 — MAPA DE ALMACENAMIENTO C:/ D:/ F:

## Resumen ejecutivo

Se audita el uso actual de almacenamiento para Frecuencia Global con evidencia repo-first y verificaciones puntuales de existencia en disco (sin inventariar contenido profundo). El repo canonico operativo queda en `C:\Users\farid\Documents\Frecuencia Global`. La produccion grafica pesada y ComfyUI quedan centralizadas en `D:\FrecuenciaGlobal\` con outputs tipicos en `ComfyUI\output` y staging audiovisual en `AV\`. En `F:\` existe una carpeta `F:\Frecuencia Global\output` vacia en spot-check; su proposito exacto no esta documentado en fuentes prioritarias.

## Mapa por unidad

### C:/

- **Repo activo (canonico):** `C:\Users\farid\Documents\Frecuencia Global`
- **Website/build local:** `C:\Users\farid\Documents\Frecuencia Global\website\dist` y cache `C:\Users\farid\Documents\Frecuencia Global\website\.astro`
- **Dependencias runtime del sistema:** `C:\Program Files\nodejs\`, `C:\Program Files\Google\Chrome\Application\chrome.exe` (referenciados por scripts legacy)
- **Zona sensible (credenciales/tokens/residuos OAuth):** rutas enumeradas por `API_CONTROL_PANEL.md` (`.env.local`, `scripts/token*.json`, etc.)

### D:/

- **Raiz FG externa al Documents:** `D:\FrecuenciaGlobal` (spot-check existe)
  - **ComfyUI runtime + venv:** `D:\FrecuenciaGlobal\ComfyUI` y `D:\FrecuenciaGlobal\ComfyUI\output`
  - **Outputs y staging AV:** `D:\FrecuenciaGlobal\AV\...` (ejemplos documentados: Detroit featured redesign, Bass&Border cards/thumbnails)
  - **Backups:** `D:\FrecuenciaGlobal\backups\...` (referencia en `WINDSURF_DAILY_LOG.md`)
  - **Duplicados de estructura repo:** `D:\FrecuenciaGlobal\04_Produccion`, `D:\FrecuenciaGlobal\06_Assets` (spot-check carpetas existentes)
  - **Zonas sensibles:** `D:\FrecuenciaGlobal\BrowserProfiles`, `D:\FrecuenciaGlobal\Security`
- **Instalacion alternativa ComfyUI outputs:** `D:\ComfyUI\output` (spot-check existe)

### F:/

- **Raiz:** `F:\` contiene carpeta `Frecuencia Global`
- **Carpeta FG:** `F:\Frecuencia Global` contiene solo `output` en spot-check
- **Subcarpeta:** `F:\Frecuencia Global\output` existe y aparece vacia en spot-check superficial

## Rutas activas confirmadas (existencia verificada localmente)

| Ruta | Clasificacion |
|------|---------------|
| `C:\Users\farid\Documents\Frecuencia Global` | repo activo |
| `C:\Users\farid\Documents\Frecuencia Global\website\dist` | website/build |
| `C:\Users\farid\Documents\Frecuencia Global\website\.astro` | website/build |
| `D:\FrecuenciaGlobal` | assets audiovisuales / runtime externo |
| `D:\FrecuenciaGlobal\ComfyUI` | ComfyUI runtime |
| `D:\FrecuenciaGlobal\ComfyUI\output` | ComfyUI outputs |
| `D:\FrecuenciaGlobal\AV` | assets audiovisuales |
| `D:\ComfyUI\output` | ComfyUI outputs |
| `F:\Frecuencia Global` | no clasificado |
| `F:\Frecuencia Global\output` | no clasificado |

## Rutas sensibles / NO tocar

- Credenciales y OAuth: rutas listadas en `API_CONTROL_PANEL.md` (incluye `.env.local`, `scripts/token*.json`, residuos listados en seccion 8)
- Perfiles navegador: `D:\FrecuenciaGlobal\BrowserProfiles` y scripts que apuntan a Chrome en `C:\Program Files\...` (legacy)
- Seguridad local: `D:\FrecuenciaGlobal\Security`

## Rutas candidatas a migracion futura (sin ejecutar)

- Duplicacion estructural en `D:\FrecuenciaGlobal\04_Produccion` y `D:\FrecuenciaGlobal\06_Assets` frente al repo canonico en C:
- Outputs historicos dispersos entre `D:\FrecuenciaGlobal\ComfyUI\output`, `D:\ComfyUI\output` y export paths `...\output\exports\...` documentados en `DETROIT_D07_FINAL_ASSET_SELECTION_20260425.md`

## Rutas que deben quedarse por dependencia operativa (hoy)

- Repo canonico en **C:** (autoridad documental + git)
- ComfyUI runtime/outputs en **D:** (scripts referencian `D:\FrecuenciaGlobal\ComfyUI\output` como sink operativo)

## Decisiones (matriz)

| Decision | Rutas tipo |
|---------|-----------|
| mantener | Repo C:, `website/dist`, roots ComfyUI D: |
| candidato a migrar | Duplicados `D:\FrecuenciaGlobal\{04_Produccion,06_Assets}` vs C: |
| candidato a documentar | `F:\Frecuencia Global\output` (proposito no aparece en fuentes prioritarias) |
| bloquear/no tocar | Credenciales/API paths de `API_CONTROL_PANEL.md`, BrowserProfiles D:, Security D: |

## Recomendaciones para D08 (sin ejecutar cambios)

1. Decidir una sola fuente de verdad para assets web publicables: `website/public/images/**` vs copias en D:\ staging.
2. Formalizar inventario CSV de outputs ComfyUI por pieza con paths exactos en `D:\FrecuenciaGlobal\ComfyUI\output\exports\...` donde aplique.
3. Resolver drift duplicado C: vs D: con plan de reconciliacion documental antes de cualquier movimiento fisico.

## Limites de auditoria

- No se realizo inventario profundo por tamano en `D:\FrecuenciaGlobal\AV` ni en caches ComfyUI.
- Rutas solo mencionadas en docs pero no spot-checked quedan como `NO VERIFICADO EN FUENTE LOCAL` para existencia/contenido.
