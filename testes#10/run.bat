@echo off
title HR Assessment System
color 0A

echo ===================================
echo    HR Assessment System Launcher
echo ===================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit
)

REM Create necessary directories if they don't exist
if not exist assets\img mkdir assets\img
if not exist assets\css mkdir assets\css
if not exist assets\js mkdir assets\js
if not exist src\database mkdir src\database

REM Clean installation
if exist node_modules (
    echo Cleaning previous installation...
    rmdir /s /q node_modules
)
if exist package-lock.json del package-lock.json

REM Initialize new project
echo Initializing new project...
call npm init -y

REM Install essential dependencies
echo Installing dependencies...
call npm install electron@latest
call npm install better-sqlite3@latest
call npm install bootstrap@latest
call npm install chart.js@latest

REM Initialize database
echo Initializing database...
node src/database/db.js

REM Start the application
echo.
echo Starting application...
echo.
call npm start

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ERROR: Application failed to start!
    echo Please check the error messages above.
)

pause