# Free Domain Setup — EU.org + Vercel

**Fecha:** 2026-04-02  
**Estado:** Ruta gratuita recomendada  
**Proyecto Vercel:** `website`  
**Project ID:** `prj_2DRyRxOwE3Y26kfj9zSf6ljgfQgu`

## Decisión

Ruta gratuita elegida por ahora:

1. `frecuenciaglobal.int.eu.org` — primaria
2. `frecuenciaglobal.net.eu.org` — fallback 1
3. `frecuencia-global.int.eu.org` — fallback 2
4. `frecuencia-global.net.eu.org` — fallback 3

## Aclaración importante

Estos dominios **no van a abrir en el navegador hoy** hasta completar el proceso de registro en EU.org y la delegación DNS.

- `NXDOMAIN` ahora mismo es normal.
- EU.org valida a mano y puede tardar varios días.
- El orden correcto importa.

## Orden correcto

### Paso 1. Preparar el dominio en Vercel

Entra al proyecto `website` en Vercel y agrega el dominio candidato:

- Primario: `frecuenciaglobal.int.eu.org`

Usa la opción de **nameservers / delegate DNS to Vercel** si aparece.

Apunta o anota los nameservers de Vercel para usarlos en EU.org:

- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

Si el dashboard de Vercel muestra otros nameservers en tu cuenta o proyecto, usa los que muestre Vercel.

## Paso 2. Crear cuenta en EU.org

Registro:

- https://nic.eu.org/register.html

EU.org pide:

1. Leer la policy general
2. Elegir un open domain
3. Configurar nameservers antes de pedir el dominio
4. Crear cuenta
5. Esperar validación manual por email

## Paso 3. Elegir el open domain correcto

Open domains:

- https://nic.eu.org/opendomains.html

Los relevantes para este proyecto son:

- `INT.eu.org` — International domain
- `NET.eu.org` — Network-related

No conviene empezar con un registro directo en `EU.org`, porque EU.org puede rechazarlo si existe un subdominio abierto más adecuado.

## Paso 4. Solicitar el dominio en EU.org

Solicitud recomendada:

- Hostname: `frecuenciaglobal`
- Parent domain: `INT.eu.org`

Nameservers:

- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

Si ese nombre falla por no disponibilidad o rechazo, repetir con este orden:

1. `frecuenciaglobal` en `NET.eu.org`
2. `frecuencia-global` en `INT.eu.org`
3. `frecuencia-global` en `NET.eu.org`

## Paso 5. Esperar aprobación

EU.org indica expresamente que la validación:

- requiere intervención humana
- puede tardar unos días

Hasta que llegue ese email, el dominio no debe considerarse activo.

## Paso 6. Verificar activación en Vercel

Cuando EU.org apruebe la delegación:

1. vuelve al proyecto en Vercel
2. confirma que el dominio aparece como configurado
3. márcalo como Production Domain si hace falta

## Paso 7. Actualizar la URL canónica del sitio

El sitio ya quedó preparado para esto mediante variable de entorno:

- `FG_WEBSITE_URL`

Valor esperado cuando el dominio esté activo:

```bash
FG_WEBSITE_URL=https://frecuenciaglobal.int.eu.org
```

## Paso 8. Rebuild / redeploy

Después de activar `FG_WEBSITE_URL`:

1. redeploy del proyecto en Vercel
2. verificar `canonical`, Open Graph y sitemap

## Qué ya quedó listo en el repo

El sitio ya no tiene la URL canónica hardcodeada en Astro config.

Archivo actualizado:

- `website/astro.config.mjs`

Ahora usa:

```js
site: process.env.FG_WEBSITE_URL ?? 'https://frecuenciaglobal.vercel.app'
```

## Verificaciones útiles

Antes de pedir el dominio:

- comprobar que el nombre elegido no resuelva todavía
- confirmar que el proyecto correcto en Vercel es `website`

Después de la aprobación:

- comprobar que el dominio resuelve
- abrir homepage y revisar que no redirija a `vercel.app`
- revisar sitemap y metadatos

## Nota práctica

Si quieres la ruta con menos fricción semántica para Frecuencia Global, mi recomendación sigue siendo:

- `frecuenciaglobal.int.eu.org`

Si lo que priorizas es que "suene más técnico/digital", entonces:

- `frecuenciaglobal.net.eu.org`

## Fuentes oficiales

- EU.org registro: https://nic.eu.org/register.html
- EU.org open domains: https://nic.eu.org/opendomains.html
- EU.org policy para registros directos bajo `EU.org`: https://nic.eu.org/top-policy.html
- Vercel domains docs: https://vercel.com/docs/domains/working-with-domains/add-a-domain
