# Configuración de credenciales para automatización de canal YouTube

Sigue estos pasos para obtener y configurar las credenciales necesarias:

1. Ve a https://console.cloud.google.com/ y accede con tu cuenta de Google.
2. Crea un nuevo proyecto (o selecciona uno existente).
3. En el panel izquierdo, ve a “APIs y servicios” > “Biblioteca”.
4. Busca “YouTube Data API v3” y haz clic en “Habilitar”.
5. Ve a “APIs y servicios” > “Credenciales”.
6. Haz clic en “Crear credenciales” > “ID de cliente de OAuth”.
7. Selecciona “Aplicación de escritorio” como tipo de aplicación.
8. Descarga el archivo JSON de credenciales y guárdalo como `client_secret.json` en esta carpeta (`scripts`).
9. La primera vez que ejecutes el script, se abrirá una ventana para autorizar el acceso. Al finalizar, se generará un archivo `token.json` que se usará en futuras ejecuciones.

**Notas:**
- No compartas tus credenciales ni el archivo `token.json`.
- Si cambias de cuenta o proyecto, repite el proceso.
- El script `youtube_channel_setup.py` está listo para usar con estas credenciales.
