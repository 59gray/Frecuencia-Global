# Arquitectura Objetivo (basada en evidencia real)

## 1. Capa de conocimiento en Copilot Studio
Cargar únicamente documentación textual verificada del proyecto (solo archivos .md listados en 07_knowledge_sources.md):
- 01_Estrategia/FG_Blueprint_Maestro.md
- 01_Estrategia/FG_Diagnostico_Brechas.md
- 03_Editorial/P1_001_Script.md
- 04_Produccion/FG_Flujo_Produccion_Podcast.md
- 04_Produccion/FG_Flujo_Produccion_Video.md
- 04_Produccion/EP_001_PublishReady.md
- 04_Produccion/EP_002_PublishReady.md
- 04_Produccion/P1_001_QA.md
- 04_Produccion/P1_001_QA_FINAL.md

## 2. Capa de automatización en Power Platform
Rediseñar aquí los artefactos técnicos:
- workflows de 08_n8n (ej: wf001_export.json, wf002_export.json, wf003_export.json)
- scripts de scripts/ (ej: build_podcast_cover_art.py, build_tiktok_assets.py)
- integraciones operativas
- procesos de negocio repetibles

## 3. Repositorio externo
Mantener fuera de Copilot Studio:
- 02_Brand_System/FG_Brand_Kit_Operativo.md (referencia visual)
- 06_Assets/ (activos visuales)
- imágenes, binarios, secretos y archivos de entorno
- scripts fuente y exports técnicos

## 4. Reglas de separación
- .md documentales listados → candidatos a knowledge
- .json de workflow (ej: 08_n8n/wf001_export.json) → artefactos técnicos de migración
- .ps1 / .py / .js / .sh (ej: scripts/build_podcast_cover_art.py) → rediseño externo o Power Platform
- .env / credenciales → nunca como knowledge

## 5. Flujo objetivo
1. Documentación textual verificada → Copilot Studio
2. Workflows n8n y scripts listados → Power Platform / rediseño
3. Activos visuales y material técnico auxiliar → repositorio externo
4. Validación final → checklist + revisión manual

## 6. Hueco abierto
- 05_Monetizacion: existe, pero su enumeración sigue pendiente
