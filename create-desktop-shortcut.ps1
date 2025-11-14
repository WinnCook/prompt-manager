# PowerShell script to create desktop shortcut for Prompt Manager

$DesktopPath = [System.Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $DesktopPath "Prompt Manager.lnk"
$TargetPath = Join-Path $PSScriptRoot "start-prompt-manager.bat"
$IconPath = "C:\Windows\System32\shell32.dll"

$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.Description = "Start Prompt Manager Application"
$Shortcut.IconLocation = "$IconPath,13"  # Folder icon from shell32.dll
$Shortcut.Save()

Write-Host "Desktop shortcut created successfully at: $ShortcutPath" -ForegroundColor Green
Write-Host "You can now double-click 'Prompt Manager' on your desktop to start the application!" -ForegroundColor Cyan
