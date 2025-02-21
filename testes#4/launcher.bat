@echo off
color 0B
cls
echo =====================================
echo   📝 GERENCIADOR DE TAREFAS 📝
echo =====================================
echo.

:: Verificar se o Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Erro: Node.js não está instalado!
    echo Por favor, instale o Node.js primeiro.
    pause
    exit /b 1
)

:: Criar package.json se não existir
if not exist package.json (
    echo Criando package.json...
    echo {"name": "task-manager", "version": "1.0.0"} > package.json
)

:: Instalar chalk se não existir
if not exist node_modules\chalk (
    echo Instalando dependências...
    call npm install chalk@4.1.2
    if %errorlevel% neq 0 (
        echo Erro ao instalar dependências!
        pause
        exit /b 1
    )
)

:: Executar o programa
node taskManager.js
if %errorlevel% neq 0 (
    echo.
    echo Algo correu mal! Pressione qualquer tecla para sair...
    pause > nul
)