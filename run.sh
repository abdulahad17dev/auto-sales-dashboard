#!/bin/bash

echo "=== Авто-локализации Дашборд ==="
echo ""
echo "1. Установка зависимостей..."
echo ""

npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "Ошибка при установке зависимостей!"
    exit 1
fi

echo ""
echo "2. Запуск приложения..."
echo ""
echo "Приложение будет доступно по адресу: http://localhost:5173"
echo ""

npm run dev
