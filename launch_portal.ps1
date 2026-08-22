Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "       GLIS INDIA LAND INFORMATION PORTAL - ONE-CLICK LAUNCHER" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host ""

$WorkspaceRoot = $PSScriptRoot
if (-not $WorkspaceRoot) { $WorkspaceRoot = (Get-Location).Path }
Set-Location $WorkspaceRoot

# ------------------------------------------------------------------
# 1. Detect a usable Python interpreter
# ------------------------------------------------------------------
$PyCmd = $null
foreach ($candidate in @("py -3.11", "py", "python")) {
    $exe = $candidate.Split(" ")[0]
    if (Get-Command $exe -ErrorAction SilentlyContinue) {
        $PyCmd = $candidate
        break
    }
}
if (-not $PyCmd) {
    $fallback = Join-Path $env:LOCALAPPDATA "Programs\Python\Python311\python.exe"
    if (Test-Path $fallback) { $PyCmd = $fallback }
}
if (-not $PyCmd) {
    Write-Host "[!] ERROR: Python was not found. Install Python 3.10+ and ensure it's on PATH." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Using base Python: $PyCmd" -ForegroundColor Green
Invoke-Expression "$PyCmd --version"
Write-Host ""

# ------------------------------------------------------------------
# 2. Create the virtual environment if it does not exist
# ------------------------------------------------------------------
$VenvPython = Join-Path $WorkspaceRoot ".venv\Scripts\python.exe"
if (-not (Test-Path $VenvPython)) {
    Write-Host "[*] No .venv found - creating a new virtual environment..." -ForegroundColor Yellow
    Invoke-Expression "$PyCmd -m venv .venv"
    if (-not (Test-Path $VenvPython)) {
        Write-Host "[!] ERROR: Failed to create the virtual environment." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[OK] Virtual environment created at .venv" -ForegroundColor Green
} else {
    Write-Host "[OK] Existing virtual environment found at .venv - reusing it." -ForegroundColor Green
}
Write-Host ""

# ------------------------------------------------------------------
# 3. Activate the virtual environment (for this session)
# ------------------------------------------------------------------
$ActivateScript = Join-Path $WorkspaceRoot ".venv\Scripts\Activate.ps1"
Write-Host "[*] Activating virtual environment..." -ForegroundColor Yellow
try {
    & $ActivateScript
    Write-Host "[OK] Virtual environment active." -ForegroundColor Green
} catch {
    Write-Host "[!] Could not run Activate.ps1 (execution policy?). Continuing using .venv\Scripts\python.exe directly." -ForegroundColor Yellow
}
Write-Host ""

# ------------------------------------------------------------------
# 4. Install / update required packages
# ------------------------------------------------------------------
Write-Host "[*] Upgrading pip..." -ForegroundColor Yellow
& $VenvPython -m pip install --upgrade pip | Out-Null

Write-Host "[*] Installing required packages from requirements.txt (skipped if already satisfied)..." -ForegroundColor Yellow
& $VenvPython -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] WARNING: Some packages failed to install. AI features may not work, but the portal will still try to launch." -ForegroundColor Yellow
} else {
    Write-Host "[OK] All dependencies satisfied." -ForegroundColor Green
}
Write-Host ""

# ------------------------------------------------------------------
# 5. Warn if the trained model checkpoint is missing
# ------------------------------------------------------------------
$ModelPath = Join-Path $WorkspaceRoot "models\unet_resnet34_lulc_best.pth"
if (-not (Test-Path $ModelPath)) {
    Write-Host "[!] NOTE: models\unet_resnet34_lulc_best.pth not found." -ForegroundColor Yellow
    Write-Host "    The AI Satellite ML tab will run in fallback mode until you train a model" -ForegroundColor Yellow
    Write-Host "    with train.py or place a checkpoint in the models\ folder." -ForegroundColor Yellow
    Write-Host ""
}

# ------------------------------------------------------------------
# 6. Launch backend (server.py also serves the frontend statically)
# ------------------------------------------------------------------
$Port = 8000
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "[*] Starting backend + frontend server on http://localhost:$Port/" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host ""

Start-Process "http://localhost:$Port/"

& $VenvPython server.py --port $Port

Write-Host ""
Write-Host "[*] Server stopped." -ForegroundColor Yellow
Read-Host "Press Enter to exit"
