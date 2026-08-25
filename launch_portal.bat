@echo off
setlocal enabledelayedexpansion
title GLIS - India Land Information Portal Launcher

echo ==============================================================================
echo        GLIS INDIA LAND INFORMATION PORTAL - ONE-CLICK LAUNCHER
echo ==============================================================================
echo.

cd /d "%~dp0"

:: ------------------------------------------------------------------
:: 1. Detect a usable Python interpreter
:: ------------------------------------------------------------------
set "PY_CMD="

py -3.11 --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "PY_CMD=py -3.11"
    goto :found_python
)

py --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "PY_CMD=py"
    goto :found_python
)

python --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "PY_CMD=python"
    goto :found_python
)

if exist "C:\ProgramData\anaconda3\python.exe" (
    set "PY_CMD=C:\ProgramData\anaconda3\python.exe"
    goto :found_python
)

if exist "%~dp0portable_python\python.exe" (
    set "PY_CMD=%~dp0portable_python\python.exe"
    goto :found_python
)

if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" (
    set "PY_CMD=%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
    goto :found_python
)

echo [!] ERROR: Python was not found on your system.
echo     Install Python 3.10+ from https://python.org and make sure it is on PATH.
pause
exit /b 1

:found_python
echo [OK] Using base Python: %PY_CMD%
%PY_CMD% --version
echo.

:: ------------------------------------------------------------------
:: 2. Create the virtual environment if it does not exist
:: ------------------------------------------------------------------
if not exist ".venv\Scripts\activate.bat" (
    echo [*] No .venv found - creating a new virtual environment...
    %PY_CMD% -m venv .venv
    if %ERRORLEVEL% neq 0 (
        echo [!] ERROR: Failed to create the virtual environment.
        pause
        exit /b 1
    )
    echo [OK] Virtual environment created at .venv
) else (
    echo [OK] Existing virtual environment found at .venv - reusing it.
)
echo.

:: ------------------------------------------------------------------
:: 3. Activate the virtual environment
:: ------------------------------------------------------------------
echo [*] Activating virtual environment...
call ".venv\Scripts\activate.bat"
if %ERRORLEVEL% neq 0 (
    echo [!] ERROR: Failed to activate .venv
    pause
    exit /b 1
)
echo [OK] Virtual environment active: %VIRTUAL_ENV%
echo.

:: ------------------------------------------------------------------
:: 4. Install / update required packages
:: ------------------------------------------------------------------
echo [*] Upgrading pip...
python -m pip install --upgrade pip >nul

echo [*] Installing required packages from requirements.txt (skipped if already satisfied)...
pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo [!] WARNING: Some packages failed to install. The AI features may not work,
    echo     but the portal itself will still try to launch.
) else (
    echo [OK] All dependencies satisfied.
)
echo.

:: ------------------------------------------------------------------
:: 5. Warn if the trained model checkpoint is missing
:: ------------------------------------------------------------------
if not exist "models\unet_resnet34_lulc_best.pth" (
    echo [!] NOTE: models\unet_resnet34_lulc_best.pth was not found.
    echo     The AI Satellite ML tab will run in fallback mode until you train
    echo     a model with train.py or place a checkpoint in the models\ folder.
    echo.
)

:: ------------------------------------------------------------------
:: 6. Launch backend (server.py also serves the frontend statically)
:: ------------------------------------------------------------------
set "PORT=8000"
echo ==============================================================================
echo [*] Starting backend + frontend server on http://localhost:%PORT%/
echo ==============================================================================
echo.

start "" "http://localhost:%PORT%/"

python server.py --port %PORT%

echo.
echo [*] Server stopped.
pause
