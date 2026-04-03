param(
    [string]$PreviewSiteUrl = "https://website-three-rho-26.vercel.app",
    [string]$CanonicalSiteUrl = "https://frecuenciaglobal.vercel.app",
    [ValidateSet("001", "002", "003")]
    [string]$RunId = "001",
    [string]$Tester = "Farid",
    [string]$Environment = "Desktop + Mobile",
    [ValidateSet("OK", "FAIL", "PENDING")]
    [string]$B1 = "PENDING",
    [ValidateSet("OK", "FAIL", "PENDING")]
    [string]$B2 = "PENDING",
    [ValidateSet("OK", "FAIL", "PENDING")]
    [string]$B3 = "PENDING",
    [ValidateSet("OK", "FAIL", "PENDING")]
    [string]$B4 = "PENDING",
    [ValidateSet("OK", "FAIL", "PENDING")]
    [string]$B5 = "PENDING",
    [ValidateSet("OK", "FAIL", "PENDING")]
    [string]$B6 = "PENDING",
    [ValidateSet("OK", "FAIL", "PENDING")]
    [string]$B7 = "PENDING",
    [ValidateSet("OK", "FAIL", "PENDING")]
    [string]$B8 = "PENDING",
    [int]$CriticalFailures = 0,
    [switch]$ApplyStatusUpdates
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$preflightScript = "scripts/linkedin_preflight.ps1"
$runScript = "scripts/linkedin_run.ps1"
$today = Get-Date -Format "yyyy-MM-dd"
$reportPath = "07_Operaciones/LINKEDIN_Preflight_Report_$today.md"

if (-not (Test-Path $preflightScript)) {
    throw "Missing script: $preflightScript"
}
if (-not (Test-Path $runScript)) {
    throw "Missing script: $runScript"
}

Write-Host "[1/2] Running LinkedIn preflight..."
& $preflightScript -PreviewSiteUrl $PreviewSiteUrl -CanonicalSiteUrl $CanonicalSiteUrl -OutputReport $reportPath

Write-Host "[2/2] Generating LinkedIn run log..."
$runParams = @{
    RunId = $RunId
    Tester = $Tester
    Environment = $Environment
    B1 = $B1
    B2 = $B2
    B3 = $B3
    B4 = $B4
    B5 = $B5
    B6 = $B6
    B7 = $B7
    B8 = $B8
    CriticalFailures = $CriticalFailures
}

if ($ApplyStatusUpdates) {
    $runParams.ApplyStatusUpdates = $true
}

& $runScript @runParams

Write-Host "Pipeline complete."
Write-Host "Preflight report: $reportPath"
Write-Host "Run log: 07_Operaciones/LINKEDIN_Test_Run_$RunId.md"
