# YouTube - Setup Checklist

**Sistema:** Frecuencia Global  
**Version:** 1.0  
**Fecha:** 2026-04-02  
**Estado:** Pre-lanzamiento

---

## PROPOSITO

Checklist operativo para dejar YouTube en estado `LISTO PARA PRUEBAS`.

---

## 1. CANAL Y PERFIL

| # | Tarea | Estado | Criterio de aceptacion |
|---|-------|--------|------------------------|
| 1.1 | Canal activo | ✅ Listo | Handle `@FrecuenciaGlobal` responde |
| 1.2 | Nombre del canal | ✅ Listo | `Frecuencia Global` |
| 1.3 | Avatar preparado | ✅ Listo | `06_Assets/FG_IG_Avatar_Profile_v2.png` |
| 1.4 | Banner preparado | ✅ Listo | `Frecuencia_Global_Activos_Canva_v1/FG_Banner_YouTube_v3.png` |
| 1.5 | Descripcion base | ✅ Aplicada via API | Metadata aplicada el `2026-04-02` |
| 1.6 | Links del canal | ✅ Listos para aplicar | Website + Instagram + TikTok + X + LinkedIn |
| 1.7 | Watermark | ✅ Aplicado via API | `06_Assets/fg_youtube_watermark_150.png` |
| 1.8 | Upload defaults | ✅ Listos para aplicar | Categoria, descripcion y tags definidos; falta aplicar en Studio |

---

## 2. ASSETS VISUALES

| # | Asset | Estado | Spec | Archivo |
|---|-------|--------|------|---------|
| 2.1 | Avatar de canal | ✅ Listo | PNG cuadrado, isotipo FG | `06_Assets/FG_IG_Avatar_Profile_v2.png` |
| 2.2 | Banner YouTube | ✅ Listo | PNG 2560x1440 | `Frecuencia_Global_Activos_Canva_v1/FG_Banner_YouTube_v3.png` |
| 2.3 | Watermark | ✅ Listo | PNG 150x150 | `06_Assets/fg_youtube_watermark_150.png` |

---

## 3. CONFIGURACION TECNICA

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 3.1 | Script API metadata | ✅ Listo | `scripts/youtube_channel_api_config.py` |
| 3.2 | Script setup basico | ✅ Listo | `scripts/youtube_channel_setup.py` |
| 3.3 | Script Studio config | ✅ Listo | `scripts/youtube_studio_config_cdp.py` |
| 3.4 | Script banner Studio | ✅ Listo | `scripts/youtube_studio_banner_cdp.py` |
| 3.5 | Script profile Studio | ✅ Listo | `scripts/youtube_studio_profile_cdp.py` |
| 3.6 | Preflight | ✅ Listo | `scripts/youtube_preflight.ps1` |
| 3.7 | Website temporal definido | ✅ Listo | `https://website-three-rho-26.vercel.app` |

---

## 4. CONTENIDO DE PRUEBA

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 4.1 | Video largo unlisted | ❌ Pendiente | 1 subida tecnica de prueba |
| 4.2 | Short unlisted | ❌ Pendiente | 1 subida tecnica de prueba |
| 4.3 | Thumbnail test | ❌ Pendiente | Validar rendering y legibilidad |
| 4.4 | Log de prueba | ❌ Pendiente | Registrar corrida en protocolo |

---

## 5. DOCUMENTACION

| # | Documento | Estado | Ubicacion |
|---|-----------|--------|-----------|
| 5.1 | Setup Checklist | ✅ Creado | `07_Operaciones/YOUTUBE_Setup_Checklist.md` |
| 5.2 | Status Report | ✅ Creado | `07_Operaciones/YOUTUBE_Status_Report.md` |
| 5.3 | Test Protocol | ✅ Creado | `04_Produccion/YOUTUBE_Test_Protocol.md` |
| 5.4 | Preflight Report | ✅ Generable | `07_Operaciones/YOUTUBE_Preflight_Report_2026-04-02.md` |

---

## 6. ANTES DE PROBAR

No correr pruebas publicas hasta cumplir:

- [ ] Avatar subido y validado
- [ ] Banner subido y validado
- [x] Descripcion del canal aplicada
- [ ] Links del canal aplicados
- [x] Watermark aplicado
- [ ] Upload defaults aplicados
- [ ] 1 video largo unlisted probado
- [ ] 1 Short unlisted probado
