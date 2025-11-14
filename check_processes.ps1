# Kill processes on ports 8000 and 8001
$ports = @(8000, 8001)

foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            $processId = $conn.OwningProcess
            try {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host "Killed process $processId on port $port"
            } catch {
                Write-Host "Could not kill process $processId (may already be dead)"
            }
        }
    }
}

Write-Host "Cleanup complete"
