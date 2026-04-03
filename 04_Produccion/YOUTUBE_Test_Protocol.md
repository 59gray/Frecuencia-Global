# YouTube - Test Protocol

**Sistema:** Frecuencia Global  
**Fecha:** 2026-04-02  
**Objetivo:** validar branding, metadata y flujo de publicacion antes de operar el canal de forma publica.

---

## 1. Branding del canal

Antes de subir contenido, validar:

- Avatar visible y consistente con X, Instagram, TikTok y LinkedIn
- Banner visible y legible en desktop
- Banner visible y legible en movil/TV safe area
- Nombre del canal: `Frecuencia Global`
- Descripcion cargada y sin texto legacy
- Links del canal apuntando al website temporal y redes vigentes

### Criterio de aceptacion

- El canal se reconoce como parte del mismo sistema visual
- No hay links rotos ni handles viejos
- No hay dominio canonico protegido por auth en la descripcion

---

## 2. Metadata base

Validar en YouTube Studio:

- Descripcion del canal
- Keywords del canal
- Pais: `Mexico`
- Idioma: `es`
- Watermark configurado
- Upload defaults en categoria `News & Politics`

### Criterio de aceptacion

- La metadata ya no esta vacia
- El upload default description incluye website y redes vigentes
- El watermark aparece correctamente al final del video de prueba

---

## 3. Prueba 1 - Video largo unlisted

Subir un video de prueba en modo `Unlisted`.

Checklist:

- Titulo claro y legible
- Descripcion heredada correctamente
- Thumbnail correcta
- Categoria correcta
- Visibilidad `Unlisted`
- Sin errores de procesamiento
- Playback correcto en desktop
- Playback correcto en movil

### Criterio de aceptacion

- El video procesa sin warnings mayores
- La thumbnail se ve limpia en home y watch page
- La descripcion se ve coherente y con links correctos

---

## 4. Prueba 2 - Short unlisted

Subir un Short de prueba en modo `Unlisted` o privado.

Checklist:

- Vertical 9:16
- Portada aceptable
- Titulo corto
- Descripcion heredada o ajustada
- Watermark no molesta
- Texto no queda tapado

### Criterio de aceptacion

- El Short se reproduce bien en feed vertical
- No hay recortes inesperados en texto/logo

---

## 5. Verificaciones post-upload

- Link al website abre bien
- Links a Instagram, TikTok, X y LinkedIn abren bien
- Nombre y avatar se ven coherentes desde navegador anonimo
- No aparecen descripciones vacias ni defaults viejos

---

## 6. Go / No-Go

YouTube se considera **LISTO PARA PRUEBAS** cuando:

- Branding del canal esta aplicado
- Metadata base esta aplicada
- 1 video largo unlisted pasa
- 1 Short unlisted pasa
- No hay links rotos

---

## 7. Registro de corrida

Para cada corrida registrar:

- Fecha
- Tipo de prueba: `video largo` o `short`
- Visibilidad
- Resultado: `OK`, `PARTIAL`, `FAIL`
- Observaciones

