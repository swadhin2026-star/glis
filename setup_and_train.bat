@echo off
setlocal enabledelayedexpansion

echo ==============================================================================
echo        LAND AI ^& GIS MODEL - AUTOMATED SETUP AND TRAINING RUNNER
echo ==============================================================================

cd /d "%~dp0"

:: 1. Detect Python Executable
set "PY_CMD="

:: Check for py -3.11
py -3.11 --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "PY_CMD=py -3.11"
    goto :found_python
)

:: Check for py launcher
py --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "PY_CMD=py"
    goto :found_python
)

:: Check for python in PATH
python --version >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "PY_CMD=python"
    goto :found_python
)

:: Check Anaconda installation
if exist "C:\ProgramData\anaconda3\python.exe" (
    set "PY_CMD=C:\ProgramData\anaconda3\python.exe"
    goto :found_python
)

:: Check user local AppData python
if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" (
    set "PY_CMD=%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
    goto :found_python
)

echo [!] ERROR: Python was not found on your system.
echo Please install Python 3.10+ or ensure it is added to your PATH.
pause
exit /b 1

:found_python
echo [✓] Using Python: %PY_CMD%
%PY_CMD% --version

:: 2. Check / Create Virtual Environment (.venv)
if not exist ".venv\Scripts\activate.bat" (
    echo [*] Creating virtual environment in .venv ...
    %PY_CMD% -m venv .venv
    if %ERRORLEVEL% neq 0 (
        echo [!] Failed to create .venv with %PY_CMD%. Trying without venv...
        goto :install_packages_direct
    )
    echo [✓] Virtual environment created successfully.
) else (
    echo [✓] Existing virtual environment found ^(.venv^).
)

:: 3. Activate Virtual Environment
echo [*] Activating virtual environment...
call .venv\Scripts\activate.bat
if %ERRORLEVEL% neq 0 (
    echo [!] Failed to activate .venv.
    pause
    exit /b 1
)
echo [✓] Virtual environment activated.

:: 4. Install / Update Required Packages
echo [*] Checking and installing required packages from requirements.txt...
python -m pip install --upgrade pip
pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo [!] Warning: Some packages had issues installing. Continuing to run train.py...
) else (
    echo [✓] All dependencies are ready.
)

:: 5. Launch Training
echo.
echo ==============================================================================
echo [*] Starting Model Training Pipeline ...
echo ==============================================================================
python train.py %*

echo.
echo ==============================================================================
echo [✓] Training script finished!
echo ==============================================================================
pause
exit /b 0

:install_packages_direct
echo [*] Installing packages directly to Python environment...
%PY_CMD% -m pip install -r requirements.txt
%PY_CMD% train.py %*
pause
