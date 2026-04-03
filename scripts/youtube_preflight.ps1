param(
    [string]$PreviewSiteUrl = "https://website-three-rho-26.vercel.app",
    [string]$ExpectedYouTubeUrl = "https://youtube.com/@FrecuenciaGlobal",
    [string]$OutputReport = ""
)

$ErrorActionPreference = "Stop"

function Write-Check {
    param(
        [string]$Name,
        [bool]$Passed,
        [string]$Detail
    )

    [PSCustomObject]@{
        Check = $Name
        Status = if ($Passed) { "OK" } else { "FAIL" }
        Detail = $Detail
    }
}

function Test-Site {
    param(
        [string]$Url
    )

    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 20
        return [PSCustomObject]@{
            Reachable = $true
            StatusCode = [int]$response.StatusCode
            Html = $response.Content
            Detail = "HTTP $([int]$response.StatusCode)"
        }
    } catch {
        return [PSCustomObject]@{
            Reachable = $false
            StatusCode = -1
            Html = ""
            Detail = $_.Exception.Message
        }
    }
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if ([string]::IsNullOrWhiteSpace($OutputReport)) {
    $today = Get-Date -Format "yyyy-MM-dd"
    $OutputReport = "07_Operaciones/YOUTUBE_Preflight_Report_$today.md"
}

$results = @()

$requiredDocs = @(
    "07_Operaciones/YOUTUBE_Setup_Checklist.md",
    "07_Operaciones/YOUTUBE_Status_Report.md",
    "04_Produccion/YOUTUBE_Test_Protocol.md",
    "scripts/README_YOUTUBE_SETUP.md"
)

foreach ($doc in $requiredDocs) {
    $exists = Test-Path $doc
    $results += Write-Check -Name "Doc exists: $doc" -Passed $exists -Detail ($(if ($exists) { "Present" } else { "Missing" }))
}

$requiredScripts = @(
    "scripts/youtube_preflight.ps1",
    "scripts/youtube_channel_api_config.py",
    "scripts/youtube_channel_setup.py",
    "scripts/youtube_studio_config_cdp.py",
    "scripts/youtube_studio_banner_cdp.py",
    "scripts/youtube_studio_profile_cdp.py"
)

foreach ($script in $requiredScripts) {
    $exists = Test-Path $script
    $results += Write-Check -Name "Script exists: $script" -Passed $exists -Detail ($(if ($exists) { "Present" } else { "Missing" }))
}

$footerPath = "website/src/components/Footer.astro"
$contactPath = "website/src/pages/contacto.astro"
$apiConfigPath = "scripts/youtube_channel_api_config.py"
$studioConfigPath = "scripts/youtube_studio_config_cdp.py"

$footerContent = Get-Content $footerPath -Raw
$contactContent = Get-Content $contactPath -Raw
$apiConfigContent = Get-Content $apiConfigPath -Raw
$studioConfigContent = Get-Content $studioConfigPath -Raw

$results += Write-Check -Name "Footer has YouTube URL" -Passed ($footerContent.Contains($ExpectedYouTubeUrl)) -Detail $footerPath
$results += Write-Check -Name "Contacto has YouTube URL" -Passed ($contactContent.Contains($ExpectedYouTubeUrl)) -Detail $contactPath
$results += Write-Check -Name "API config references WEBSITE_URL" -Passed ($apiConfigContent.Contains("WEBSITE_URL")) -Detail $apiConfigPath
$results += Write-Check -Name "Studio config references WEBSITE_URL" -Passed ($studioConfigContent.Contains("WEBSITE_URL")) -Detail $studioConfigPath

$assetExpectations = @(
    @{ Path = "06_Assets/FG_IG_Avatar_Profile_v2.png"; W = 400; H = 400 },
    @{ Path = "Frecuencia_Global_Activos_Canva_v1/FG_Banner_YouTube_v3.png"; W = 2560; H = 1440 },
    @{ Path = "06_Assets/fg_youtube_watermark_150.png"; W = 150; H = 150 }
)

foreach ($asset in $assetExpectations) {
    $exists = Test-Path $asset.Path
    $results += Write-Check -Name "Asset exists: $($asset.Path)" -Passed $exists -Detail ($(if ($exists) { $asset.Path } else { "Missing" }))
}

$python = Get-Command python -ErrorAction SilentlyContinue
if ($null -eq $python) {
    $results += Write-Check -Name "Python available for image dimension checks" -Passed $false -Detail "python command not found"
} else {
    $dimScript = @"
from PIL import Image
import json
import sys
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    payload = json.load(f)
for item in payload:
    try:
        img = Image.open(item["path"])
        aw, ah = img.size
        ok = (aw == item["expected_w"] and ah == item["expected_h"])
        print(f"{item['path']}|{aw}x{ah}|{item['expected_w']}x{item['expected_h']}|{ok}")
    except Exception:
        print(f"{item['path']}|ERROR|{item['expected_w']}x{item['expected_h']}|False")
"@

    $payload = @()
    foreach ($item in $assetExpectations) {
        if (Test-Path $item.Path) {
            $payload += @{
                path = Join-Path $repoRoot $item.Path
                expected_w = $item.W
                expected_h = $item.H
            }
        }
    }

    if ($payload.Count -gt 0) {
        $tmpPy = [System.IO.Path]::GetTempFileName() + ".py"
        $tmpJson = [System.IO.Path]::GetTempFileName() + ".json"
        Set-Content -Path $tmpPy -Value $dimScript -Encoding ASCII
        Set-Content -Path $tmpJson -Value ($payload | ConvertTo-Json -Compress) -Encoding ASCII
        $dimOutput = python $tmpPy $tmpJson
        Remove-Item $tmpPy -Force -ErrorAction SilentlyContinue
        Remove-Item $tmpJson -Force -ErrorAction SilentlyContinue

        foreach ($line in $dimOutput) {
            $parts = $line -split "\|"
            if ($parts.Length -ge 4) {
                $path = $parts[0]
                $actual = $parts[1]
                $expected = $parts[2]
                $ok = ($parts[3] -eq "True")
                $results += Write-Check -Name "Dimensions: $([System.IO.Path]::GetFileName($path))" -Passed $ok -Detail "Actual $actual / Expected $expected"
            }
        }
    }
}

$tokenExists = Test-Path "scripts/token.json"
$results += Write-Check -Name "OAuth token present for YouTube API" -Passed $tokenExists -Detail ($(if ($tokenExists) { "scripts/token.json" } else { "Missing token.json" }))

$previewTest = Test-Site -Url $PreviewSiteUrl
$results += Write-Check -Name "Preview URL reachable" -Passed $previewTest.Reachable -Detail "$PreviewSiteUrl ($($previewTest.Detail))"
if ($previewTest.Reachable) {
    $results += Write-Check -Name "Preview has YouTube URL" -Passed ($previewTest.Html -match [Regex]::Escape($ExpectedYouTubeUrl)) -Detail $PreviewSiteUrl
}

$okCount = ($results | Where-Object { $_.Status -eq "OK" }).Count
$failCount = ($results | Where-Object { $_.Status -eq "FAIL" }).Count
$overall = if ($failCount -eq 0) { "PASS" } else { "PARTIAL" }

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$lines = @()
$lines += "# YouTube Preflight Report"
$lines += ""
$lines += "- Fecha: $timestamp"
$lines += "- Preview URL: $PreviewSiteUrl"
$lines += "- Resultado global: **$overall**"
$lines += "- Checks OK: $okCount"
$lines += "- Checks FAIL: $failCount"
$lines += ""
$lines += "## Resultados"
$lines += ""
$lines += "| Check | Estado | Detalle |"
$lines += "|-------|--------|---------|"

foreach ($r in $results) {
    $lines += "| $($r.Check) | $($r.Status) | $($r.Detail) |"
}

$lines += ""
$lines += "## Recomendacion"
$lines += ""
if ($failCount -eq 0) {
    $lines += "YouTube queda tecnicamente listo para ejecutar pruebas controladas."
} else {
    $lines += "Corregir checks en FAIL antes de declarar YouTube listo para pruebas."
}

$outDir = Split-Path -Parent $OutputReport
if (-not [string]::IsNullOrWhiteSpace($outDir) -and -not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

Set-Content -Path $OutputReport -Value ($lines -join "`r`n") -Encoding ASCII

Write-Host "Preflight complete: $overall"
Write-Host "Report: $OutputReport"
$results | Format-Table -AutoSize

if ($failCount -gt 0) {
    exit 2
}
