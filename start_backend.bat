@echo off
title Land AI and GIS Backend Server
echo ======================================================================
echo           STARTING LAND AI ^& WEB BACKEND SERVER
echo ======================================================================
echo.

set PYTHON_CMD=python
if exist ".venv\Scripts\python.exe" (
    set PYTHON_CMD=.venv\Scripts\python.exe
) else (
    echo [!] Virtual environment not found or broken.
    echo [!] Please right-click 'setup_portable_python.ps1' and select 'Run with PowerShell'.
    pause
    exit /b 1
)

echo [*] Using Python: %PYTHON_CMD%
echo [*] Starting server on http://localhost:8000 ...
echo.
%PYTHON_CMD% server.py --port 8000

pause
