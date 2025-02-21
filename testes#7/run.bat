@echo off
title J.A.R.V.I.S System
color 0A

echo Checking Node.js installation...
node --version > nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed! Please install Node.js first.
    pause
    exit /b 1
)

echo Initializing J.A.R.V.I.S...
echo.

if not exist node_modules (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Error installing dependencies!
        pause
        exit /b 1
    )
)

echo Starting J.A.R.V.I.S...
npm start
if errorlevel 1 (
    echo Error starting J.A.R.V.I.S!
    pause
    exit /b 1
)
pause