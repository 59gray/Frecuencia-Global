param(
    [string]$PreviewSiteUrl = "https://website-three-rho-26.vercel.app",
    [string]$CanonicalSiteUrl = "https://frecuenciaglobal.vercel.app",
    [string]$ExpectedTiktokUrl = "https://tiktok.com/@frecuenciaglobal",
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
            Protected = $false
            Detail = "HTTP $([int]$response.StatusCode)"
        }
    } catch {
        $statusCode = -1
        $html = ""

        try {
            if ($null -ne $_.Exception.Response) {
                $statusCode = [int]$_.Exception.Response.StatusCode
                $stream = $_.Exception.Response.GetResponseStream()
                if ($null -ne $stream) {
                    $reader = New-Object System.IO.StreamReader($stream)
                    $html = $reader.ReadToEnd()
                    $reader.Dispose()
                }
            }
        } catch {
            $html = ""
        }

        $isProtected = ($statusCode -eq 401) -or ($html -match "Vercel Authentication")
        $detail = if ($isProtected) {
            "Protected by Vercel Authentication (401)"
        } elseif ($statusCode -gt 0) {
            "HTTP $statusCode"
        } else {
            $_.Exception.Message
        }

        return [PSCustomObject]@{
            Reachable = $false
            StatusCode = $statusCode
            Html = $html
            Protected = $isProtected
            Detail = $detail
        }
    }
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if ([string]::IsNullOrWhiteSpace($OutputReport)) {
    $today = Get-Date -Format "yyyy-MM-dd"
    $OutputReport = "07_Operaciones/TIKTOK_Preflight_Report_$today.md"
}

$results = @()

$requiredDocs = @(
    "02_Brand_System/TIKTOK_Asset_Specs.md",
    "04_Produccion/TIKTOK_Test_Protocol.md",
    "07_Operaciones/TIKTOK_Setup_Checklist.md",
    "07_Operaciones/TIKTOK_Status_Report.md"
)

foreach ($doc in $requiredDocs) {
    $exists = Test-Path $doc
    $detail = if ($exists) { "Present" } else { "Missing" }
    $results += Write-Check -Name "Doc exists: $doc" -Passed $exists -Detail $detail
}

$footerPath = "website/src/components/Footer.astro"
$contactPath = "website/src/pages/contacto.astro"
$footerContent = Get-Content $footerPath -Raw
$contactContent = Get-Content $contactPath -Raw

$results += Write-Check -Name "Footer has TikTok URL" -Passed ($footerContent.Contains($ExpectedTiktokUrl)) -Detail $footerPath
$results += Write-Check -Name "Contacto has TikTok URL" -Passed ($contactContent.Contains($ExpectedTiktokUrl)) -Detail $contactPath

$assetChecks = @(
    @{ Path = "Frecuencia_Global_Assets_Base/assets/fg_tiktok_profile_200x200.png"; W = 200; H = 200 },
    @{ Path = "Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920.png"; W = 1080; H = 1920 },
    @{ Path = "Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920_guides.png"; W = 1080; H = 1920 }
)

foreach ($asset in $assetChecks) {
    $exists = Test-Path $asset.Path
    $results += Write-Check -Name "Asset exists: $($asset.Path)" -Passed $exists -Detail $asset.Path
}

$entryPoints = @(
    "scripts/tiktok_apply_profile_persistent.mjs",
    "scripts/tiktok_apply_profile_wait_login.mjs",
    "scripts/tiktok_apply_profile.mjs",
    "scripts/apply_tiktok_identity.ps1"
)

foreach ($entryPoint in $entryPoints) {
    $exists = Test-Path $entryPoint
    $results += Write-Check -Name "Entry point exists: $entryPoint" -Passed $exists -Detail $entryPoint
}

$python = Get-Command python -ErrorAction SilentlyContinue
if ($null -eq $python) {
    $results += Write-Check -Name "Python available for image dimension checks" -Passed $false -Detail "python command not found"
} else {
    $dimScript = @"
from PIL import Image
checks = [
    (r'Frecuencia_Global_Assets_Base/assets/fg_tiktok_profile_200x200.png', (200, 200)),
    (r'Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920.png', (1080, 1920)),
    (r'Frecuencia_Global_Assets_Base/assets/fg_tiktok_cover_1080x1920_guides.png', (1080, 1920)),
]
for path, expected in checks:
    try:
        img = Image.open(path)
        print(f'{path}|{img.size[0]}x{img.size[1]}|{expected[0]}x{expected[1]}|{img.size == expected}')
    except Exception:
        print(f'{path}|ERROR|{expected[0]}x{expected[1]}|False')
"@

    $tmpPy = [System.IO.Path]::GetTempFileName() + ".py"
    Set-Content -Path $tmpPy -Value $dimScript -Encoding ASCII
    $dimOutput = python $tmpPy
    Remove-Item $tmpPy -Force -ErrorAction SilentlyContinue

    foreach ($line in $dimOutput) {
        $parts = $line -split "\|"
        if ($parts.Length -ge 4) {
            $assetPath = $parts[0]
            $actual = $parts[1]
            $expected = $parts[2]
            $ok = ($parts[3] -eq "True")
            $results += Write-Check -Name "Dimensions: $assetPath" -Passed $ok -Detail "Actual $actual / Expected $expected"
        }
    }
}

$previewTest = Test-Site -Url $PreviewSiteUrl
$canonicalTest = Test-Site -Url $CanonicalSiteUrl

$results += Write-Check -Name "Preview URL reachable" -Passed $previewTest.Reachable -Detail "$PreviewSiteUrl ($($previewTest.Detail))"
$results += Write-Check -Name "Canonical URL publicly reachable" -Passed $canonicalTest.Reachable -Detail "$CanonicalSiteUrl ($($canonicalTest.Detail))"

if ($previewTest.Reachable) {
    $results += Write-Check -Name "Preview has TikTok URL" -Passed ($previewTest.Html -match [Regex]::Escape($ExpectedTiktokUrl)) -Detail $PreviewSiteUrl
}

if ($canonicalTest.Protected) {
    $results += Write-Check -Name "Canonical is not protected by auth" -Passed $false -Detail "Disable Vercel Authentication for production access"
}

$okCount = ($results | Where-Object { $_.Status -eq "OK" }).Count
$failCount = ($results | Where-Object { $_.Status -eq "FAIL" }).Count
$overall = if ($failCount -eq 0) { "PASS" } else { "PARTIAL" }

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$lines = @()
$lines += "# TikTok Preflight Report"
$lines += ""
$lines += "- Fecha: $timestamp"
$lines += "- Preview URL: $PreviewSiteUrl"
$lines += "- Canonical URL: $CanonicalSiteUrl"
$lines += "- Resultado global: **$overall**"
$lines += "- Checks OK: $okCount"
$lines += "- Checks FAIL: $failCount"
$lines += ""
$lines += "## Resultados"
$lines += ""
$lines += "| Check | Estado | Detalle |"
$lines += "|-------|--------|---------|"

foreach ($r in $results) {
    $statusText = if ($r.Status -eq "OK") { "OK" } else { "FAIL" }
    $lines += "| $($r.Check) | $statusText | $($r.Detail) |"
}

$lines += ""
$lines += "## Recomendacion"
$lines += ""
if ($failCount -eq 0) {
    $lines += "TikTok queda tecnicamente lista para pruebas controladas."
} else {
    $lines += "Corregir checks en FAIL antes de declarar TikTok lista para pruebas."
}

$outDir = Split-Path -Parent $OutputReport
if (-not [string]::IsNullOrWhiteSpace($outDir) -and -not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

Set-Content -Path $OutputReport -Value ($lines -join "`r`n") -Encoding ASCII

Write-Host ""
Write-Host "TIKTOK PREFLIGHT RESULT: $overall"
Write-Host "Checks OK: $okCount"
Write-Host "Checks FAIL: $failCount"
Write-Host "Report: $OutputReport"
Write-Host ""
$results | Format-Table -AutoSize

if ($failCount -gt 0) {
    exit 2
}
