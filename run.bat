@echo off
echo === Авто-локализации Дашборд ===
echo.
echo 1. Установка зависимостей...
echo.
call npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo Ошибка при установке зависимостей!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo 2. Запуск приложения...
echo.
echo Приложение будет доступно по адресу: http://localhost:5173
echo.
call npm run dev

pause
