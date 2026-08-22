Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "          STARTING LAND AI & WEB BACKEND SERVER" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan

$WorkspaceRoot = $PSScriptRoot
if (-not $WorkspaceRoot) {
    $WorkspaceRoot = (Get-Location).Path
}
Set-Location $WorkspaceRoot

$PythonExe = Join-Path $WorkspaceRoot ".venv\Scripts\python.exe"
if (-not (Test-Path $PythonExe)) {
    $PythonExe = "python"
}

Write-Host "[*] Using Python: $PythonExe" -ForegroundColor Green
Write-Host "[*] Launching Backend Server on http://localhost:8000 ..." -ForegroundColor Yellow
Write-Host ""

& $PythonExe server.py --port 8000
