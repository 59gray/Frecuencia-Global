#!/bin/bash
# export_workflows.sh — Exporta todos los workflows de n8n a JSON
# Uso: ./export_workflows.sh
#
# Requisito: n8n debe estar corriendo (docker compose up -d)

set -e

CONTAINER_NAME="n8n"
OUTPUT_DIR="$(dirname "$0")/workflows"
SUB_DIR="$OUTPUT_DIR/sub"

echo "=== Exportando workflows de n8n ==="
echo "Directorio destino: $OUTPUT_DIR"

# Verificar que n8n está corriendo
if ! docker compose ps --format json | grep -q '"n8n"'; then
  echo "ERROR: n8n no está corriendo. Ejecuta 'docker compose up -d' primero."
  exit 1
fi

# Crear directorios si no existen
mkdir -p "$OUTPUT_DIR" "$SUB_DIR"

# Exportar todos los workflows via n8n CLI dentro del container
echo "Exportando desde n8n..."
docker compose exec -T n8n n8n export:workflow --all --output=/tmp/n8n_export/ --separate

# Copiar archivos exportados
echo "Copiando archivos..."
docker compose cp n8n:/tmp/n8n_export/. "$OUTPUT_DIR/"

# Limpiar temporal en el container
docker compose exec -T n8n rm -rf /tmp/n8n_export

echo ""
echo "=== Exportación completa ==="
echo "Archivos en: $OUTPUT_DIR"
ls -la "$OUTPUT_DIR"/*.json 2>/dev/null || echo "(sin archivos principales)"
ls -la "$SUB_DIR"/*.json 2>/dev/null || echo "(sin sub-workflows)"
echo ""
echo "Recuerda hacer commit de los cambios."
