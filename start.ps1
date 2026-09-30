Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   Starting MIRROR - Workflow Intelligence" -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Cyan

$MirrorRoot = $PSScriptRoot

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$MirrorRoot/backend'; node src/server.js"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$MirrorRoot/frontend'; npm run dev"

Write-Host "`nServers launched in background windows:" -ForegroundColor Green
Write-Host "Frontend:    http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend API: http://localhost:3001" -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Cyan
