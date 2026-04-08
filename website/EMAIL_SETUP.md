# Configuración de Email - Frecuencia Global

## Correo oficial
```
contacto@frecuenciaglobal.org
```

## Opción recomendada: ForwardEmail.net (Gratuito)

ForwardEmail es un servicio gratuito de reenvío de emails que funciona perfectamente con Cloudflare.

### Pasos de configuración:

1. **Registro en ForwardEmail**
   - Ir a https://forwardemail.net
   - Crear cuenta gratuita (hasta 10 aliases)

2. **Configurar dominio**
   - Agregar dominio: `frecuenciaglobal.org`
   - Verificar propiedad del dominio (TXT record)

3. **Crear alias de reenvío**
   - Alias: `contacto@frecuenciaglobal.org`
   - Destino: tu email personal (ej: frecuenciag@outlook.com)

4. **Configurar DNS en Cloudflare**
   Agregar estos MX records:
   ```
   MX 10 mx1.forwardemail.net
   MX 20 mx2.forwardemail.net
   ```
   
   Y este TXT record de verificación:
   ```
   forwardemail=your-verification-code
   ```

5. **Probar**
   - Enviar email de prueba a `contacto@frecuenciaglobal.org`
   - Verificar llegada al correo destino

## Opción alternativa: ImprovMX (Gratuito)

1. Ir a https://improvmx.com
2. Registrar dominio `frecuenciaglobal.org`
3. Configurar MX records:
   ```
   MX 10 mx1.improvmx.com
   MX 20 mx2.improvmx.com
   ```
4. Crear alias de reenvío

## Archivos actualizados con el nuevo email

- `website/src/pages/contacto.astro` - Página de contacto
- `website/src/pages/privacy.astro` - Política de privacidad
- `website/src/pages/data-deletion.astro` - Eliminación de datos

## Notas importantes

- El email `contacto@frecuenciaglobal.org` está configurado solo para reenvío
- No es una cuenta de email completa (no puedes enviar desde ella directamente)
- Para responder como "contacto@frecuenciaglobal.org", usa la opción "Send Mail As" de Gmail/Outlook configurando SMTP

## Próximos pasos

1. [ ] Elegir servicio (ForwardEmail o ImprovMX)
2. [ ] Registrar/Configurar dominio en el servicio
3. [ ] Agregar MX records en Cloudflare DNS
4. [ ] Enviar email de prueba
5. [ ] Actualizar correos en plataformas sociales si es necesario
