' Silent launcher for Prompt Manager - No popup windows!
Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get the script's directory
strScriptDir = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Start Backend Server (hidden)
strBackendCmd = "cmd /c cd /d """ & strScriptDir & "\backend"" && "".venv\Scripts\python.exe"" -m app.main"
objShell.Run strBackendCmd, 0, False

' Wait for backend to initialize
WScript.Sleep 3000

' Start Frontend Server (hidden) - Use dev:react instead of dev to skip Electron
strFrontendCmd = "cmd /c cd /d """ & strScriptDir & "\frontend"" && npm run dev:react"
objShell.Run strFrontendCmd, 0, False

' Wait for frontend to start
WScript.Sleep 5000

' Open Chrome directly (or default browser if Chrome not found)
' Try Chrome first
strChromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
If objFSO.FileExists(strChromePath) Then
    objShell.Run """" & strChromePath & """ --app=http://localhost:5180", 1, False
Else
    ' Fall back to default browser
    objShell.Run "http://localhost:5180", 1, False
End If
