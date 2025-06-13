@echo off
echo 📦 Starting fullstack Northwind project...

REM Check if Docker is running
docker info >nul 2>&1
IF ERRORLEVEL 1 (
    echo ❌ Docker Desktop is not running. Please start Docker and try again.
    pause
    exit /b
)

REM Start SQL Server container
echo 🐳 Starting SQL Server container: sql-northwind
docker start sql-northwind

REM Start backend
echo 🚀 Starting backend (ASP.NET Core)
start "Backend" cmd /k cd /d "%~dp0NorthwindAPI" ^&^& "C:\Program Files\dotnet\dotnet.exe" run

REM Start frontend
echo 🎨 Starting frontend (React)
start "Frontend" cmd /k cd /d "%~dp0northwind-client" ^&^& npm start

echo ✅ Everything launched! Check your browser on http://localhost:3000 and http://localhost:7258/swagger
pause
