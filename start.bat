@echo off
echo ===================================================
echo   Starting MIRROR - Workflow Intelligence
echo ===================================================

echo Starting Backend Server on port 3001...
start "MIRROR Backend" cmd /k "cd backend && node src/server.js"

timeout /t 2 /nobreak >nul

echo Starting Frontend Dev Server on port 5173...
start "MIRROR Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers initiated!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:3001
echo ===================================================
