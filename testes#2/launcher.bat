@echo off
color 0B
cls
echo =====================================
echo    JOGO DE ADIVINHAÇÃO EM NODE.JS
echo =====================================
echo.
node game.js
if errorlevel 1 (
    echo Algo correu mal! Pressiona qualquer tecla para sair...
    pause > nul
)