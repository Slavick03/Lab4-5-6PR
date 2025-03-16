**Создать сеть для контейнеров**

docker network create todo-network

Эта сеть позволит контейнерам взаимодействовать друг с другом по именам (todo-mysql, todo-backend и т. д.), а также правильно работать с пробросом портов.

**Запуск MySQL контейнера**

docker run --name todo-mysql \
 --network todo-network \
 -e MYSQL_ROOT_PASSWORD=123456 \
 -e MYSQL_DATABASE=tododb \
 -p 3307:3306 \
 -d mysql:8

**Сборка и запуск backend**

cd backend
docker build -t todo-backend .

docker run --name todo-backend \
 --network todo-network \
 -e DB_HOST=todo-mysql \
 -e DB_USER=root \
 -e DB_PASSWORD=123456 \
 -e DB_NAME=tododb \
 -e DB_PORT=3306 \
 -p 3001:3001 \
 -d todo-backend

Проверка бэкенда: http://localhost:3001/api/tasks

**Сборка и запуск frontend**

cd backend
docker build -t todo-frontend .

docker run --name todo-frontend \
 --network todo-network \
 -p 3000:3000 \
 -d todo-frontend

Проверка фронтенда: http://localhost:3000

**Проверка запущенных контейнеров**

docker ps
Должны быть запущены: todo-mysql todo-backend todo-frontend

**Остановка и удаление контейнеров**

docker stop todo-frontend todo-backend todo-mysql

docker rm todo-frontend todo-backend todo-mysql

**Удаление образов**

docker rmi todo-frontend todo-backend

**Если нужно удалить созданную сеть**

docker network rm todo-network

**Полный список команд для очистки контейнеров и образов**

docker stop todo-frontend todo-backend todo-mysql
docker rm todo-frontend todo-backend todo-mysql
docker rmi todo-frontend todo-backend
docker network rm todo-network

**Пересборка и запуск frontend**

docker build -t todo-frontend .
docker stop todo-frontend
docker rm todo-frontend
docker run --name todo-frontend --network todo-network -p 3000:3000 -d todo-frontend

Проверка фронтенда: http://localhost:3000

**Пересборка и запуск backend**

docker build -t todo-backend .
docker stop todo-backend
docker rm todo-backend
docker run --name todo-backend --network todo-network -p 3001:3001 -d todo-backend

Проверка бэкенда: http://localhost:3001/api/tasks

**Full script to rebuild and run the entire application**

#!/bin/bash

# Остановка и удаление старых контейнеров, образов и сети

docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true
docker rmi $(docker images -q todo-frontend todo-backend) 2>/dev/null || true
docker network rm todo-network 2>/dev/null || true

# Создание сети

docker network create todo-network

# Запуск базы данных MySQL

docker run --name todo-mysql \
 --network todo-network \
 -e MYSQL_ROOT_PASSWORD=123456 \
 -e MYSQL_DATABASE=tododb \
 -p 3307:3306 \
 -d mysql:8

# Ожидание запуска MySQL

echo "⌛ Ожидание запуска MySQL..."
until docker exec todo-mysql mysqladmin ping -h"localhost" --silent; do
sleep 2
done

# Сборка и запуск бэкенда

docker build -t todo-backend ./backend
docker run --name todo-backend \
 --network todo-network \
 -e DB_HOST=todo-mysql \
 -e DB_USER=root \
 -e DB_PASSWORD=123456 \
 -e DB_NAME=tododb \
 -e DB_PORT=3306 \
 -e SMTP_HOST=mailhog \
 -e SMTP_PORT=1025 \
 -e MAILHOG_API=http://mailhog:8025 \
 -p 3001:3001 \
 -d todo-backend

# Сборка и запуск фронтенда

docker build -t todo-frontend ./frontend
docker run --name todo-frontend \
 --network todo-network \
 -e REACT_APP_API_URL=http://todo-backend:3001/api \
 -p 3000:3000 \
 -d todo-frontend

# Запуск почтового сервера MailHog

docker run --name mailhog \
 --network todo-network \
 -p 8025:8025 \
 -p 1025:1025 \
 -d mailhog/mailhog

echo "🚀 Все контейнеры успешно запущены!"
echo "📌 Frontend: http://localhost:3000"
echo "📌 Backend API: http://localhost:3001/api"
echo "📬 MailHog (почта): http://localhost:8025"

**docker-compose.yml**

Запустить docker-compose:

cd ~/Desktop/todo-app
docker-compose up --build -d

Остановить и удалить контейнеры:
docker-compose down -v

Frontend доступен по: http://localhost:3000
Backend API доступен по: http://localhost:3001/api/tasks
MailHog для проверки email: http://localhost:8025
Проверка запущен ли backend: http://localhost:3001/
Проверка MailHog API напрямую в браузере: http://localhost:8025/api/v2/messages
