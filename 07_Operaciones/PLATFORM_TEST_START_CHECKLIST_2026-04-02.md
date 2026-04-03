# Platform Test Start Checklist - 2026-04-02

Checklist corto para dejar **Instagram**, **LinkedIn** y **YouTube** listos para pruebas controladas sin esperar al dominio final.

---

## Instagram

Estado base:

- Creator account ya activada
- Usar website temporal: `https://website-three-rho-26.vercel.app`

Campos a aplicar:

- Display name: `Frecuencia Global`
- Avatar: `C:\Users\farid\Documents\Frecuencia Global\06_Assets\FG_IG_Avatar_Profile_v2.png`
- Bio:

```text
Analisis internacional con pulso electronico ⚡
Geopolitica x musica electronica x datos
```

- Website: `https://website-three-rho-26.vercel.app`
- Categoria: `Education` o `News & Media`

Primera prueba recomendada:

1. Story placeholder en Close Friends
2. Guardar un draft de post o carrusel
3. Validar avatar, bio y link en movil

---

## LinkedIn

Campos a aplicar:

- Logo: `C:\Users\farid\Documents\Frecuencia Global\04_Produccion\linkedin_assets\fg_linkedin_profile_400x400.png`
- Banner: `C:\Users\farid\Documents\Frecuencia Global\04_Produccion\linkedin_assets\fg_linkedin_banner_1584x396.png`
- Name: `Frecuencia Global`
- Tagline: `Analisis internacional con pulso electronico | Geopolitica, datos y contexto`
- Website: `https://website-three-rho-26.vercel.app`
- Industry: `Online Media` o `Media & Communications`
- Company size: `1-10 employees`
- CTA: `Visit website`

About:

```text
Frecuencia Global es una plataforma de analisis internacional con identidad electronica.

Traducimos geopolitica, cultura y poder a formatos accesibles, visuales y consistentes.

Pilares editoriales:
- Geopolitik Drop
- Bass & Borders
- Frecuencia Global
- Behind the Policy
```

Primera prueba recomendada:

1. Post solo texto
2. Post con link al website temporal
3. Validar preview del link y aspecto del banner/logo

---

## YouTube

Assets:

- Avatar: `C:\Users\farid\Documents\Frecuencia Global\06_Assets\FG_IG_Avatar_Profile_v2.png`
- Banner: `C:\Users\farid\Documents\Frecuencia Global\Frecuencia_Global_Activos_Canva_v1\FG_Banner_YouTube_v3.png`
- Watermark: `C:\Users\farid\Documents\Frecuencia Global\06_Assets\fg_youtube_watermark_150.png`

Metadata base:

- Website temporal: `https://website-three-rho-26.vercel.app`
- Links: Instagram, TikTok, X, LinkedIn
- Categoria default: `News & Politics`
- Descripcion y watermark: ya aplicados via API el `2026-04-02`

Primera prueba recomendada:

1. Video largo `Unlisted`
2. Short `Unlisted` o privado
3. Validar thumbnail, descripcion, links y watermark

Scripts utiles:

- `powershell -ExecutionPolicy Bypass -File scripts/youtube_preflight.ps1`
- `python scripts/youtube_channel_api_config.py`
- `python scripts/youtube_studio_profile_cdp.py`
- `python scripts/youtube_studio_banner_cdp.py`
- `python scripts/youtube_studio_config_cdp.py`
