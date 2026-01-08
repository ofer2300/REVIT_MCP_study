# ============================================================================
# Revit MCP Add-in Multi-Version Installer (2022-2026)
# ============================================================================
# This script automatically:
# 1. Detects installed Revit versions (2022-2026)
# 2. Builds the C# project for each detected version
# 3. Copies RevitMCP.dll and RevitMCP.addin to correct folders
# ============================================================================

#Requires -Version 5.1
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.Encoding]::UTF8

# ============================================================================
# Configuration
# ============================================================================
$supportedVersions = @("2022", "2023", "2024", "2025", "2026")
$scriptDir = $PSScriptRoot
$projectRoot = Split-Path -Parent -Path $scriptDir
$mcpPath = Join-Path $projectRoot "MCP"
$appDataPath = $env:APPDATA

Write-Host ""
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "   Revit MCP Add-in Multi-Version Installer" -ForegroundColor Cyan
Write-Host "   Supports: Revit 2022, 2023, 2024, 2025, 2026" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# Verify project structure
# ============================================================================
if (-not (Test-Path $mcpPath)) {
    Write-Host "ERROR: MCP folder not found at $mcpPath" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Project root: $projectRoot" -ForegroundColor Green
Write-Host ""

# ============================================================================
# Detect installed Revit versions
# ============================================================================
Write-Host "Detecting installed Revit versions..." -ForegroundColor Yellow
$installedVersions = @()

foreach ($version in $supportedVersions) {
    $revitPath = "C:\Program Files\Autodesk\Revit $version"
    $addinPath = Join-Path $appDataPath "Autodesk\Revit\Addins\$version"
    
    if ((Test-Path "$revitPath\RevitAPI.dll") -or (Test-Path $addinPath)) {
        Write-Host "  [FOUND] Revit $version" -ForegroundColor Green
        $installedVersions += $version
    }
}

if ($installedVersions.Count -eq 0) {
    Write-Host "ERROR: No Revit installations found (2022-2026)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Found $($installedVersions.Count) Revit version(s): $($installedVersions -join ', ')" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# Build and install for each version
# ============================================================================

foreach ($version in $installedVersions) {
    Write-Host "============================================================================" -ForegroundColor Cyan
    Write-Host "  Processing Revit $version" -ForegroundColor Cyan
    Write-Host "============================================================================" -ForegroundColor Cyan
    
    # Determine project file
    $csprojFile = switch ($version) {
        "2024" { "RevitMCP.2024.csproj" }
        "2025" { "RevitMCP.2025.csproj" }
        "2026" { "RevitMCP.2026.csproj" }
        default { "RevitMCP.csproj" }
    }
    
    $csprojPath = Join-Path $mcpPath $csprojFile
    
    # Check if project file exists
    if (-not (Test-Path $csprojPath)) {
        Write-Host "  [SKIP] Project file not found: $csprojFile" -ForegroundColor Yellow
        continue
    }
    
    # Build the project
    Write-Host "  Building $csprojFile..." -ForegroundColor Yellow
    
    Push-Location $mcpPath
    try {
        $buildResult = & dotnet build $csprojFile -c Release 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  [ERROR] Build failed for Revit $version" -ForegroundColor Red
            Write-Host $buildResult -ForegroundColor Gray
            Pop-Location
            continue
        }
        Write-Host "  [OK] Build succeeded" -ForegroundColor Green
    }
    catch {
        Write-Host "  [ERROR] Build exception: $_" -ForegroundColor Red
        Pop-Location
        continue
    }
    Pop-Location
    
    # Determine output paths
    $outputPath = switch ($version) {
        "2024" { Join-Path $mcpPath "bin\Release.2024" }
        "2025" { Join-Path $mcpPath "bin\Release.2025" }
        "2026" { Join-Path $mcpPath "bin\Release.2026" }
        default { Join-Path $mcpPath "bin\Release" }
    }
    
    $sourceDll = Join-Path $outputPath "RevitMCP.dll"
    
    # Determine addin file
    $addinFile = switch ($version) {
        "2024" { "RevitMCP.2024.addin" }
        "2025" { "RevitMCP.2025.addin" }
        "2026" { "RevitMCP.2026.addin" }
        default { "RevitMCP.addin" }
    }
    $sourceAddin = Join-Path $mcpPath $addinFile
    if (-not (Test-Path $sourceAddin)) {
        $sourceAddin = Join-Path $mcpPath "RevitMCP.addin"
    }
    
    # Verify build output
    if (-not (Test-Path $sourceDll)) {
        Write-Host "  [ERROR] DLL not found: $sourceDll" -ForegroundColor Red
        continue
    }
    
    # Target folder
    $targetPath = Join-Path $appDataPath "Autodesk\Revit\Addins\$version"
    
    # Create folder if needed
    if (-not (Test-Path $targetPath)) {
        New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
        Write-Host "  Created folder: $targetPath" -ForegroundColor Gray
    }
    
    # Copy files
    try {
        Copy-Item -Path $sourceDll -Destination (Join-Path $targetPath "RevitMCP.dll") -Force
        Write-Host "  [OK] Copied RevitMCP.dll" -ForegroundColor Green
        
        Copy-Item -Path $sourceAddin -Destination (Join-Path $targetPath "RevitMCP.addin") -Force
        Write-Host "  [OK] Copied RevitMCP.addin" -ForegroundColor Green
        
        # Copy Newtonsoft.Json if present
        $jsonDll = Join-Path $outputPath "Newtonsoft.Json.dll"
        if (Test-Path $jsonDll) {
            Copy-Item -Path $jsonDll -Destination (Join-Path $targetPath "Newtonsoft.Json.dll") -Force
            Write-Host "  [OK] Copied Newtonsoft.Json.dll" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "  [ERROR] Failed to copy files: $_" -ForegroundColor Red
        Write-Host "  Make sure Revit $version is not running!" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "  [DONE] Revit $version installation complete" -ForegroundColor Green
    Write-Host ""
}

# ============================================================================
# Summary
# ============================================================================
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "   Installation Complete!" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Close all Revit instances" -ForegroundColor White
Write-Host "  2. Open Revit - you should see 'MCP Tools' panel" -ForegroundColor White
Write-Host "  3. Click 'MCP Service (ON/OFF)' to start the WebSocket server" -ForegroundColor White
Write-Host "  4. Connect Claude Code with MCP Server" -ForegroundColor White
Write-Host ""
Write-Host "MCP Server port: localhost:8964" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
