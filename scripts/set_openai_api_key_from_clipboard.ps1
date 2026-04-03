param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Mask-Key {
    param(
        [AllowNull()]
        [string]$Value
    )

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return "<missing>"
    }

    $prefix = $Value.Substring(0, [Math]::Min(3, $Value.Length))
    $suffix = $Value.Substring([Math]::Max(0, $Value.Length - 3))
    return "$prefix...$suffix (len=$($Value.Length))"
}

$value = Get-Clipboard -Raw

if ([string]::IsNullOrWhiteSpace($value)) {
    Write-Host "Clipboard is empty. Copy the full OpenAI API key first."
    exit 1
}

$value = $value.Trim()

[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", $value, "User")
$env:OPENAI_API_KEY = $value

Write-Host "Saved OPENAI_API_KEY from clipboard."
Write-Host "User OPENAI_API_KEY: $(Mask-Key ([Environment]::GetEnvironmentVariable('OPENAI_API_KEY', 'User')))"
Write-Host "Process OPENAI_API_KEY: $(Mask-Key $env:OPENAI_API_KEY)"

if (-not $value.StartsWith("sk-")) {
    Write-Host "Warning: value does not start with sk-"
    exit 2
}

if ($value.Length -lt 30) {
    Write-Host "Warning: value looks too short"
    exit 3
}

Write-Host "Status: user profile key is set"
