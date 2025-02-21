@echo off
color 0A
cls
echo ===================================
echo     RESULTADOS DOS TESTES PYTHON
echo ===================================
echo.
python -m unittest test_example.py -v
echo.
echo ===================================
echo Pressione qualquer tecla para sair...
pause > nul