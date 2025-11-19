# Launch Quick Access Widget in Chrome App Mode (Always on Top)
# This opens the widget as a small floating window

$widgetPath = Join-Path $PSScriptRoot "frontend\public\easy-access-widget.html"
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

if ($chrome) {
    Write-Host "Launching Quick Access Widget..." -ForegroundColor Green
    Write-Host "Widget location: $widgetPath" -ForegroundColor Cyan
    Start-Process $chrome -ArgumentList $chromeArgs
    Write-Host "Widget launched!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tip: Right-click the title bar and select Always on Top in Chrome" -ForegroundColor Yellow
} else {
    Write-Host "Chrome not found. Please install Google Chrome or open the widget manually:" -ForegroundColor Red
    Write-Host "   $widgetPath" -ForegroundColor Cyan
}
