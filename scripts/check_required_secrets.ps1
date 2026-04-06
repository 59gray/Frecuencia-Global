# Valida presencia de secretos requeridos y opcionales para Frecuencia Global
# Uso: .\scripts\check_required_secrets.ps1
# Exit code 0 = todo OK, 1 = falta algo requerido

param()

$required = @(
    "THREADS_ACCESS_TOKEN"
)

$optional = @(
    "THREADS_USER_ID",
    "GEMINI_API_KEY",
    "IG_ACCESS_TOKEN",
    "TELEGRAM_BOT_TOKEN"
)

$missing = @()
$present = @()

Write-Host '=== Verificacion de Secretos - Frecuencia Global ===' -ForegroundColor Cyan
Write-Host ""

# Verificar requeridos
foreach ($var in $required) {
    $value = [Environment]::GetEnvironmentVariable($var, 'Process')
    if ([string]::IsNullOrWhiteSpace($value)) {
        Write-Host '[MISSING]' $var '(REQUERIDO)' -ForegroundColor Red
        $missing += $var
    } else {
        Write-Host '[OK]' $var -ForegroundColor Green
        $present += $var
    }
}

# Auto-cargar .env.local si faltan secretos requeridos
if ($missing.Count -gt 0) {
    Write-Host ''
    Write-Host '[INFO] Intentando auto-cargar desde .env.local...' -ForegroundColor Cyan

    $repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
    $envPath = Join-Path $repoRoot '.env.local'

    if (Test-Path $envPath) {
        $loadedCount = 0
        foreach ($line in Get-Content $envPath) {
            if ([string]::IsNullOrWhiteSpace($line)) { continue }
            if ($line.StartsWith('#')) { continue }
            if ($line -match '^([^=]+)=(.*)$') {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                if (-not [string]::IsNullOrWhiteSpace($value)) {
                    [Environment]::SetEnvironmentVariable($key, $value, 'Process')
                    if ($required -contains $key -or $optional -contains $key) {
                        Write-Host '[LOADED]' $key -ForegroundColor Green
                        $loadedCount++
                    }
                }
            }
        }
        Write-Host ('[INFO] ' + $loadedCount + ' secret(s) cargados de .env.local') -ForegroundColor Gray

        # Re-verificar requeridos
        $missing = @()
        $present = @()
        foreach ($var in $required) {
            $value = [Environment]::GetEnvironmentVariable($var, 'Process')
            if ([string]::IsNullOrWhiteSpace($value)) {
                Write-Host '[STILL MISSING]' $var '(REQUERIDO)' -ForegroundColor Red
                $missing += $var
            } else {
                Write-Host '[OK]' $var -ForegroundColor Green
                $present += $var
            }
        }
    } else {
        Write-Host '[WARN] .env.local no encontrado' -ForegroundColor Yellow
    }
}

# Verificar opcionales (despues de posible carga)
foreach ($var in $optional) {
    $value = [Environment]::GetEnvironmentVariable($var, 'Process')
    if ([string]::IsNullOrWhiteSpace($value)) {
        Write-Host '[SKIP]' $var '(opcional, no configurado)' -ForegroundColor Yellow
    } else {
        Write-Host '[OK]' $var '(opcional)' -ForegroundColor Green
        $present += $var
    }
}

# Verificar archivos OAuth
Write-Host ""
$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$tokenJson = Join-Path $repoRoot 'scripts\token.json'
$clientSecret = Join-Path $repoRoot 'scripts\client_secret.json'

if (Test-Path $tokenJson) {
    Write-Host '[OK] token.json (YouTube OAuth)' -ForegroundColor Green
} else {
    Write-Host '[WARN] token.json no encontrado (YouTube)' -ForegroundColor Yellow
}

if (Test-Path $clientSecret) {
    Write-Host '[OK] client_secret.json (YouTube)' -ForegroundColor Green
} else {
    Write-Host '[WARN] client_secret.json no encontrado' -ForegroundColor Yellow
}

Write-Host ""

if ($missing.Count -eq 0) {
    Write-Host '[PASS] Todos los secretos requeridos estan presentes' -ForegroundColor Green
    Write-Host '       ' $present.Count 'secret(s) verificados' -ForegroundColor Gray
    exit 0
} else {
    Write-Host '[FAIL] Faltan' $missing.Count 'secreto(s) requerido(s)' -ForegroundColor Red
    Write-Host '       Verifica que .env.local contenga los valores correctos' -ForegroundColor Yellow
    exit 1
}
