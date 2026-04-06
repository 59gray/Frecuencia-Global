# Carga variables de entorno desde .env.local a la sesión actual de PowerShell
# Uso: . .\scripts\load_local_secrets.ps1
# Nota: El punto al inicio es importante para cargar en la sesión actual

param(
    [string]$EnvFile = ".env.local"
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir
$envPath = Join-Path $repoRoot $EnvFile

# Verificar que el archivo existe
if (-not (Test-Path $envPath)) {
    Write-Host "[WARN] No se encontró $EnvFile en la raíz del proyecto" -ForegroundColor Yellow
    Write-Host "       Ruta esperada: $envPath"
    Write-Host "       Copia .env.local.example a .env.local y completa los valores"
    exit 0
}

$loadedCount = 0

foreach ($line in Get-Content $envPath) {
    # Ignorar líneas vacías y comentarios
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    if ($line.StartsWith("#")) { continue }
    
    # Parsear KEY=VALUE
    if ($line -match "^([^=]+)=(.*)$") {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        
        # Solo cargar si tiene valor
        if (-not [string]::IsNullOrWhiteSpace($value)) {
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "[OK] Secret loaded: $key"
            $loadedCount++
        }
    }
}

Write-Host ""
Write-Host "[SUMMARY] $loadedCount secret(s) cargados en la sesión actual" -ForegroundColor Green
Write-Host "          Para verificar: .\scripts\check_required_secrets.ps1"
