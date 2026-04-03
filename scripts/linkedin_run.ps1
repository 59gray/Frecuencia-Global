param(
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
    [string]$Notes1 = "",
    [string]$Notes2 = "",
    [string]$Notes3 = "",
    [string]$Notes4 = "",
    [string]$Notes5 = "",
    [string]$Notes6 = "",
    [string]$Notes7 = "",
    [string]$Notes8 = "",
    [string]$NextAction1 = "",
    [string]$NextAction2 = "",
    [string]$NextAction3 = "",
    [switch]$ApplyStatusUpdates
)

$ErrorActionPreference = "Stop"

function Resolve-Overall {
    param(
        [string[]]$Blocks,
        [int]$Critical
    )

    if ($Blocks -contains "PENDING") {
        return "PARTIAL"
    }

    if ($Blocks -contains "FAIL") {
        if ($Critical -gt 0) { return "FAIL" }
        return "PARTIAL"
    }

    return "PASS"
}

function Get-DecisionLine {
    param([string]$Overall)

    if ($Overall -eq "PASS") {
        return @("- [x] LinkedIn queda LISTA PARA PRUEBAS", "- [ ] Requiere Run siguiente despues de correcciones")
    }

    return @("- [ ] LinkedIn queda LISTA PARA PRUEBAS", "- [x] Requiere Run siguiente despues de correcciones")
}

function Map-Status {
    param([string]$Value)

    switch ($Value) {
        "OK" { return "OK" }
        "FAIL" { return "FAIL" }
        default { return "PENDING" }
    }
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$today = Get-Date -Format "yyyy-MM-dd"
$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$runFile = "07_Operaciones/LINKEDIN_Test_Run_$RunId.md"
$preflightReport = "07_Operaciones/LINKEDIN_Preflight_Report_$today.md"

$blocks = @($B1, $B2, $B3, $B4, $B5, $B6, $B7, $B8)
$overall = Resolve-Overall -Blocks $blocks -Critical $CriticalFailures
$decision = Get-DecisionLine -Overall $overall

$actions = @($NextAction1, $NextAction2, $NextAction3) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
if ($actions.Count -eq 0) {
    $actions = @("Completar bloques en PENDING", "Corregir bloques en FAIL", "Re-ejecutar corrida y actualizar estado")
}

$lines = @()
$lines += "# LinkedIn - Test Run $RunId"
$lines += ""
$lines += "**Fecha:** $today"
$lines += "**Tester:** $Tester"
$lines += "**Entorno:** $Environment"
$lines += "**Objetivo:** Corrida operativa de validacion en plataforma para readiness tecnico de LinkedIn."
$lines += ""
$lines += "---"
$lines += ""
$lines += "## 1) Estado previo"
$lines += ""
$lines += "- Company page: linkedin.com/company/frecuencia-global"
$lines += "- Protocolo base: 04_Produccion/LINKEDIN_Test_Protocol.md"
$lines += "- Preflight tecnico web: ver $preflightReport"
$lines += "- Timestamp de ejecucion: $now"
$lines += ""
$lines += "---"
$lines += ""
$lines += "## 2) Checklist de ejecucion"
$lines += ""
$lines += "| Bloque | Resultado | Evidencia / Nota |"
$lines += "|-------|-----------|------------------|"
$lines += "| 1. Perfil (seccion 1) | $(Map-Status $B1) | $Notes1 |"
$lines += "| 2. Banner (seccion 2) | $(Map-Status $B2) | $Notes2 |"
$lines += "| 3. Logo (seccion 3) | $(Map-Status $B3) | $Notes3 |"
$lines += "| 4. Post image (seccion 4) | $(Map-Status $B4) | $Notes4 |"
$lines += "| 5. Documento PDF (seccion 5) | $(Map-Status $B5) | $Notes5 |"
$lines += "| 6. Articulo (seccion 6) | $(Map-Status $B6) | $Notes6 |"
$lines += "| 7. Link preview (seccion 7) | $(Map-Status $B7) | $Notes7 |"
$lines += "| 8. Consistencia marca (seccion 8) | $(Map-Status $B8) | $Notes8 |"
$lines += ""
$lines += "---"
$lines += ""
$lines += "## 3) Fallos encontrados"
$lines += ""
$lines += "| ID | Bloque | Severidad | Descripcion | Accion | Estado |"
$lines += "|----|--------|-----------|-------------|--------|--------|"
if ($blocks -contains "FAIL") {
    $lines += "| LI-R$RunId-001 | Revisar tabla bloque 2 | Alta/Media/Baja | Completar detalle segun evidencia | Definir correccion puntual | Abierto |"
} else {
    $lines += "| - | - | - | Sin fallos registrados en esta corrida | - | Cerrado |"
}
$lines += ""
$lines += "---"
$lines += ""
$lines += "## 4) Resultado de corrida"
$lines += ""
$lines += "- Casos ejecutados: 1-8"
$lines += "- Fallos criticos: $CriticalFailures"
$lines += "- Estado final: $overall"
$lines += ""
$lines += "---"
$lines += ""
$lines += "## 5) Decision"
$lines += ""
$lines += $decision[0]
$lines += $decision[1]
$lines += ""
$lines += "---"
$lines += ""
$lines += "## 6) Siguientes acciones"
$lines += ""
for ($i = 0; $i -lt $actions.Count; $i++) {
    $n = $i + 1
    $lines += "$n. $($actions[$i])"
}

Set-Content -Path $runFile -Value ($lines -join "`r`n") -Encoding ASCII

if ($ApplyStatusUpdates) {
    if ($blocks -contains "PENDING") {
        throw "ApplyStatusUpdates requiere corrida completa sin bloques PENDING."
    }

    $checklistPath = "07_Operaciones/LINKEDIN_Setup_Checklist.md"
    $statusPath = "07_Operaciones/LINKEDIN_Status_Report.md"

    if (Test-Path $checklistPath) {
        $checklist = Get-Content $checklistPath -Raw
        $replacement57 = "| 5.7 | Log de prueba registrado | ✅ Listo | Run $RunId ($overall) en 07_Operaciones/LINKEDIN_Test_Run_$RunId.md |"
        $checklist = [regex]::Replace($checklist, "\| 5\.7 \| Log de prueba registrado \|.*", $replacement57)

        if ($B7 -eq "OK") {
            $replacement35 = "| 3.5 | Link preview funcional | ✅ Listo | Validado en Run $RunId (bloque 7) |"
            $checklist = [regex]::Replace($checklist, "\| 3\.5 \| Link preview funcional \|.*", $replacement35)
        }

        Set-Content -Path $checklistPath -Value $checklist -Encoding UTF8
    }

    if (Test-Path $statusPath) {
        $status = Get-Content $statusPath -Raw

        $estadoGeneral = "**Estado general:** ⚠️ Parcial - infraestructura documental lista, ejecucion en plataforma pendiente"
        if ($overall -eq "PASS") {
            $estadoGeneral = "**Estado general:** ✅ Lista para pruebas - corrida operativa completada en plataforma"
        } elseif ($overall -eq "FAIL") {
            $estadoGeneral = "**Estado general:** ❌ Bloqueada - corrida operativa con fallos criticos"
        }

        $status = [regex]::Replace($status, "\*\*Estado general:\*\*.*", $estadoGeneral)

        Set-Content -Path $statusPath -Value $status -Encoding UTF8
    }
}

Write-Host "LinkedIn run file generated: $runFile"
Write-Host "Overall result: $overall"
if ($ApplyStatusUpdates) {
    Write-Host "Setup checklist and status report were updated."
} else {
    Write-Host "Status docs not modified. Use -ApplyStatusUpdates after full run with no PENDING."
}
