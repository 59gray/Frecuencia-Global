# Website Frequencies Route — TODO

## Contexto
- La ruta pública visible usa "Frecuencias" (nav header, copy del sitio).
- El slug técnico actual sigue siendo `/pilares`.

## Pendiente futuro
Evaluar redirección `/frecuencias` → `/pilares` o migración limpia de slug.

## Criterios antes de hacer el cambio
- Revisar todos los enlaces internos que apunten a `/pilares`.
- Evaluar impacto SEO (canonical, sitemap, backlinks existentes).
- Configurar redirect 301 en Cloudflare Pages antes de eliminar la ruta vieja.
- Verificar que el sitemap.xml se actualice correctamente post-migración.

## No hacer cambio de slug sin
- Revisar enlaces internos completos (`rg -n "/pilares" website/src`).
- Confirmar ausencia de backlinks indexados en Search Console.
- Redirect configurado en Cloudflare antes del deploy.

## Fecha de creación
2026-04-26
