# PowerShell script to create desktop shortcut for Quick Access Widget

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
$Shortcut.IconLocation = "$IconPath,24"  # Widget/app icon from shell32.dll
$Shortcut.WindowStyle = 7  # Minimized window
$Shortcut.Save()

Write-Host "`n=== Quick Access Widget Shortcut Created ===" -ForegroundColor Cyan
Write-Host "Desktop shortcut created at: $ShortcutPath" -ForegroundColor Green
Write-Host "`nUsage:" -ForegroundColor Yellow
Write-Host "  1. Double-click 'Quick Access Widget' on your desktop" -ForegroundColor White
Write-Host "  2. Use Win + Alt + O to make it always-on-top" -ForegroundColor White
Write-Host "`nReady to use!" -ForegroundColor Cyan
