param(
    [string]$PreviewSiteUrl = "https://website-three-rho-26.vercel.app",
    [string]$CanonicalSiteUrl = "https://frecuenciaglobal.vercel.app",
    [string]$ExpectedInstagramUrl = "https://instagram.com/globalfrequency.es",
    [string]$ExpectedHandle = "@globalfrequency.es",
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

function Find-AssetPath {
    param(
        [string]$RepoRoot,
        [string]$FileName
    )

    $match = Get-ChildItem -Path $RepoRoot -Recurse -File -Filter $FileName -ErrorAction SilentlyContinue |
        Select-Object -First 1

    if ($null -eq $match) {
        return $null
    }

    return $match.FullName
}

function Convert-ToRelativePath {
    param(
        [string]$RepoRoot,
        [string]$AbsolutePath
    )

    if ([string]::IsNullOrWhiteSpace($AbsolutePath)) {
        return "(not found)"
    }

    $rel = $AbsolutePath.Replace($RepoRoot, "").TrimStart([char[]]@('\', '/'))
    return $rel.Replace('\\', '/')
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
    $OutputReport = "07_Operaciones/INSTAGRAM_Preflight_Report_$today.md"
}

$results = @()

# 1) Required docs
$requiredDocs = @(
    "02_Brand_System/INSTAGRAM_Asset_Specs.md",
    "04_Produccion/INSTAGRAM_Test_Protocol.md",
    "07_Operaciones/INSTAGRAM_Setup_Checklist.md",
    "07_Operaciones/INSTAGRAM_Status_Report.md"
)

foreach ($doc in $requiredDocs) {
    $exists = Test-Path $doc
    $detail = "Missing"
    if ($exists) {
        $detail = "Present"
    }
    $results += Write-Check -Name "Doc exists: $doc" -Passed $exists -Detail $detail
}

# 2) Website source consistency
$footerPath = "website/src/components/Footer.astro"
$contactPath = "website/src/pages/contacto.astro"
$layoutPath = "website/src/layouts/BaseLayout.astro"
$astroConfigPath = "website/astro.config.mjs"

$footerContent = Get-Content $footerPath -Raw
$contactContent = Get-Content $contactPath -Raw
$layoutContent = Get-Content $layoutPath -Raw
$astroConfigContent = Get-Content $astroConfigPath -Raw

$results += Write-Check -Name "Footer has Instagram URL" -Passed ($footerContent.Contains($ExpectedInstagramUrl)) -Detail $footerPath
$results += Write-Check -Name "Contacto has Instagram URL" -Passed ($contactContent.Contains($ExpectedInstagramUrl)) -Detail $contactPath
$results += Write-Check -Name "Layout has og:title" -Passed ($layoutContent.Contains('property="og:title"')) -Detail $layoutPath
$results += Write-Check -Name "Layout has twitter:card" -Passed ($layoutContent.Contains('property="twitter:card"')) -Detail $layoutPath
$results += Write-Check -Name "Astro site uses canonical domain" -Passed ($astroConfigContent.Contains("https://frecuenciaglobal.vercel.app")) -Detail $astroConfigPath

# 3) Required assets (existence + dimensions)
$assetExpectations = @(
    @{ File = "FG_IG_Avatar_Profile_v2.png"; W = 400; H = 400 },
    @{ File = "FG_IG_Highlight_Series_v2.png"; W = 1080; H = 1920 },
    @{ File = "FG_IG_Highlight_News_v2.png"; W = 1080; H = 1920 },
    @{ File = "FG_IG_Highlight_Policy_v2.png"; W = 1080; H = 1920 },
    @{ File = "FG_IG_Highlight_Borders_v2.png"; W = 1080; H = 1920 },
    @{ File = "FG_IG_Highlight_Maps_v2.png"; W = 1080; H = 1920 },
    @{ File = "FG_IG_Highlight_About_v2.png"; W = 1080; H = 1920 },
    @{ File = "FG_Reels_Overlay_Full_v1.png"; W = 1080; H = 1920 },
    @{ File = "FG_Reels_Overlay_Minimal_v1.png"; W = 1080; H = 1920 },
    @{ File = "FG_Reels_Overlay_Guide_v1.png"; W = 1080; H = 1920 },
    @{ File = "FG_ReelCover_Master_v1.png"; W = 1080; H = 1920 },
    @{ File = "FG_Carousel_GeopolitikDrop_Cover_v1.png"; W = 1080; H = 1350 },
    @{ File = "FG_Carousel_GeopolitikDrop_Internal_v1.png"; W = 1080; H = 1350 },
    @{ File = "FG_Carousel_BassAndBorders_Cover_v1.png"; W = 1080; H = 1350 },
    @{ File = "FG_Carousel_BassAndBorders_Internal_v1.png"; W = 1080; H = 1350 },
    @{ File = "FG_Carousel_FrecuenciaGlobal_Cover_v1.png"; W = 1080; H = 1350 },
    @{ File = "FG_Carousel_FrecuenciaGlobal_Internal_v1.png"; W = 1080; H = 1350 },
    @{ File = "FG_Carousel_BehindThePolicy_Cover_v1.png"; W = 1080; H = 1350 },
    @{ File = "FG_Carousel_BehindThePolicy_Internal_v1.png"; W = 1080; H = 1350 }
)

$resolvedAssets = @()

foreach ($asset in $assetExpectations) {
    $fullPath = Find-AssetPath -RepoRoot $repoRoot -FileName $asset.File
    $exists = -not [string]::IsNullOrWhiteSpace($fullPath)
    $relPath = Convert-ToRelativePath -RepoRoot $repoRoot -AbsolutePath $fullPath

    $results += Write-Check -Name "Asset exists: $($asset.File)" -Passed $exists -Detail $relPath

    if ($exists) {
        $resolvedAssets += [PSCustomObject]@{
            File = $asset.File
            Path = $fullPath
            ExpectedW = $asset.W
            ExpectedH = $asset.H
        }
    }
}

$python = Get-Command python -ErrorAction SilentlyContinue
if ($null -eq $python) {
    $results += Write-Check -Name "Python available for image dimension checks" -Passed $false -Detail "python command not found"
} elseif ($resolvedAssets.Count -eq 0) {
    $results += Write-Check -Name "Image dimension checks" -Passed $false -Detail "No assets resolved"
} else {
    $dimScript = @"
from PIL import Image
import json
import sys
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    payload = json.load(f)
for item in payload:
    path = item['path']
    ew = item['expected_w']
    eh = item['expected_h']
    name = item['file']
    try:
        img = Image.open(path)
        aw, ah = img.size
        ok = (aw == ew and ah == eh)
        print(f"{name}|{aw}x{ah}|{ew}x{eh}|{ok}")
    except Exception:
        print(f"{name}|ERROR|{ew}x{eh}|False")
"@

    $payload = @()
    foreach ($item in $resolvedAssets) {
        $payload += @{
            file = $item.File
            path = $item.Path
            expected_w = $item.ExpectedW
            expected_h = $item.ExpectedH
        }
    }

    $jsonPayload = ($payload | ConvertTo-Json -Compress)
    $tmpPy = [System.IO.Path]::GetTempFileName() + ".py"
    $tmpJson = [System.IO.Path]::GetTempFileName() + ".json"
    Set-Content -Path $tmpPy -Value $dimScript -Encoding ASCII
    Set-Content -Path $tmpJson -Value $jsonPayload -Encoding ASCII
    $dimOutput = python $tmpPy $tmpJson
    Remove-Item $tmpPy -Force -ErrorAction SilentlyContinue
    Remove-Item $tmpJson -Force -ErrorAction SilentlyContinue

    foreach ($line in $dimOutput) {
        $parts = $line -split "\|"
        if ($parts.Length -ge 4) {
            $name = $parts[0]
            $actual = $parts[1]
            $expected = $parts[2]
            $ok = ($parts[3] -eq "True")
            $results += Write-Check -Name "Dimensions: $name" -Passed $ok -Detail "Actual $actual / Expected $expected"
        }
    }
}

# 4) Live URL checks
$previewTest = Test-Site -Url $PreviewSiteUrl
$canonicalTest = Test-Site -Url $CanonicalSiteUrl

$results += Write-Check -Name "Preview URL reachable" -Passed $previewTest.Reachable -Detail "$PreviewSiteUrl ($($previewTest.Detail))"
$results += Write-Check -Name "Canonical URL publicly reachable" -Passed $canonicalTest.Reachable -Detail "$CanonicalSiteUrl ($($canonicalTest.Detail))"

if ($previewTest.Reachable) {
    $results += Write-Check -Name "Preview has Instagram URL" -Passed ($previewTest.Html -match [Regex]::Escape($ExpectedInstagramUrl)) -Detail $PreviewSiteUrl
    $results += Write-Check -Name "Preview has canonical domain" -Passed ($previewTest.Html -match 'href="https://frecuenciaglobal.vercel.app/') -Detail $PreviewSiteUrl
    $results += Write-Check -Name "Preview has twitter:site" -Passed ($previewTest.Html -match 'name="twitter:site"') -Detail $PreviewSiteUrl
}

if ($canonicalTest.Protected) {
    $results += Write-Check -Name "Canonical is not protected by auth" -Passed $false -Detail "Disable Vercel Authentication for production access"
} elseif ($canonicalTest.Reachable) {
    $results += Write-Check -Name "Canonical has Instagram URL" -Passed ($canonicalTest.Html -match [Regex]::Escape($ExpectedInstagramUrl)) -Detail $CanonicalSiteUrl
}

# 5) Summary + report
$okCount = ($results | Where-Object { $_.Status -eq "OK" }).Count
$failCount = ($results | Where-Object { $_.Status -eq "FAIL" }).Count
$overall = if ($failCount -eq 0) { "PASS" } else { "PARTIAL" }

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$lines = @()
$lines += "# Instagram Preflight Report"
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
    $lines += "Instagram queda tecnicamente listo para pruebas en plataforma."
} else {
    $lines += "Resolver los checks en FAIL antes de declarar Instagram LISTO PARA PRUEBAS."
}

$outDir = Split-Path -Parent $OutputReport
if (-not [string]::IsNullOrWhiteSpace($outDir) -and -not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

Set-Content -Path $OutputReport -Value ($lines -join "`r`n") -Encoding ASCII

Write-Host ""
Write-Host "INSTAGRAM PREFLIGHT RESULT: $overall"
Write-Host "Checks OK: $okCount"
Write-Host "Checks FAIL: $failCount"
Write-Host "Report: $OutputReport"
Write-Host ""
$results | Format-Table -AutoSize

if ($failCount -gt 0) {
    exit 2
}
