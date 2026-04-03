# REGLA — Folder Conventions

**Sistema:** Frecuencia Global  
**Código:** RULE_Folder_Conventions  
**Severidad:** ESTÁNDAR  
**Aplica a:** Todos los agentes que crean o mueven archivos

---

## ESTRUCTURA MAESTRA

```
Frecuencia Global/
│
├── system/                              ← Sistema operativo de agentes
│   ├── SISTEMA_MAESTRO.md               ← Documento central
│   ├── agents/                          ← Definiciones de agentes (1 archivo por agente)
│   ├── playbooks/                       ← Procedimientos operativos
│   ├── templates/                       ← Plantillas reutilizables
│   ├── rules/                           ← Reglas del sistema
│   ├── workflows/                       ← Mapas de flujo
│   └── roadmap/                         ← Plan de desarrollo
│
├── 01_Estrategia/                       ← Documentos fundacionales
│   └── [Blueprint, Checkpoint, Diagnósticos, Prompts]
│
├── 02_Brand_System/                     ← Sistema visual
│   └── FG_Brand_Kit_Operativo.md
│
├── 03_Editorial/                        ← Guías editoriales por pilar
│   └── [guías de tono, estructura, hooks por pilar]
│
├── 04_Produccion/                       ← Flujos de producción
│   └── [step-by-step de video, short, carrusel]
│
├── 05_Monetizacion/                     ← Estrategia de monetización
│   └── [modelo de ingresos, KPIs, tracking]
│
├── 06_Assets/                           ← Índice de assets
│   └── [INDEX de assets con enlaces a Canva/Figma]
│
├── 07_Operaciones/                      ← Guías operativas
│   └── [setup de cuentas, herramientas, accesos]
│
├── Frecuencia_Global_Assets_Base/       ← SVGs maestros
│   └── assets/
│       └── [isotipo, wordmarks, brackets, nodo].svg
│
├── Frecuencia_Global_Activos_Canva_v[N]/← Assets por versión
│   ├── README_Activos_v[N].md
│   └── [archivos PNG/assets de esa versión]
│
└── static/                              ← Recursos estáticos (fuentes)
    └── [tipografías .ttf]
```

---

## REGLAS DE ORGANIZACIÓN

### 1. Un README por carpeta de assets
Cada carpeta `Frecuencia_Global_Activos_Canva_v[N]/` debe tener un `README_Activos_v[N].md` que explique:
- Qué contiene
- Propósito de la versión
- Lista de archivos con descripción
- Estado (completo/en progreso)

### 2. No mezclar versiones
Cada versión de assets va en su propia carpeta. No colocar archivos v2 en la carpeta v1.

### 3. Documentos de sistema van en system/
Todo lo que sea operativo (agentes, playbooks, templates, reglas) va en `system/`. No dispersar en otras carpetas.

### 4. Documentos estratégicos van en 01_Estrategia/
Blueprint, checkpoints, diagnósticos = `01_Estrategia/`.

### 5. No crear carpetas innecesarias
Antes de crear una carpeta nueva, verificar si el archivo cabe en una existente.

### 6. No dejar archivos sueltos en la raíz
La raíz del repo debe contener solo:
- `README.md` (orientación general)
- `AUDITORIA_FRECUENCIA_GLOBAL.md` (si se actualiza)
- Archivos de licencia (`OFL.txt`)
- Fuente variable (`SpaceGrotesk-VariableFont_wght.ttf`)
- Los demás archivos deben organizarse en carpetas

### 7. Archivos temporales o borradores
Si se necesita espacio para trabajo en progreso, usar una carpeta `_drafts/` dentro de la carpeta relevante. No versionar como finales.

---

## DÓNDE VA CADA TIPO DE ARCHIVO

| Tipo de archivo | Ubicación |
|-----------------|-----------|
| Definición de agente | `system/agents/` |
| Playbook operativo | `system/playbooks/` |
| Template reutilizable | `system/templates/` |
| Regla del sistema | `system/rules/` |
| Mapa de flujos | `system/workflows/` |
| Roadmap | `system/roadmap/` |
| Documento estratégico | `01_Estrategia/` |
| Brand kit / reglas visuales | `02_Brand_System/` |
| SVG maestro | `Frecuencia_Global_Assets_Base/assets/` |
| PNG de producción | `Frecuencia_Global_Activos_Canva_v[N]/` |
| Fuente tipográfica | `static/` |
| Guía editorial | `03_Editorial/` |
| Flujo de producción | `04_Produccion/` |

---

*Mantener la estructura limpia reduce confusión y acelera el onboarding de nuevos colaboradores o agentes.*
