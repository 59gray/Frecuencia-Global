# ROOT_OPENING_STANDARD.md
## Estándar de Apertura de Workspace - Frecuencia Global

**Versión:** 1.0
**Fecha:** 2026-04-26
**Estado:** Activo / Obligatorio

---

## 1. Raíz Canónica Única

```
C:\Users\farid\Documents\Frecuencia Global\
```

**NO alternativas válidas:**
- ❌ `C:\Users\farid\Documents\Frecuencia Global\FrecuenciaGlobal (Workspace)`
- ❌ `C:\Users\farid\Documents\Frecuencia Global\D\`
- ❌ `D:\FrecuenciaGlobal\` (para abrir como workspace)

---

## 2. Método de Apertura Obligatorio

### VS Code
```powershell
code "C:\Users\farid\Documents\Frecuencia Global\FrecuenciaGlobal.code-workspace"
```

### Cursor
```powershell
cursor "C:\Users\farid\Documents\Frecuencia Global\FrecuenciaGlobal.code-workspace"
```

### Windsurf
```powershell
# Opción A: Abrir workspace file
windsurf "C:\Users\farid\Documents\Frecuencia Global\FrecuenciaGlobal.code-workspace"

# Opción B: Abrir directorio raíz
windsurf "C:\Users\farid\Documents\Frecuencia Global"
```

### Explorador de Archivos (doble clic)
1. Navegar a `C:\Users\farid\Documents\Frecuencia Global`
2. Doble clic en `FrecuenciaGlobal.code-workspace`

---

## 3. Prohibiciones Estrictas

| Prohibición | Razón |
|-------------|-------|
| **NO** abrir carpetas anidadas como raíz | Rompe rutas relativas y contexto del agente |
| **NO** crear rutas fake tipo `D:` dentro de `C:` | El artefacto `D` fue retirado por esta razón |
| **NO** duplicar estructura del repo en otra unidad | Para assets pesados usar `D:\FrecuenciaGlobal\` FUERA del repo |
| **NO** abrir desde "Recientes" sin verificar | Puede apuntar a ruta incorrecta |

---

## 4. Ubicación de Outputs Pesados

**Dentro del repo (C:):**
- Código fuente
- Configuraciones
- Documentación
- Assets ligeros (< 10MB)

**Fuera del repo (D:)**

> **NOTA:** `D:\FrecuenciaGlobal\` es ruta externa real en unidad D:, no carpeta dentro del repo.

```
D:\FrecuenciaGlobal\
├── outputs\              # Renders ComfyUI
├── workflows\            # Workflows ComfyUI
├── inputs\               # Assets source pesados
└── renders\             # Videos finales
```

**Referencia en documentación:**
- `07_Operaciones/WINDSURF_CONTEXT_FG.md` (sección 5.2 Assets Pesados)

---

## 5. Protocolo para Agentes/IA

**Antes de modificar archivos, el agente debe:**

1. **Reportar CWD actual:**
   ```python
   import os
   print(f"CWD: {os.getcwd()}")
   ```

2. **Verificar raíz canónica:**
   ```python
   import pathlib
   root = pathlib.Path("C:/Users/farid/Documents/Frecuencia Global")
   assert root.exists(), "Raíz canónica no encontrada"
   assert (root / "FrecuenciaGlobal.code-workspace").exists(), "Workspace no encontrado"
   ```

3. **Usar rutas absolutas** para operaciones críticas

4. **Confirmar ubicación** antes de:
   - Crear archivos
   - Mover assets
   - Ejecutar scripts
   - Modificar configs

---

## 6. Estructura Esperada del Workspace

```
C:\Users\farid\Documents\Frecuencia Global\
├── FrecuenciaGlobal.code-workspace  ← Siempre usar este
├── .vscode/
│   └── mcp.json
├── .windsurf/
├── 01_Estrategia/
├── 02_Brand_System/
├── 03_Editorial/
├── 04_Produccion/
├── 06_Assets/
├── 07_Operaciones/
│   ├── _retired_artifacts/        ← Artefactos históricos
│   ├── WORKSPACE_ROOT_AUDIT_20260426.md
│   └── ROOT_OPENING_STANDARD.md   ← Este archivo
├── 08_n8n/
├── scripts/
├── website/
└── system/
```

---

## 7. Verificación Rápida

**Al abrir el workspace, confirmar:**
- [ ] Título de ventana muestra "Frecuencia Global" (no subcarpeta)
- [ ] `FrecuenciaGlobal.code-workspace` aparece en explorer
- [ ] No hay carpetas tipo `D` visibles
- [ ] `.vscode/mcp.json` es accesible

---

## 8. Historial de Cambios

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2026-04-26 | Creación inicial | Cascade AI (Auditoría workspace) |
| 2026-04-26 | Retiro de artefacto `D` | Cascade AI |

---

## 9. Referencias

- Auditoría completa: `07_Operaciones/WORKSPACE_ROOT_AUDIT_20260426.md`
- Paths clave: `PATHS_CLAVE.md`
- Contexto del sistema: `system/SISTEMA_MAESTRO.md`

---

*Este estándar es obligatorio para todos los agentes y usuarios que interactúan con el workspace de Frecuencia Global.*
