# WORKFLOW — Multimedia Pipeline (Gemini)

**Sistema:** Frecuencia Global  
**Código:** WORKFLOW_Multimedia_Pipeline  
**Versión:** 1.0  
**Aplica a:** Supervisor, Visual Creator, Video Producer, Audio Producer

---

## PROPÓSITO

Define el flujo estándar para producir piezas multimedia completas a través del sistema de agentes Gemini. Este workflow complementa los flujos existentes del sistema maestro (§7) añadiendo la capa de generación creativa con Nano Banana 2 y dirección de audio/video.

---

## FLUJO PRINCIPAL: Brief → Deliverable

```
A. RECEPCIÓN          @supervisor recibe brief del usuario
      ↓
B. ANÁLISIS           @supervisor clasifica: visual / video / audio / multimedia
      ↓
C. DELEGACIÓN         @supervisor asigna a subagentes según tipo
      ↓
D. PRODUCCIÓN         Subagentes trabajan (paralelo si son independientes)
      ↓
E. CONSOLIDACIÓN      @supervisor integra outputs, verifica coherencia
      ↓
F. HANDOFF            Entrega a pipeline existente (Design Production, QA)
```

---

## DETALLE POR FASE

### A. Recepción

| Input | Responsable | Output |
|-------|-------------|--------|
| Brief del usuario (libre o template) | @supervisor | Brief estructurado con clasificación |

**Criterios de clasificación:**
- **Visual puro**: thumbnails, covers, fondos, mockups → @visual-creator
- **Video**: storyboards, shot lists, editing briefs → @video-producer
- **Audio**: música, SFX, identidad sonora → @audio-producer
- **Multimedia combo**: requiere 2+ disciplinas → delegación secuencial o paralela

### B. Análisis

@supervisor identifica:
1. Pilar de contenido (Geopolitik Drop / Bass & Borders / Frecuencia Global / Behind the Policy)
2. Formato objetivo (reel, video largo, carrusel, podcast, etc.)
3. Plataforma destino (YouTube, TikTok, Instagram, LinkedIn, Spotify)
4. Nivel de urgencia (estándar / rápido / breaking)
5. Referencias existentes en `system/gemini/references/approved/`

### C. Delegación

| Tipo de pieza | Agente(s) | Orden de ejecución |
|---------------|-----------|-------------------|
| Thumbnail | @visual-creator | Solo |
| Cover art | @visual-creator | Solo |
| Short (30-90s) | @video-producer → @visual-creator | Secuencial |
| Video largo | @video-producer → @visual-creator → @audio-producer | Secuencial |
| Podcast episode | @audio-producer | Solo |
| Multimedia completo | @audio-producer ∥ @visual-creator → @video-producer | Paralelo + secuencial |

**Regla**: cuando video y audio coexisten, audio define el ritmo y video se adapta.

### D. Producción

Cada subagente:
1. Lee brand context desde `02_Brand_System/FG_Brand_Kit_Operativo.md`
2. Lee reglas desde `system/rules/RULE_Visual_Consistency.md`
3. Consulta referencias aprobadas en `system/gemini/references/approved/`
4. Genera output según su formato de respuesta estándar
5. Guarda outputs en `system/gemini/outputs/[visual|video|audio]/`

### E. Consolidación

@supervisor verifica:
- [ ] Coherencia visual-audio-video (si multimedia)
- [ ] Paleta cromática respetada
- [ ] Tipografía del sistema
- [ ] Pilar correcto con su color dominante
- [ ] Tono y voz alineados
- [ ] Specs técnicos completos
- [ ] Sin conflictos entre outputs de subagentes

### F. Handoff

Output final se entrega al pipeline existente:

| Desde Gemini | Hacia sistema existente | Formato de entrega |
|--------------|------------------------|-------------------|
| Prompts visuales | AGENT_05 (Design Production) | Prompt + specs + referencia |
| Storyboard/editing brief | AGENT_12 (Video Producer) | Paquete de producción completo |
| Music/SFX brief | Ejecución manual o herramienta externa | Brief técnico + referencias |
| Paquete multimedia | AGENT_07 (Project Manager) | Entrega consolidada con timeline |

---

## VARIANTES DEL FLUJO

### Variante rápida (Breaking news)
```
A → B → C (solo @visual-creator) → E (mínimo) → F
```
Omite audio, usa template predeterminado, QA fast.

### Variante iterativa (Exploración creativa)
```
A → B → C → D → E (feedback loop) → D' → E' → F
```
Permite hasta 3 iteraciones antes de aprobar.

### Variante de solo audio
```
A → B → C (@audio-producer) → E → F (a producción externa)
```

---

## INTEGRACIÓN CON FLUJOS EXISTENTES

Este workflow se inserta entre los pasos 3 y 5 del flujo principal del Sistema Maestro:

```
Flujo del Sistema Maestro:
1. Content Strategy → 2. Research → 3. Scriptwriting
                                          ↓
                              [WORKFLOW Multimedia Pipeline]
                              A → B → C → D → E → F
                                          ↓
4. Video Producer → 5. Design Production → 6. QA → 7. Publicación
```

---

*Este workflow es referencia para todos los agentes Gemini. Cambios requieren actualización del supervisor.*
