# PowerShell script to create desktop shortcut for Quick Access Widget
# Creates a pinnable shortcut that launches the widget

$DesktopPath = [System.Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $DesktopPath "Quick Access Widget.lnk"
$TargetPath = "powershell.exe"
$LaunchScript = Join-Path $PSScriptRoot "launch-quick-access.ps1"
$IconPath = "C:\Windows\System32\shell32.dll"

$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.Arguments = "-ExecutionPolicy Bypass -WindowStyle Hidden -File ""$LaunchScript"""
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.Description = "Quick Access Widget - Prompt Manager"
$Shortcut.IconLocation = "$IconPath,165"  # Modern app icon from shell32.dll
$Shortcut.WindowStyle = 7  # Minimized window
$Shortcut.Save()

Write-Host "`n=== Quick Access Widget Shortcut Created ===" -ForegroundColor Cyan
Write-Host "Desktop shortcut created at: $ShortcutPath" -ForegroundColor Green
Write-Host "`nFeatures:" -ForegroundColor Yellow
Write-Host "  - Opens Quick Access Widget with folder hierarchy" -ForegroundColor White
Write-Host "  - Floating always-on-top window" -ForegroundColor White
Write-Host "  - Quick copy for all prompts" -ForegroundColor White
Write-Host "  - Can be pinned to taskbar!" -ForegroundColor White
Write-Host "`nUsage:" -ForegroundColor Yellow
Write-Host "  1. Double-click 'Quick Access Widget' on your desktop" -ForegroundColor White
Write-Host "  2. Press Win+Alt+O to make it always-on-top" -ForegroundColor White
Write-Host "  3. Right-click the shortcut and select 'Pin to taskbar'" -ForegroundColor White
Write-Host "`nReady to use!" -ForegroundColor Cyan
