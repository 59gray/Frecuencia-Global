# Comandos Git y Power Platform CLI (pac)

## Versionado y ramas
```
git status
git add .
git commit -m "Mensaje descriptivo"
git pull
git push
git checkout -b feature/nueva-funcionalidad
git checkout main
git merge feature/nueva-funcionalidad
```

## Exportar solución desde Power Platform
```
pac auth create --url https://<org>.crm.dynamics.com
pac solution list
pac solution export --name <nombre_solucion> --path ./exports/<nombre_solucion>.zip --managed false
```

## Importar solución a Power Platform
```
pac solution import --path ./exports/<nombre_solucion>.zip
```

## Preparación ALM
```
pac admin environment list
pac admin environment backup --environment <env_id> --path ./backups/<env_id>.zip
```

**Nota:** Reemplaza <org>, <nombre_solucion> y <env_id> según corresponda.
