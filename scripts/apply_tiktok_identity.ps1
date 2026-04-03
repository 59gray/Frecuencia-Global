param(
    [string]$TiktokProfileUrl = "",
    [string]$DisplayName = "Frecuencia Global",
    [string]$ProfileImagePath = "",
    [string]$ProfileLink = ""
)

$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "fg_automation_config.ps1")

if ([string]::IsNullOrWhiteSpace($TiktokProfileUrl)) {
    $TiktokProfileUrl = Get-FgTiktokProfileUrl
}

if ([string]::IsNullOrWhiteSpace($ProfileImagePath)) {
    $ProfileImagePath = Get-FgTiktokProfileImagePath
}

if ([string]::IsNullOrWhiteSpace($ProfileLink)) {
    $ProfileLink = Get-FgWebsiteUrl
}

$bio = @"
Analisis internacional con pulso electronico
Geopolitica, cultura y poder
"@

Set-Clipboard -Value $bio

Write-Host "Bio copiada al portapapeles."
Write-Host "Display name objetivo: $DisplayName"
Write-Host "Link objetivo: $ProfileLink"
Write-Host "Foto de perfil: $ProfileImagePath"
Write-Host ""
Write-Host "PASOS RAPIDOS (2 min):"
Write-Host "1) Inicia sesion en TikTok en el navegador que se abrira."
Write-Host "2) Edit profile > Name: $DisplayName"
Write-Host "3) Edit profile > Bio: pega (Ctrl+V)"
Write-Host "4) Edit profile > Website: $ProfileLink"
Write-Host "5) Edit profile > Change photo: selecciona fg_tiktok_profile_200x200.png"
Write-Host ""

if (-not (Test-Path $ProfileImagePath)) {
    Write-Warning "No se encontro la imagen de perfil en: $ProfileImagePath"
} else {
    Start-Process explorer.exe "/select,`"$ProfileImagePath`""
}

Start-Process $TiktokProfileUrl
