Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   SETTING UP PORTABLE PYTHON ENVIRONMENT    " -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

$WorkspaceRoot = $PSScriptRoot
if (-not $WorkspaceRoot) {
    $WorkspaceRoot = (Get-Location).Path
}
Set-Location $WorkspaceRoot

$NugetUrl = "https://www.nuget.org/api/v2/package/python/3.11.9"
$ZipFile = Join-Path $WorkspaceRoot "python_temp.zip"
$PortableDir = Join-Path $WorkspaceRoot "portable_python"

if (-not (Test-Path $PortableDir)) {
    Write-Host "[*] Downloading Portable Python 3.11.9 from NuGet..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $NugetUrl -OutFile $ZipFile -UseBasicParsing

    Write-Host "[*] Extracting Python..." -ForegroundColor Yellow
    Expand-Archive -Path $ZipFile -DestinationPath "python_temp_extract" -Force

    Write-Host "[*] Moving to ./portable_python ..." -ForegroundColor Yellow
    Move-Item -Path "python_temp_extract\tools" -Destination $PortableDir -Force

    Write-Host "[*] Cleaning up temporary files..." -ForegroundColor Yellow
    Remove-Item -Path $ZipFile -Force
    Remove-Item -Path "python_temp_extract" -Recurse -Force
} else {
    Write-Host "[*] Portable Python is already downloaded." -ForegroundColor Green
}

$PortablePythonExe = Join-Path $PortableDir "python.exe"

if (-not (Test-Path $PortablePythonExe)) {
    Write-Host "[!] Failed to find python.exe in portable_python." -ForegroundColor Red
    exit 1
}

$VenvDir = Join-Path $WorkspaceRoot ".venv"
# We will always recreate the .venv to ensure it uses the new portable python and isn't a broken symlink
if (Test-Path $VenvDir) {
    Write-Host "[*] Removing old broken virtual environment..." -ForegroundColor Yellow
    Remove-Item -Path $VenvDir -Recurse -Force
}

Write-Host "[*] Creating isolated virtual environment..." -ForegroundColor Yellow
& $PortablePythonExe -m venv $VenvDir

$VenvPythonExe = Join-Path $VenvDir "Scripts\python.exe"

Write-Host "[*] Upgrading pip and installing requirements..." -ForegroundColor Yellow
& $VenvPythonExe -m pip install --upgrade pip
& $VenvPythonExe -m pip install -r requirements.txt

Write-Host "[*] Setup Complete! You can now run start_backend.bat or setup_and_train.bat." -ForegroundColor Green
