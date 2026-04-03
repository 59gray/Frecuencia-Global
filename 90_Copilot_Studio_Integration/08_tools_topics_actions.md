# Tools, Topics y Actions (basado en evidencia real)

## Topics iniciales
- Inventario y clasificación de artefactos del proyecto (ver archivos listados en inventario)
- Selección de knowledge textual para Copilot Studio (solo .md verificados, ver lista en 07_knowledge_sources.md)
- Migración de workflows de 08_n8n a Power Automate (ej: wf001_export.json, wf002_export.json, wf003_export.json)
- Rediseño de scripts locales a procesos soportados por Power Platform (ej: build_podcast_cover_art.py, build_tiktok_assets.py)
- Validación de huecos del proyecto (ej: 05_Monetizacion: carpeta verificada; enumeración pendiente)
- Checklist de integración y salida a entorno

## Actions / capacidades necesarias
- Consultar knowledge textual cargado en Copilot Studio (solo archivos .md listados)
- Guiar mapeo origen → destino con rutas exactas
- Proponer sustitución de workflows n8n (.json) por flujos de Power Automate
- Proponer sustitución de scripts locales (.py, .ps1, .js) por procesos soportados
- Registrar pendientes, riesgos y validaciones manuales sobre archivos concretos

## Qué sí resuelve Copilot Studio
- Consulta de documentación estratégica y editorial listada
- Consulta de briefs, research, scripts editoriales y documentos publish-ready listados
- Respuesta guiada sobre estructura del proyecto (basada en inventario real)
- Soporte documental para la migración (solo archivos .md listados)

## Qué no debe resolverse como knowledge en Copilot Studio
- Ejecución directa de workflows n8n (ej: 08_n8n/wf001_export.json)
- Uso de .json de exportación como knowledge del agente
- Ejecución directa de scripts .ps1, .py, .js, .sh (ver scripts/)
- Manejo de secretos, .env o credenciales locales

## Qué debe ir a Power Platform / procesos externos
- Workflows de 08_n8n (ej: wf001_export.json, wf002_export.json, wf003_export.json)
- Automatizaciones hoy contenidas en scripts/ (ej: build_podcast_cover_art.py, build_tiktok_assets.py)
- Orquestación de procesos de negocio
- Integraciones externas y tareas operativas repetibles

## Pendiente real
- 05_Monetizacion: carpeta verificada; enumeración de archivos pendiente
