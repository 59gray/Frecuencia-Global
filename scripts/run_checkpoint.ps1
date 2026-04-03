$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir '..')
Set-Location $repoRoot

$batPath = Join-Path $scriptDir 'run_checkpoint.bat'
if (-not (Test-Path $batPath)) {
    Write-Error "run_checkpoint.bat no encontrado en $scriptDir"
    exit 1
}

& $batPath
exit $LASTEXITCODE
