@echo off
title Land AI and GIS Backend Server
echo ======================================================================
echo           STARTING LAND AI ^& WEB BACKEND SERVER
echo ======================================================================
echo.

set PYTHON_CMD=python
if exist ".venv\Scripts\python.exe" (
    set PYTHON_CMD=.venv\Scripts\python.exe
)

echo [*] Using Python: %PYTHON_CMD%
echo [*] Starting server on http://localhost:8000 ...
echo.
%PYTHON_CMD% server.py --port 8000

pause
