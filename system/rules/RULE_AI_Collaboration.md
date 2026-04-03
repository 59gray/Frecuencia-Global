# RULE: Colaboración IA — División de Responsabilidades

**Versión:** 1.0  
**Fecha:** 2026-03-30  
**Tipo:** Regla de gobernanza  
**Aplica a:** Toda interacción con agentes IA (GitHub Copilot, Maya/ChatGPT)

---

## 1. PRINCIPIO

El proyecto opera con dos agentes IA complementarios. Cada uno tiene jurisdicción clara. No hay solapamiento. Cuando una tarea cae en zona ambigua, se escala explícitamente.

---

## 2. JURISDICCIÓN POR AGENTE

### GitHub Copilot — Ejecución técnica

| Área | Alcance |
|------|---------|
| **Planificación de ejecución** | Task breakdown, secuenciación, estimación de complejidad |
| **Estructura del repositorio** | Creación/reorganización de carpetas, archivos, convenciones |
| **Enrutamiento de agentes** | Determinar qué agente del sistema interviene en cada paso |
| **Implementación** | Escribir, editar y validar archivos del sistema |
| **PR-ready execution** | Entregas listas para commit: completas, consistentes, sin placeholders |
| **Deuda técnica** | Detectar inconsistencias, archivos huérfanos, referencias rotas |

### Maya (ChatGPT) — Estrategia y contenido

| Área | Alcance |
|------|---------|
| **Estrategia de marca** | Posicionamiento, narrativa, evolución de pilares |
| **Lógica editorial** | Ángulos, enfoques, priorización temática |
| **Refinamiento narrativo** | Tono, voz, estructuras argumentativas |
| **Coherencia no técnica** | Alineación de contenido con visión, audiencia, identidad |
| **Decisiones de brand** | Cambios a paleta, tipografía, pilares, propuesta de valor |

---

## 3. PROTOCOLO DE ESCALAMIENTO

Cuando GitHub Copilot necesita juicio estratégico que no le corresponde:

```
⚠️ MAYA INPUT REQUIRED
─────────────────────
Contexto: [qué se está haciendo]
Gap: [qué decisión estratégica/editorial falta]
Opciones: [alternativas identificadas, si las hay]
Impacto: [qué se bloquea sin esta decisión]
```

Este bloque se inserta en el archivo o respuesta relevante. No se inventa estrategia para llenar el vacío.

---

## 4. PRINCIPIOS OPERATIVOS

1. **No inventar estrategia de marca.** Si no existe directriz, marcar `MAYA INPUT REQUIRED`.
2. **Planes concretos > ideas abstractas.** Copilot entrega archivos, no sugerencias.
3. **Mínima duplicación.** Un dato vive en un solo lugar. Se referencia, no se copia.
4. **Single source of truth.** El sistema maestro y las reglas son canónicos. Todo lo demás apunta a ellos.
5. **Organización escalable.** Cada archivo y carpeta debe poder crecer sin reestructurar.
6. **Default to execution.** Ante ambigüedad técnica, actuar. Ante ambigüedad estratégica, escalar.

---

## 5. EJEMPLOS

### Copilot actúa directamente
- "Crea un template para briefs de video" → ejecuta
- "Reorganiza la carpeta de assets" → ejecuta
- "Agrega un nuevo playbook para colaboraciones" → ejecuta

### Copilot escala a Maya
- "¿Deberíamos lanzar un quinto pilar de contenido?" → `MAYA INPUT REQUIRED`
- "¿Qué tono usar para una serie sobre migración?" → `MAYA INPUT REQUIRED`
- "¿Cambiamos el tagline del proyecto?" → `MAYA INPUT REQUIRED`

### Zona gris (Copilot decide formato, Maya decide contenido)
- "Crea la guía editorial de Geopolitik Drop" → Copilot crea la estructura/template, marca `MAYA INPUT REQUIRED` para el contenido editorial específico (ángulos, exclusiones temáticas, línea argumentativa)

---

## 6. VIGENCIA

Esta regla aplica a toda sesión de trabajo con cualquiera de los dos agentes. Ambos operan bajo el mismo sistema maestro ([`SISTEMA_MAESTRO.md`](../SISTEMA_MAESTRO.md)) y las mismas reglas.
