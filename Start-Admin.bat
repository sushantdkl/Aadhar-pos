@echo off
color 0A
title POS Admin Central - Starting...

echo ========================================
echo    POS ADMIN CENTRAL
echo    Starting Server...
echo ========================================
echo.

echo [1/3] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!

echo.
echo [2/3] Installing dependencies...
if not exist "node_modules\" (
    npm install
) else (
    echo Dependencies already installed.
)

echo.
echo [3/3] Starting Admin Panel...
echo.
echo ========================================
echo     Admin Panel will open on:
echo     http://localhost:3001
echo ========================================
echo.
echo     Default Login:
echo     Username: admin
echo     Password: admin123
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
