# All-in-one launcher: Opens widget and sets it always on top

$widgetPath = Join-Path $PSScriptRoot "easy-access-widget.html"
$chromeArgs = @(
    "--app=file:///$($widgetPath -replace '\\','/')",
    "--window-size=320,600",
    "--window-position=50,50",
    "--new-window"
)

# Try to find Chrome
$chromePaths = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

$chrome = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $chrome) {
    Write-Host "Chrome not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Launching Quick Access Widget..." -ForegroundColor Green
Start-Process $chrome -ArgumentList $chromeArgs

# Wait for window to open
Write-Host "Waiting for window to open..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Set always on top
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32 {
    [DllImport("user32.dll")]
    public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

    [DllImport("user32.dll")]
    public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);

    public static readonly IntPtr HWND_TOPMOST = new IntPtr(-1);
    public const uint SWP_NOMOVE = 0x0002;
    public const uint SWP_NOSIZE = 0x0001;
    public const uint SWP_SHOWWINDOW = 0x0040;
}
"@

$found = $false
for ($i = 0; $i -lt 10; $i++) {
    $processes = Get-Process chrome -ErrorAction SilentlyContinue
    foreach ($proc in $processes) {
        $windowTitle = $proc.MainWindowTitle
        if ($windowTitle -like "*Quick Access*") {
            $hwnd = $proc.MainWindowHandle
            if ($hwnd -ne 0) {
                Write-Host "Found window! Setting always on top..." -ForegroundColor Green
                [Win32]::SetWindowPos($hwnd, [Win32]::HWND_TOPMOST, 0, 0, 0, 0,
                    [Win32]::SWP_NOMOVE -bor [Win32]::SWP_NOSIZE -bor [Win32]::SWP_SHOWWINDOW)
                Write-Host "Done! Widget is now always on top." -ForegroundColor Green
                $found = $true
                break
            }
        }
    }
    if ($found) { break }
    Start-Sleep -Milliseconds 500
}

if (-not $found) {
    Write-Host "Could not set always on top automatically." -ForegroundColor Yellow
    Write-Host "You can manually run: .\set-always-on-top.ps1" -ForegroundColor Cyan
}
