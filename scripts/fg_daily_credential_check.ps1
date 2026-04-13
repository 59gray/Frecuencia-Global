<#
.SYNOPSIS
    Daily credential lifecycle check for all FG providers.

.DESCRIPTION
    Runs check_all_providers.py, persists reports to 07_Operaciones,
    and refreshes YouTube token if expiring soon.
    Designed to run as a Windows Scheduled Task (daily at 08:00).

.EXAMPLE
    .\scripts\fg_daily_credential_check.ps1
    .\scripts\fg_daily_credential_check.ps1 -Register   # creates Windows Scheduled Task
    .\scripts\fg_daily_credential_check.ps1 -Unregister # removes the task

.NOTES
    Requires: Python 3, .env.local with provider tokens.
    Does NOT touch editorial, swarm, or publishing systems.
#>

param(
    [switch]$Register,
    [switch]$Unregister,
    [switch]$Help
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$TaskName = "FG_Daily_Credential_Check"

if ($Help) {
    Get-Help $MyInvocation.MyCommand.Path -Detailed
    exit 0
}

if ($Unregister) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Host "Scheduled task '$TaskName' removed." -ForegroundColor Yellow
    exit 0
}

if ($Register) {
    $scriptPath = Join-Path $RepoRoot "scripts\fg_daily_credential_check.ps1"
    $action = New-ScheduledTaskAction `
        -Execute "powershell.exe" `
        -Argument "-ExecutionPolicy Bypass -NonInteractive -File `"$scriptPath`"" `
        -WorkingDirectory $RepoRoot

    $trigger = New-ScheduledTaskTrigger -Daily -At "08:00"
    $settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -ExecutionTimeLimit (New-TimeSpan -Minutes 10)

    Register-ScheduledTask `
        -TaskName $TaskName `
        -Action $action `
        -Trigger $trigger `
        -Settings $settings `
        -Description "Frecuencia Global: daily credential lifecycle check (check_all_providers.py + YouTube refresh)" `
        -ErrorAction Stop | Out-Null

    Write-Host "Scheduled task '$TaskName' registered (daily at 08:00)." -ForegroundColor Green
    exit 0
}

# ── Main: run the check ─────────────────────────────────────────────────────

$line = "=" * 60
Write-Host ""
Write-Host $line -ForegroundColor Cyan
Write-Host "  FG Credential Lifecycle Check - $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -ForegroundColor Cyan
Write-Host $line -ForegroundColor Cyan

# Step 1: YouTube refresh (auto-renew if close to expiry)
Write-Host "`n  [1/2] YouTube token refresh..." -ForegroundColor Gray
try {
    $ytResult = python (Join-Path $RepoRoot "scripts\check_youtube_oauth.py") --refresh-if-needed 2>&1
    $ytJson = $ytResult | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($ytJson.lifecycle.state -eq "OK") {
        Write-Host "  [OK] YouTube: token valid" -ForegroundColor Green
    } elseif ($ytJson.lifecycle.state -eq "RENEW_SOON") {
        Write-Host "  [WARN] YouTube: RENEW_SOON (auto-refresh ready)" -ForegroundColor Yellow
    } else {
        Write-Host "  [FAIL] YouTube: $($ytJson.lifecycle.state)" -ForegroundColor Red
    }
} catch {
    Write-Host "  [FAIL] YouTube check error: $_" -ForegroundColor Red
}

# Step 2: All providers
Write-Host "`n  [2/2] All providers lifecycle check..." -ForegroundColor Gray
try {
    $provResult = python (Join-Path $RepoRoot "scripts\check_all_providers.py") 2>&1
    $exitCode = $LASTEXITCODE
    $provResult | ForEach-Object { Write-Host "  $_" }
    if ($exitCode -eq 0) {
        Write-Host "`n  [OK] All providers healthy." -ForegroundColor Green
    } else {
        Write-Host "`n  [WARN] Some providers need attention (exit code $exitCode)." -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [FAIL] Provider check error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host $line -ForegroundColor Cyan
Write-Host ""
