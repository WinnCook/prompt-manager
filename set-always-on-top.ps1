# PowerShell script to set Quick Access widget always on top
# Run this after launching the widget

Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32 {
    [DllImport("user32.dll")]
    public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

    [DllImport("user32.dll")]
    public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);

    public static readonly IntPtr HWND_TOPMOST = new IntPtr(-1);
    public static readonly IntPtr HWND_NOTOPMOST = new IntPtr(-2);
    public const uint SWP_NOMOVE = 0x0002;
    public const uint SWP_NOSIZE = 0x0001;
    public const uint SWP_SHOWWINDOW = 0x0040;
}
"@

# Find Chrome window with "Quick Access" in title
Write-Host "Looking for Quick Access widget window..." -ForegroundColor Yellow

$processes = Get-Process chrome -ErrorAction SilentlyContinue
foreach ($proc in $processes) {
    $windowTitle = $proc.MainWindowTitle
    if ($windowTitle -like "*Quick Access*") {
        $hwnd = $proc.MainWindowHandle
        if ($hwnd -ne 0) {
            Write-Host "Found window: $windowTitle" -ForegroundColor Green

            # Set window always on top
            [Win32]::SetWindowPos($hwnd, [Win32]::HWND_TOPMOST, 0, 0, 0, 0,
                [Win32]::SWP_NOMOVE -bor [Win32]::SWP_NOSIZE -bor [Win32]::SWP_SHOWWINDOW)

            Write-Host "Window set to Always on Top!" -ForegroundColor Green
            exit 0
        }
    }
}

Write-Host "Quick Access window not found. Make sure the widget is open!" -ForegroundColor Red
Write-Host "Window should have 'Quick Access' in the title." -ForegroundColor Yellow
