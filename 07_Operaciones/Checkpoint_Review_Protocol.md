# Frecuencia Global — Checkpoint Review Protocol

**Fecha:** 2026-04-01  
**Versión:** 1.0  

---

## 1. CÓMO LEER UN CHECKPOINT

Cada checkpoint automático (`FG_Checkpoint_AUTO_*.md`) tiene esta estructura:

| Sección | Qué contiene | Acción esperada |
|---------|-------------|-----------------|
| **Resumen Ejecutivo** | Conteo de archivos nuevos/modificados, áreas tocadas | Panorama rápido — ¿hubo actividad? |
| **Cambios Detectados** | Lista por área y archivos específicos | Identificar qué áreas avanzaron |
| **Archivos Clave** | Archivos estratégicos modificados | Priorizar revisión de archivos clave |
| **Estado del Website** | Build, artículos, antigüedad | ¿El website necesita rebuild/deploy? |
| **Assets Detectados** | SVGs, PNGs, watermarks | ¿Visual system avanza? |
| **Estado Git** | Archivos sin commit | ¿Hay que hacer commit/push? |
| **Bloqueadores** | Problemas detectados automáticamente | ⚠️ Resolver antes de avanzar |
| **Siguiente Paso** | Recomendación automática | Evaluar si coincide con prioridad estratégica |
| **MAYA_REVIEW_INPUT** | Bloque copiable para ChatGPT | Copiar a Maya para evaluación estratégica |
| **CHECKPOINTS_CHAT_SETUP** | Bloque para siguiente sesión | Configurar chat rápido tras cierre de sesión |

### Flujo de lectura rápida (< 2 min)

1. Leer **Resumen Ejecutivo** → ¿Hubo movimiento?
2. Revisar **Bloqueadores** → ¿Algo crítico?
3. Revisar **Siguiente Paso** → ¿Tiene sentido?
4. Copiar **CHECKPOINTS_CHAT_SETUP** para preparar el próximo arranque de chat
5. Si el checkpoint es relevante → pasar a revisión con Maya

---

## 2. REVISIÓN CON MAYA

Maya (ChatGPT) es la autoridad estratégica del proyecto. El checkpoint genera una sección `MAYA_REVIEW_INPUT` optimizada para copiar-pegar.

### 2.1 Cuándo consultar a Maya

| Situación | ¿Consultar? |
|-----------|-------------|
| Checkpoint muestra actividad normal, sin bloqueadores | ❌ No necesario |
| Hay bloqueadores nuevos | ✅ Sí |
| Se modificaron archivos clave (SISTEMA_MAESTRO, ROADMAP, Blueprint) | ✅ Sí |
| Hay que decidir qué publicar primero | ✅ Sí |
| Llevas 2+ checkpoints sin avance significativo | ✅ Sí |
| Cambio de dirección o prioridad | ✅ Siempre |

### 2.2 Template para Maya

Abrir ChatGPT → usar este template:

```
Soy Farid de Frecuencia Global.
Revisa este checkpoint automático de mi proyecto y dame tu evaluación estratégica.

[PEGAR AQUÍ EL BLOQUE MAYA_REVIEW_INPUT DEL CHECKPOINT]

Preguntas específicas:
1. ¿Las áreas tocadas están alineadas con las prioridades actuales?
2. ¿Hay algo que debería priorizar diferente?
3. ¿Los bloqueadores detectados son reales o falsos positivos?
4. ¿Qué hago en las próximas 12 horas?
```

### 2.3 Variantes del template

**Cuando hay bloqueadores:**

```
Frecuencia Global — Checkpoint con bloqueadores.

[PEGAR MAYA_REVIEW_INPUT]

El checkpoint detectó estos bloqueadores. ¿Son críticos? ¿Cómo los resuelvo?
Dame un plan de acción priorizado para las próximas 12 horas.
```

**Cuando llevas varios checkpoints sin avance:**

```
Frecuencia Global — Checkpoints estancados.

[PEGAR MAYA_REVIEW_INPUT]

Llevo [N] checkpoints sin avance significativo. 
¿Qué está fallando? ¿Estoy enfocado en lo correcto?
Dame un diagnóstico y un plan de intervención.
```

**Cuando quieres validar antes de publicar:**

```
Frecuencia Global — Pre-publicación review.

[PEGAR MAYA_REVIEW_INPUT]

Estoy por publicar la primera pieza (P1_001). 
¿El estado del proyecto es suficiente para lanzar?
¿Qué verifico antes de publicar?
```

---

## 3. CÓMO ACTUAR SOBRE LOS HALLAZGOS

### 3.1 Bloqueadores

| Bloqueador detectado | Acción inmediata |
|---------------------|-----------------|
| "0 piezas publicadas" | Verificar que P1_001 tiene QA_FINAL, handoff completo, y assets listos. Proceder a publicar. |
| "Sin build generado" | Ejecutar `npm run build` en `website/` |
| "Build desactualizado (>168h)" | Rebuild + deploy a Vercel |
| "STATE_PROJECT.json no inicializado" | Ejecutar el checkpoint una vez: `python scripts\generate_checkpoint.py` |

### 3.2 Archivos clave modificados

Cuando se modifican archivos clave, verificar coherencia:

| Archivo | Verificar |
|---------|----------|
| `system/SISTEMA_MAESTRO.md` | ¿Los agents, rules y workflows siguen alineados? |
| `system/ROADMAP_FG.md` | ¿Las prioridades cambiaron? ¿El checkpoint refleja eso? |
| `01_Estrategia/FG_Blueprint_Maestro.md` | ¿La estrategia macro sigue igual? |
| `02_Brand_System/FG_Brand_Kit_Operativo.md` | ¿Hubo cambios de identidad visual? |
| Cualquier `*_Brief.md` | ¿Se inició una nueva pieza? Verificar pipeline. |
| Cualquier `*_QA.md` | ¿Pieza lista para publicación? |

### 3.3 Repo dirty

Si el checkpoint marca "dirty" y hay muchos archivos sin commit:

1. Revisar qué archivos son (sección "Estado Git")
2. `git add -A && git commit -m "checkpoint: brief description"`
3. Push si es apropiado

### 3.4 Sin cambios detectados

Si el checkpoint muestra 0 cambios en 12+ horas:

- Verificar que el lookback es suficiente (`--hours 24`)
- Revisar si el trabajo fue en herramientas externas (Canva, Figma) — esos no se reflejan en el filesystem
- Considerar: ¿hubo avance real o el proyecto está estancado?

---

## 4. STATE_PROJECT.json

Este archivo mantiene el estado persistente entre checkpoints. Estructura:

```json
{
  "last_checkpoint_timestamp": "2026-04-01T09:17:00",
  "last_checkpoint_file": "01_Estrategia/FG_Checkpoint_AUTO_2026-04-01_0917.md",
  "repo_dirty_clean_status": "dirty",
  "touched_areas": ["system", "01_Estrategia", "scripts"],
  "key_files_updated": ["system/SISTEMA_MAESTRO.md"],
  "latest_assets_detected": ["fg_isotipo_optimizado.svg"],
  "website_status": { "exists": true, "build_fresh": false },
  "pending_priorities": ["P0: Publicar primera pieza", "..."],
  "blockers": ["0 piezas publicadas en ninguna plataforma"],
  "next_recommended_action": "Publicar P1_001 como primera pieza"
}
```

**No editar manualmente.** El script lo sobreescribe en cada ejecución.

---

## 5. CADENCIA DE REVISIÓN

| Hora | Acción |
|------|--------|
| **09:17** | Checkpoint matutino se genera automáticamente |
| **~09:20** | Abrir el .md generado en `01_Estrategia/` — lectura rápida (2 min) |
| **Si hay bloqueadores** | Copiar MAYA_REVIEW_INPUT → ChatGPT → obtener guidance |
| **~09:30** | Actuar sobre el plan del día |
| **21:17** | Checkpoint nocturno se genera automáticamente |
| **~21:20** | Revisar — ¿se avanzó en lo planeado? ¿Qué queda para mañana? |
| **Si hay dudas** | Consultar Maya con template de cierre de día |

### 5.1 Cierre de sesion (obligatorio para continuidad)

Antes de terminar una sesion activa:

1. Confirmar que existe `system/memory/checkpoints_chat_setup_latest.md`.
2. Verificar que el bloque `Next Action` coincide con la prioridad P0 real.
3. Si hay mismatch, regenerar checkpoint: `python scripts\generate_checkpoint.py --hours 24`.
4. Usar ese archivo como input de configuracion al abrir el siguiente chat.

---

## 6. ESCALAMIENTO

### ⚠️ MAYA INPUT REQUIRED

Usar esta etiqueta cuando:

- El checkpoint revela un bloqueo que no puedes resolver solo
- Maya recomienda un cambio de estrategia
- Llevas 3+ checkpoints sin avance en una prioridad P0
- Se necesita decisión editorial o de marca

### Formato para escalar en el repo

Agregar en el checkpoint o en un archivo separado:

```markdown
## ⚠️ MAYA INPUT REQUIRED

**Contexto:** [descripción breve del checkpoint/situación]
**Pregunta:** [qué necesitas que Maya decida]
**Opciones:** A / B / C (si aplica)
**Urgencia:** Alta / Media / Baja
```

---

*Documento creado: 2026-04-01*
