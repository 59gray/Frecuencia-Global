param(
    [string]$SiteUrl = "https://website-three-rho-26.vercel.app",
    [string]$ExpectedHandle = "@frec_global"
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

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$results = @()

# 1) Required docs must exist
$requiredDocs = @(
    "02_Brand_System/X_Asset_Specs.md",
    "04_Produccion/X_Test_Protocol.md",
    "07_Operaciones/X_Setup_Checklist.md",
    "07_Operaciones/X_Status_Report.md"
)

foreach ($doc in $requiredDocs) {
    $exists = Test-Path $doc
    $detail = "Missing"
    if ($exists) { $detail = "Present" }
    $results += Write-Check -Name "Doc exists: $doc" -Passed $exists -Detail $detail
}

# 2) Required source links and tags
$footerPath = "website/src/components/Footer.astro"
$layoutPath = "website/src/layouts/BaseLayout.astro"

$footerContent = Get-Content $footerPath -Raw
$layoutContent = Get-Content $layoutPath -Raw

$results += Write-Check -Name "Footer has X URL" -Passed ($footerContent.Contains("https://x.com/frec_global")) -Detail $footerPath
$results += Write-Check -Name "Layout has twitter:site" -Passed ($layoutContent.Contains('name="twitter:site"')) -Detail $layoutPath
$results += Write-Check -Name "Layout has expected handle" -Passed ($layoutContent.Contains($ExpectedHandle)) -Detail $layoutPath
$results += Write-Check -Name "Layout has summary_large_image" -Passed ($layoutContent.Contains('twitter:card" content="summary_large_image')) -Detail $layoutPath

# 3) Required assets must exist
$requiredAssets = @(
    "06_Assets/FG_MK_Avatar_X-Profile_v1.png",
    "06_Assets/FG_MK_BNR_X-Header_v1.png",
    "06_Assets/FG_GD_Template_Post_XBase_v1.png",
    "06_Assets/FG_GD_Template_Thread_XBase_v1.png",
    "06_Assets/FG_BB_Template_Post_XBase_v1.png",
    "06_Assets/FG_BB_Template_Thread_XBase_v1.png",
    "06_Assets/FG_FG_Template_Post_XBase_v1.png",
    "06_Assets/FG_FG_Template_Thread_XBase_v1.png",
    "06_Assets/FG_BP_Template_Post_XBase_v1.png",
    "06_Assets/FG_BP_Template_Thread_XBase_v1.png",
    "06_Assets/FG_GN_Template_ThreadClose_X_v1.png"
)

foreach ($asset in $requiredAssets) {
    $exists = Test-Path $asset
    $detail = "Missing"
    if ($exists) { $detail = "Present" }
    $results += Write-Check -Name "Asset exists: $asset" -Passed $exists -Detail $detail
}

# 4) Dimension checks via Python (if available)
$python = Get-Command python -ErrorAction SilentlyContinue
if ($null -ne $python) {
    $dimScript = @"
from PIL import Image
checks = [
    (r'06_Assets/FG_MK_Avatar_X-Profile_v1.png', (400, 400)),
    (r'06_Assets/FG_MK_BNR_X-Header_v1.png', (1500, 500)),
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
} else {
    $results += Write-Check -Name "Python available for dimension checks" -Passed $false -Detail "python command not found"
}

# 5) Live deployment checks
$siteReachable = $true
$html = ""
try {
    $response = Invoke-WebRequest -Uri $SiteUrl -UseBasicParsing -TimeoutSec 20
    $html = $response.Content
} catch {
    $siteReachable = $false
}

$results += Write-Check -Name "Site reachable" -Passed $siteReachable -Detail $SiteUrl

if ($siteReachable) {
    $results += Write-Check -Name "Live has twitter:site" -Passed ($html -match 'name="twitter:site"') -Detail $SiteUrl
    $results += Write-Check -Name "Live has expected handle" -Passed ($html -match [Regex]::Escape($ExpectedHandle)) -Detail $SiteUrl
    $results += Write-Check -Name "Live has twitter:card" -Passed ($html -match 'property="twitter:card"') -Detail $SiteUrl
    $results += Write-Check -Name "Live has twitter:image" -Passed ($html -match 'property="twitter:image"') -Detail $SiteUrl
    $results += Write-Check -Name "Live has canonical frecuencia" -Passed ($html -match 'href="https://frecuenciaglobal.vercel.app/') -Detail $SiteUrl
}

$okCount = ($results | Where-Object { $_.Status -eq "OK" }).Count
$failCount = ($results | Where-Object { $_.Status -eq "FAIL" }).Count
$overall = if ($failCount -eq 0) { "PASS" } else { "PARTIAL" }

Write-Host ""
Write-Host "X PREFLIGHT RESULT: $overall"
Write-Host "Checks OK: $okCount"
Write-Host "Checks FAIL: $failCount"
Write-Host ""
$results | Format-Table -AutoSize

if ($failCount -gt 0) {
    exit 2
}
