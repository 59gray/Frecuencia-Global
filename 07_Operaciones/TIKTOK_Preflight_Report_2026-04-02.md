# TikTok Preflight Report

- Fecha: 2026-04-02 12:21:50
- Preview URL: https://website-three-rho-26.vercel.app
- Canonical URL: https://frecuenciaglobal.vercel.app
- Resultado global: **PARTIAL**
- Checks OK: 17
- Checks FAIL: 3

## Resultados

| Check | Estado | Detalle |
|-------|--------|---------|
| Doc exists: 02_Brand_System/TIKTOK_Asset_Specs.md | OK | Present |
| Doc exists: 04_Produccion/TIKTOK_Test_Protocol.md | OK | Present |
| Doc exists: 07_Operaciones/TIKTOK_Setup_Checklist.md | OK | Present |
| Doc exists: 07_Operaciones/TIKTOK_Status_Report.md | OK | Present |
| Footer has TikTok URL | OK | website/src/components/Footer.astro |
| Contacto has TikTok URL | OK | website/src/pages/contacto.astro |
| Asset exists: Frecuencia_Global_Assets_Base/assets/fg_tiktok_profile_200x200.png | OK | Frecuencia_Global_Assets_Base/assets/fg_tiktok_profile_200x200.png |
| Asset exists: Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920.png | OK | Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920.png |
| Asset exists: Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920_guides.png | OK | Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920_guides.png |
| Entry point exists: scripts/tiktok_apply_profile_persistent.mjs | OK | scripts/tiktok_apply_profile_persistent.mjs |
| Entry point exists: scripts/tiktok_apply_profile_wait_login.mjs | OK | scripts/tiktok_apply_profile_wait_login.mjs |
| Entry point exists: scripts/tiktok_apply_profile.mjs | OK | scripts/tiktok_apply_profile.mjs |
| Entry point exists: scripts/apply_tiktok_identity.ps1 | OK | scripts/apply_tiktok_identity.ps1 |
| Dimensions: Frecuencia_Global_Assets_Base/assets/fg_tiktok_profile_200x200.png | OK | Actual 200x200 / Expected 200x200 |
| Dimensions: Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920.png | OK | Actual 1080x1920 / Expected 1080x1920 |
| Dimensions: Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920_guides.png | OK | Actual 1080x1920 / Expected 1080x1920 |
| Preview URL reachable | OK | https://website-three-rho-26.vercel.app (HTTP 200) |
| Canonical URL publicly reachable | FAIL | https://frecuenciaglobal.vercel.app (Protected by Vercel Authentication (401)) |
| Preview has TikTok URL | FAIL | https://website-three-rho-26.vercel.app |
| Canonical is not protected by auth | FAIL | Disable Vercel Authentication for production access |

## Recomendacion

Corregir checks en FAIL antes de declarar TikTok lista para pruebas.
