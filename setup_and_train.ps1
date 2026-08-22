Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "       LAND AI & GIS MODEL - AUTOMATED SETUP AND TRAINING RUNNER" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan

$WorkspaceRoot = $PSScriptRoot
if (-not $WorkspaceRoot) {
    $WorkspaceRoot = (Get-Location).Path
}
Set-Location $WorkspaceRoot

# 1. Detect Python Executable
$PythonExe = $null

if (Get-Command py.exe -ErrorAction SilentlyContinue) {
    $PythonExe = "py.exe -3.11"
} elseif (Get-Command python.exe -ErrorAction SilentlyContinue) {
    $PythonExe = "python.exe"
} elseif (Test-Path "C:\ProgramData\anaconda3\python.exe") {
    $PythonExe = "C:\ProgramData\anaconda3\python.exe"
}

if (-not $PythonExe) {
    Write-Host "[ERROR] Python could not be found. Please install Python 3.10+." -ForegroundColor Red
    Exit 1
}

Write-Host "[INFO] Found Python: $PythonExe" -ForegroundColor Green

# 2. Check / Create Virtual Environment (.venv)
$VenvDir = Join-Path $WorkspaceRoot ".venv"
$VenvPython = Join-Path $VenvDir "Scripts\python.exe"
$VenvPip = Join-Path $VenvDir "Scripts\pip.exe"

if (-not (Test-Path $VenvPython)) {
    Write-Host "[INFO] Creating virtual environment (.venv)..." -ForegroundColor Yellow
    if ($PythonExe -like "py.exe*") {
        & py.exe -3.11 -m venv $VenvDir
    } else {
        & $PythonExe -m venv $VenvDir
    }
    
    if (-not (Test-Path $VenvPython)) {
        Write-Host "[WARNING] Virtual environment creation failed. Using base Python directly." -ForegroundColor Yellow
        $VenvPython = "python.exe"
    } else {
        Write-Host "[SUCCESS] Virtual environment created successfully." -ForegroundColor Green
    }
} else {
    Write-Host "[SUCCESS] Existing virtual environment found (.venv)." -ForegroundColor Green
}

# 3. Install / Update Required Packages
Write-Host "[INFO] Installing required packages from requirements.txt..." -ForegroundColor Yellow
$ReqFile = Join-Path $WorkspaceRoot "requirements.txt"
& $VenvPython -m pip install --upgrade pip
& $VenvPython -m pip install -r $ReqFile

# 4. Launch Training Pipeline
Write-Host "`n==============================================================================" -ForegroundColor Cyan
Write-Host "[INFO] Starting Model Training Pipeline..." -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan

$TrainScript = Join-Path $WorkspaceRoot "train.py"
& $VenvPython $TrainScript $args

Write-Host "`n==============================================================================" -ForegroundColor Cyan
Write-Host "[SUCCESS] Training workflow completed!" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Cyan
