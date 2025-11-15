@echo off
REM Launch Quick Access Widget
echo Launching Quick Access Widget...

REM Get the directory where this batch file is located
set WIDGET_DIR=%~dp0
set WIDGET_PATH=%WIDGET_DIR%easy-access-widget.html

REM Try to find Chrome
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set CHROME=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe
) else (
    echo Chrome not found! Please open the widget manually:
    echo %WIDGET_PATH%
    pause
    exit /b 1
)

REM Launch Chrome in app mode with the widget
start "" "%CHROME%" --app="file:///%WIDGET_PATH%" --window-size=320,600 --window-position=50,50 --new-window

echo Widget launched!
echo.
echo Tip: To keep it always on top:
echo   1. Right-click the Chrome window title bar
echo   2. Install the "Always on Top" extension, OR
echo   3. Use Alt+Space, then T (in Windows PowerToys)
