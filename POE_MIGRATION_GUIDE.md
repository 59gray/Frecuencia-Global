# Guía de Migración a Poe - Frecuencia Global

## Archivos Creados

1. **`PROMPT_POE_MIGRATION.md`** - Prompt completo con todo el contexto del proyecto
2. **`PROMPT_POE_SYSTEM_SHORT.md`** - System prompt corto (recomendado para Poe)

---

## Cómo Usar en Poe

### Opción 1: System Prompt (Recomendado)

1. Crea un nuevo bot en Poe
2. En **System Prompt**, pega el contenido de `PROMPT_POE_SYSTEM_SHORT.md`
3. En **Base Bot**, selecciona Claude 3.5 Sonnet o GPT-4
4. **Bot Name:** Frecuencia Global Assistant
5. **Description:** Asistente especializado en el proyecto Frecuencia Global - análisis geopolítico multiplataforma

### Opción 2: Prompt de Contexto

1. Crea un nuevo bot en Poe
2. Deja el System Prompt vacío o minimal
3. En el primer mensaje, pega el contenido de `PROMPT_POE_MIGRATION.md`
4. El bot tendrá contexto completo del proyecto

### Opción 3: Complemento a VS Code

Usa Poe como complemento a tu flujo actual en VS Code:

- **VS Code/Cascade:** Para tareas de desarrollo, scripts, archivos
- **Poe:** Para brainstorming, estrategia, investigación, generación de contenido

---

## Casos de Uso Recomendados en Poe

### 1. Brainstorming de Contenido

```
Actúa como el agente Content Strategy de Frecuencia Global.
Necesito ideas para 3 piezas del pilar "Geopolitik Drop" sobre la situación actual en [TEMA].
Cada idea debe incluir: título, ángulo, formato sugerido, y plataformas objetivo.
```

### 2. Research de Temas

```
Actúa como el agente Research de Frecuencia Global.
Investiga [TEMA] para una pieza del pilar "Behind the Policy".
Necesito: fuentes verificables, datos clave, contexto histórico, y stakeholders principales.
```

### 3. Generación de Scripts

```
Actúa como el agente Scriptwriting de Frecuencia Global.
Escribe un script de 60-90s para TikTok sobre [TEMA].
Pilar: Frecuencia Global (verde ácido, tono ágil e informativo).
Incluye: hook, cuerpo, CTA, y hashtags sugeridos.
```

### 4. Briefs de Diseño

```
Actúa como el agente Design Production de Frecuencia Global.
Crea un brief de diseño para un cover de Instagram (1080x1350) sobre [TEMA].
Pilar: Geopolitik Drop (cian eléctrico, tono intenso y visual).
Respeta la paleta: #00E5FF, #0A0A0F, #FFFFFF.
```

### 5. QA de Contenido

```
Actúa como el agente QA/Consistency de Frecuencia Global.
Revisa este [CONTENIDO] según las reglas del sistema:
- Naming conventions
- Paleta cerrada
- Tono del pilar correspondiente
- Fuentes verificables
```

### 6. Estrategia de Publicación

```
Actúa como el agente Project Manager de Frecuencia Global.
Planifica la publicación de [PIEZA] en las plataformas operativas:
- X/Twitter (browser automation)
- LinkedIn (browser automation)
- Instagram (browser automation)
- Threads (Graph API)

Considera: horarios, formatos por plataforma, y CTAs específicos.
```

---

## Limitaciones de Poe vs VS Code

### Poe es mejor para:
- Brainstorming y creatividad
- Investigación y research
- Generación de texto y scripts
- Estrategia y planificación
- Conversación fluida

### VS Code/Cascade es mejor para:
- Edición de archivos reales
- Ejecución de scripts Python
- Debugging de código
- Operaciones en el repositorio
- Integración con herramientas locales (Playwright, n8n)

---

## Comandos y Referencias Útiles

Cuando trabajes con Frecuencia Global en Poe, referencia estos archivos:

```
system/SISTEMA_MAESTRO.md              # Visión completa del sistema
system/FUENTE_DE_VERDAD_Y_CONTRATO.md # Contrato de datos
02_Brand_System/FG_Brand_Kit_Operativo.md # Sistema visual
07_Operaciones/PATCH_NOTES_*.md       # Estado actual
scripts/x_publish_post.py              # Ejemplo de script
```

---

## Actualización del Prompt

Cuando el proyecto evolucione:

1. Actualiza `PROMPT_POE_MIGRATION.md` con cambios relevantes
2. Actualiza `PROMPT_POE_SYSTEM_SHORT.md` si afecta el contexto base
3. Registra cambios en `07_Operaciones/PATCH_NOTES_*.md`

---

## Tips para Mejores Resultados

1. **Especifica el agente:** "Actúa como el agente [NOMBRE]"
2. **Menciona el pilar:** "Pilar: [NOMBRE] (color, tono)"
3. **Referencia templates:** "Usa el template TPL_XXX"
4. **Pide formato estructurado:** "Output en formato JSON/Markdown"
5. **Solicita fuentes:** "Incluye fuentes verificables"

---

## Ejemplo de Sesión Productiva

```
Usuario: Actúa como Content Strategy. Necesito ideas para "Geopolitik Drop" sobre la IA en la geopolítica.

Poe: [Genera 3 ideas con títulos, ángulos, formatos, plataformas]

Usuario: Actúa como Research. Investiga la primera idea a fondo.

Poe: [Investiga con fuentes, datos, contexto]

Usuario: Actúa como Scriptwriting. Escribe un script de 60s para TikTok.

Poe: [Genera script con hook, cuerpo, CTA]

Usuario: Actúa como QA. Revisa el script según reglas del sistema.

Poe: [Revisa naming, tono, fuentes, estructura]
```

---

## Integración con Flujo Existente

Mantén tu flujo actual en VS Code para:

- Ejecutar scripts de publicación: `python scripts/x_publish_post.py --pieza P1_001`
- Editar archivos del repo
- Trabajar con n8n workflows
- Generación de imágenes con Gemini

Usa Poe para:

- Preparación previa (research, brainstorming)
- Generación de contenido (scripts, captions)
- Revisión y QA
- Estrategia y planificación

---

## Soporte

Si encuentras problemas:

1. Verifica que el prompt esté actualizado
2. Consulta `system/SISTEMA_MAESTRO.md` para contexto
3. Revisa `07_Operaciones/PATCH_NOTES_*.md` para estado actual
4. Mantén coherencia con las reglas del sistema

---

*Última actualización: 2026-04-04*
*Estado del proyecto: Milestone 1 completado (primera publicación multiplataforma)*
