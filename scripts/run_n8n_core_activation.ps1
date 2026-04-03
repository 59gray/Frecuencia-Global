param(
  [string]$Email = 'j.farid.assad@gmail.com',
  [string]$BaseUrl = 'https://frecuenciaglobal.app.n8n.cloud'
)

$ErrorActionPreference = 'Stop'

function Convert-SecureStringToPlainText {
  param([Security.SecureString]$SecureString)

  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureString)
  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodeScript = Join-Path $scriptDir 'n8n_activate_core_ui.mjs'

if (-not (Test-Path $nodeScript)) {
  throw "No se encontro $nodeScript"
}

Write-Host 'n8n core activation (sin API)' -ForegroundColor Cyan
Write-Host "Email: $Email"
Write-Host "Base URL: $BaseUrl"
Write-Host ''

$securePassword = Read-Host 'Password de n8n Cloud' -AsSecureString
$plainPassword = Convert-SecureStringToPlainText -SecureString $securePassword

try {
  $env:FG_N8N_EMAIL = $Email
  $env:FG_N8N_PASSWORD = $plainPassword
  $env:FG_N8N_BASE_URL = $BaseUrl

  node $nodeScript
} finally {
  Remove-Item Env:FG_N8N_EMAIL -ErrorAction SilentlyContinue
  Remove-Item Env:FG_N8N_PASSWORD -ErrorAction SilentlyContinue
  Remove-Item Env:FG_N8N_BASE_URL -ErrorAction SilentlyContinue
}
