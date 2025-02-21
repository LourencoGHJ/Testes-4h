@echo off
echo Checking Node.js installation...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Creating package.json...
call npm init -y

echo Installing Node dependencies...
call npm install electron@latest --save
call npm install sqlite3 --save
call npm install chart.js@3.9.1 --save
call npm install bootstrap@5.3.0 --save
call npm install moment@2.29.4 --save

echo Building sqlite3...
call npm rebuild sqlite3

echo Starting the application...
npm start

pause