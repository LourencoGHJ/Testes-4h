@echo off
color 0B
cls
echo =====================================
echo   📚 STUDY ASSISTANT
echo =====================================
echo.

:: Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Python not installed!
    pause
    exit /b 1
)

:: Create virtual environment
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

:: Activate virtual environment
call venv\Scripts\activate

:: Install dependencies
echo Installing dependencies...
python -m pip install --upgrade pip
pip install flask flask-sqlalchemy

:: Start server
echo Starting server...
start /B python main.py

:: Wait for server
timeout /t 3 >nul

:: Open in browser
start http://localhost:5000

echo.
echo Server running! Close this window to stop.
echo.
pause
taskkill /F /IM python.exe >nul 2>nul