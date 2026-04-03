param(
    [string]$PreviewSiteUrl = "https://website-three-rho-26.vercel.app",
    [string]$CanonicalSiteUrl = "https://frecuenciaglobal.vercel.app",
    [string]$ExpectedLinkedIn = "https://www.linkedin.com/company/frecuencia-global",
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
    $OutputReport = "07_Operaciones/LINKEDIN_Preflight_Report_$today.md"
}

$results = @()

$requiredDocs = @(
    "02_Brand_System/LINKEDIN_Asset_Specs.md",
    "07_Operaciones/LINKEDIN_Setup_Checklist.md",
    "04_Produccion/LINKEDIN_Test_Protocol.md",
    "07_Operaciones/LINKEDIN_Status_Report.md"
)

foreach ($doc in $requiredDocs) {
    $exists = Test-Path $doc
    $detail = if ($exists) { "Present" } else { "Missing" }
    $results += Write-Check -Name "Doc exists: $doc" -Passed $exists -Detail $detail
}

$footerPath = "website/src/components/Footer.astro"
$contactPath = "website/src/pages/contacto.astro"
$layoutPath = "website/src/layouts/BaseLayout.astro"

$footerContent = Get-Content $footerPath -Raw
$contactContent = Get-Content $contactPath -Raw
$layoutContent = Get-Content $layoutPath -Raw

$results += Write-Check -Name "Footer has LinkedIn" -Passed ($footerContent.Contains($ExpectedLinkedIn)) -Detail $footerPath
$results += Write-Check -Name "Contacto has LinkedIn" -Passed ($contactContent.Contains($ExpectedLinkedIn)) -Detail $contactPath

$ogChecks = @(
    "og:type",
    "og:url",
    "og:title",
    "og:description",
    "og:image",
    "og:locale"
)

foreach ($tag in $ogChecks) {
    $hasTag = $layoutContent.Contains($tag)
    $results += Write-Check -Name "Layout has $tag" -Passed $hasTag -Detail $layoutPath
}

$previewTest = Test-Site -Url $PreviewSiteUrl
$canonicalTest = Test-Site -Url $CanonicalSiteUrl

$results += Write-Check -Name "Preview URL reachable" -Passed $previewTest.Reachable -Detail "$PreviewSiteUrl ($($previewTest.Detail))"
$results += Write-Check -Name "Canonical URL publicly reachable" -Passed $canonicalTest.Reachable -Detail "$CanonicalSiteUrl ($($canonicalTest.Detail))"

if ($previewTest.Reachable) {
    $results += Write-Check -Name "Preview HTML has og:title" -Passed ($previewTest.Html -match 'property="og:title"') -Detail $PreviewSiteUrl
    $results += Write-Check -Name "Preview HTML has og:description" -Passed ($previewTest.Html -match 'property="og:description"') -Detail $PreviewSiteUrl
    $results += Write-Check -Name "Preview HTML has og:image" -Passed ($previewTest.Html -match 'property="og:image"') -Detail $PreviewSiteUrl
    $results += Write-Check -Name "Preview HTML has LinkedIn URL" -Passed ($previewTest.Html -match [Regex]::Escape($ExpectedLinkedIn)) -Detail $PreviewSiteUrl
}

if ($canonicalTest.Protected) {
    $results += Write-Check -Name "Canonical is not protected by auth" -Passed $false -Detail "Disable Vercel Authentication for production access"
} elseif ($canonicalTest.Reachable) {
    $results += Write-Check -Name "Canonical HTML has LinkedIn URL" -Passed ($canonicalTest.Html -match [Regex]::Escape($ExpectedLinkedIn)) -Detail $CanonicalSiteUrl
}

$okCount = ($results | Where-Object { $_.Status -eq "OK" }).Count
$failCount = ($results | Where-Object { $_.Status -eq "FAIL" }).Count
$overall = if ($failCount -eq 0) { "PASS" } else { "PARTIAL" }

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$lines = @()
$lines += "# LinkedIn Preflight Report"
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
    $lines += "LinkedIn queda tecnicamente lista para ejecutar pruebas en plataforma."
} else {
    $lines += "Corregir checks en FAIL antes de ejecutar pruebas en plataforma."
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
