@echo off
REM ============================================================
REM Frecuencia Global — Checkpoint Runner
REM ============================================================
REM Called by Windows Task Scheduler (2x/day) or manually.
REM Activates venv, runs generate_checkpoint.py, logs output.
REM ============================================================

setlocal EnableDelayedExpansion

REM -- Force UTF-8 output to avoid Windows charmap errors in scheduled runs --
set "PYTHONUTF8=1"
set "PYTHONIOENCODING=utf-8"
chcp 65001 >nul

REM -- Resolve repo root (one level up from scripts/) --
SET "REPO_ROOT=%~dp0.."
cd /d "%REPO_ROOT%"
if %ERRORLEVEL% neq 0 (
    echo [ERROR] No se pudo acceder a %REPO_ROOT%
    exit /b 1
)

REM -- Ensure log directory exists --
if not exist "07_Operaciones\logs" mkdir "07_Operaciones\logs"

REM -- Log file --
SET "LOG_FILE=07_Operaciones\logs\checkpoint_runner.log"

echo. >> "%LOG_FILE%"
echo ============================================================ >> "%LOG_FILE%"
echo [%DATE% %TIME%] Checkpoint iniciado >> "%LOG_FILE%"
echo ============================================================ >> "%LOG_FILE%"

REM -- Activate virtual environment if available --
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
    echo [OK] venv activado >> "%LOG_FILE%"
) else (
    echo [WARN] .venv no encontrado, usando Python del sistema >> "%LOG_FILE%"
)

REM -- Run checkpoint generator --
python scripts\generate_checkpoint.py >> "%LOG_FILE%" 2>&1
SET "EXIT_CODE=%ERRORLEVEL%"

if %EXIT_CODE% equ 0 (
    echo [%DATE% %TIME%] Checkpoint OK ^(exit 0^) >> "%LOG_FILE%"
) else (
    echo [%DATE% %TIME%] Checkpoint FALLO ^(exit %EXIT_CODE%^) >> "%LOG_FILE%"
)

endlocal
exit /b %EXIT_CODE%
