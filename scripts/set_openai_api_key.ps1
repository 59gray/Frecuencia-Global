param(
    [switch]$Verify
)

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

function Get-UserKey {
    return [Environment]::GetEnvironmentVariable("OPENAI_API_KEY", "User")
}

if ($Verify) {
    $userKey = Get-UserKey
    $processKey = $env:OPENAI_API_KEY

    Write-Host "User OPENAI_API_KEY: $(Mask-Key $userKey)"
    Write-Host "Process OPENAI_API_KEY: $(Mask-Key $processKey)"

    if ([string]::IsNullOrWhiteSpace($userKey)) {
        Write-Host "Status: missing in user profile"
        exit 1
    }

    if (-not $userKey.StartsWith("sk-")) {
        Write-Host "Status: present but suspicious (does not start with sk-)"
        exit 2
    }

    if ($userKey.Length -lt 30) {
        Write-Host "Status: present but suspicious (too short to look like a real OpenAI key)"
        exit 3
    }

    Write-Host "Status: user profile key is set"
    exit 0
}

Write-Host "Paste your OpenAI API key. Input will be hidden."
$secure = Read-Host "OPENAI_API_KEY" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)

try {
    $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
}
finally {
    if ($bstr -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
}

if ([string]::IsNullOrWhiteSpace($plain)) {
    Write-Host "No value received. Nothing was changed."
    exit 1
}

[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", $plain, "User")
$env:OPENAI_API_KEY = $plain

Write-Host "Saved OPENAI_API_KEY to your User environment."
Write-Host "User OPENAI_API_KEY: $(Mask-Key (Get-UserKey))"
Write-Host "Process OPENAI_API_KEY: $(Mask-Key $env:OPENAI_API_KEY)"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Keep this terminal open if you want the key active right now."
Write-Host "2. Or open a new terminal and run:"
Write-Host "   .\\scripts\\set_openai_api_key.ps1 -Verify"
