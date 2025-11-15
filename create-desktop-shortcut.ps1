# PowerShell script to create desktop shortcut for Prompt Manager
# Now creates a proper pinnable shortcut with no popup windows!

$DesktopPath = [System.Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $DesktopPath "Prompt Manager.lnk"
$TargetPath = "wscript.exe"
$VBSScript = Join-Path $PSScriptRoot "launch-silent.vbs"
$IconPath = "C:\Windows\System32\shell32.dll"

$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.Arguments = """$VBSScript"""
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.Description = "Prompt Manager - AI Prompt Organization Tool"
$Shortcut.IconLocation = "$IconPath,165"  # Modern app icon from shell32.dll
$Shortcut.WindowStyle = 7  # Minimized window
$Shortcut.Save()

Write-Host "`n=== Prompt Manager Shortcut Created ===" -ForegroundColor Cyan
Write-Host "Desktop shortcut created at: $ShortcutPath" -ForegroundColor Green
Write-Host "`nFeatures:" -ForegroundColor Yellow
Write-Host "  - No terminal windows popup" -ForegroundColor White
Write-Host "  - Silent background startup" -ForegroundColor White
Write-Host "  - Opens directly in Chrome" -ForegroundColor White
Write-Host "  - Can be pinned to taskbar!" -ForegroundColor White
Write-Host "`nUsage:" -ForegroundColor Yellow
Write-Host "  1. Double-click 'Prompt Manager' on your desktop" -ForegroundColor White
Write-Host "  2. Right-click the shortcut and select 'Pin to taskbar'" -ForegroundColor White
Write-Host "`nReady to use! Enjoy your streamlined experience!" -ForegroundColor Cyan
