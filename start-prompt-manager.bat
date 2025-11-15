@echo off
echo Starting Prompt Manager...
echo.

REM Get the script's directory
set SCRIPT_DIR=%~dp0

REM Start Backend Server
echo Starting Backend Server...
start "Prompt Manager - Backend" cmd /k "cd /d "%SCRIPT_DIR%backend" && ".venv\Scripts\python.exe" -m app.main"

REM Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

REM Start Frontend Server (React only - no Electron)
echo Starting Frontend Server...
start "Prompt Manager - Frontend" cmd /k "cd /d "%SCRIPT_DIR%frontend" && npm run dev:react"

REM Wait for frontend to start
timeout /t 5 /nobreak >nul

REM Open browser
echo Opening Prompt Manager in browser...
start http://localhost:5173

echo.
echo Prompt Manager is starting!
echo - Backend: http://127.0.0.1:8000
echo - Frontend: http://localhost:5173
echo.
echo Press any key to close this window (servers will continue running)...
pause >nul
