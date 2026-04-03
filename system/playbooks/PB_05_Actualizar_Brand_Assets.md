# PLAYBOOK 05 — Actualizar Brand Assets

**Sistema:** Frecuencia Global  
**Tipo:** Procedimiento operativo  
**Versión:** 1.0  
**Última actualización:** 2026-03-30

---

## CUÁNDO USAR ESTE PLAYBOOK

- Cuando se necesita crear un nuevo template maestro
- Cuando se modifica un componente visual existente (color, tipografía, elemento)
- Cuando se añade un nuevo pilar o serie que requiere identidad visual
- Cuando se necesita adaptar el sistema visual a una plataforma nueva

---

## PRINCIPIO: CAMBIO CONTROLADO

Cada cambio al sistema visual tiene impacto en cadena sobre todas las piezas futuras y la coherencia con piezas pasadas. Por eso:

- **Todo cambio requiere justificación documentada**
- **Todo cambio se registra en changelog**
- **Ningún cambio se aplica en producción antes de pasar por QA del sistema**

---

## PROCESO: CREAR NUEVO TEMPLATE

### Paso 1: Solicitud formal (10 min)

1. Identificar necesidad: ¿qué formato/plataforma/serie no está cubierta?
2. Verificar que no exista template reutilizable en el catálogo actual
3. Completar [`TPL_Creative_Request.md`](../templates/TPL_Creative_Request.md) con:
   - Formato y dimensiones requeridas
   - Plataforma destino
   - Pilar (si aplica)
   - Referencia visual (cómo debería verse)
   - Justificación (por qué no sirve lo que hay)

### Paso 2: Diseño del template (30-60 min)

1. Partir de las specs del Brand Kit Operativo:
   - Dimensiones según plataforma
   - Grid y layout según formato
   - Componentes aplicables del catálogo
2. Definir zonas:
   - Zona de título (Bebas Neue)
   - Zona de texto (Space Grotesk)
   - Zona de metadata (JetBrains Mono)
   - Zona de imagen/visual (si aplica)
   - Zona de marca (logo, pill de pilar)
3. Construir en Canva/Figma respetando:
   - Colores del sistema exclusivamente
   - Tipografías del sistema exclusivamente
   - Componentes del catálogo (frequency line, nodes, brackets)
4. Crear variantes por pilar si es necesario (4 versiones de color)

### Paso 3: Verificación y aprobación (15 min)

1. Verificar contra checklist:
   □ Colores hex correctos
   □ Tipografías correctas
   □ Componentes del catálogo solamente
   □ Dimensiones exactas
   □ Safe areas respetadas
   □ Legible en mobile
   □ Consistente con templates existentes
2. Si pasa → aprobar para uso
3. Si falla → corregir y re-verificar

### Paso 4: Exportación y registro (15 min)

1. Exportar template en formatos requeridos:
   - PNG de referencia
   - Link a archivo editable (Canva/Figma)
   - SVG si contiene vectores reutilizables
2. Nombrar: `FG_Template_[FORMATO]_[PILAR]_[VERSION].ext`
3. Colocar en carpeta correcta del repo
4. Crear o actualizar README de la carpeta

### Paso 5: Documentación (10 min)

1. Actualizar `02_Brand_System/FG_Brand_Kit_Operativo.md`:
   - Añadir nuevo template a la tabla de templates
   - Documentar specs (dimensiones, zonas, componentes)
2. Registrar en changelog del Brand Kit:
   ```
   | YYYY-MM-DD | Nuevo template [nombre] añadido | [Razón] | [Autor] |
   ```
3. Notificar a Design Production Agent que el template está disponible

---

## PROCESO: MODIFICAR COMPONENTE EXISTENTE

**Impacto potencial: ALTO. Cada cambio afecta todas las piezas futuras.**

### Paso 1: Evaluación de impacto (15 min)

1. ¿Qué componente se modifica? (color, fuente, elemento, layout)
2. ¿Cuántas piezas existentes afecta?
3. ¿Se requiere actualizar piezas ya publicadas?
4. ¿El cambio es retrocompatible (no rompe piezas viejas)?

### Paso 2: Propuesta documentada (10 min)

Documentar:
```
COMPONENTE: [nombre del componente]
CAMBIO PROPUESTO: [descripción exacta]
JUSTIFICACIÓN: [por qué es necesario]
IMPACTO: [qué piezas/templates afecta]
RETROCOMPATIBILIDAD: [sí/no — si no, plan de migración]
```

### Paso 3: Implementación (variable)

1. Hacer el cambio en los archivos fuente (SVG, Canva, Figma)
2. Actualizar todos los templates que usan el componente
3. Exportar nuevas versiones
4. Incrementar versión en nombre de archivo

### Paso 4: Actualización de documentación (15 min)

1. Actualizar `02_Brand_System/FG_Brand_Kit_Operativo.md`
2. Actualizar reglas relevantes en `system/rules/`
3. Registrar en changelog con fecha, cambio, razón, autor
4. Notificar a todos los agentes que usan el componente

### Paso 5: QA del cambio (10 min)

1. Verificar que el cambio no rompe templates existentes
2. Producir 1 pieza de prueba con el componente actualizado
3. QA Agent revisa la pieza de prueba
4. Si PASS → cambio oficializado
5. Si FAIL → revertir y re-evaluar

---

## PROCESO: NUEVO PILAR O SERIE

### Paso 1: Definición de identidad visual (20 min)

1. Recibir definición del pilar/serie de Content Strategy
2. Asignar color primario (debe ser del sistema o proponer ampliación justificada)
3. Definir:
   - Pill de pilar (color + texto)
   - Variante de background preferida
   - Eventualmente elementos únicos (dentro del catálogo)

### Paso 2: Crear templates del pilar (60-90 min)

1. Generar variantes de cada template existente con nueva identidad:
   - Thumbnail YT
   - Carrusel IG (cover + interior + cierre)
   - Overlay de Reel
   - Post estático
2. Exportar todo
3. Documentar en Brand Kit

### Paso 3: Prueba de producción (30 min)

1. Producir 1 pieza real con los nuevos templates
2. QA completo
3. Ajustes si necesario
4. Oficialización

---

## INVENTARIO ACTUAL DE ASSETS

Actualizar esta lista cada vez que se añadan assets:

| Tipo | Ubicación | Archivos |
|------|-----------|----------|
| SVG maestros | `Frecuencia_Global_Assets_Base/assets/` | isotipo, wordmark (2), brackets, nodo |
| Backgrounds | `Frecuencia_Global_Activos_Canva_v5/` | 8 backgrounds |
| Elementos | `Frecuencia_Global_Activos_Canva_v5/` | 15 PNGs reutilizables |
| Templates carrusel | `Frecuencia_Global_Activos_Canva_v4/` | 8 templates (4 cover + 4 interior) |
| Platform graphics | `Frecuencia_Global_Activos_Canva_v1-v3/` | Banners, avatars, covers, overlays |
| Mockups | `Frecuencia_Global_Activos_Canva_v6_Mockups/` | 5 mockups de plataforma |
| Tipografías | `static/` | Space Grotesk (5 pesos) |

---

## DOCUMENTOS RELACIONADOS

- [`02_Brand_System/FG_Brand_Kit_Operativo.md`](../../02_Brand_System/FG_Brand_Kit_Operativo.md) — Sistema visual maestro
- [`AGENT_01_Brand_System.md`](../agents/AGENT_01_Brand_System.md) — Agente responsable
- [`RULE_Visual_Consistency.md`](../rules/RULE_Visual_Consistency.md) — Reglas visuales
- [`RULE_File_Output_Standards.md`](../rules/RULE_File_Output_Standards.md) — Estándares de salida
- [`RULE_Naming_Conventions.md`](../rules/RULE_Naming_Conventions.md) — Naming
