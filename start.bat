@echo off
REM =========================================
REM  Roomy App - Windows Startup Script
REM  Modern menu-driven launcher
REM =========================================

setlocal enabledelayedexpansion
color 0B
title Roomy App Launcher

:menu
cls
echo.
echo  ============================================================
echo.
echo              ROOMY APP LAUNCHER
echo           Roommate Management Platform
echo.
echo  ============================================================
echo.
echo  QUICK START
echo  ------------------------------------------------------------
echo    [1] Start Full Stack (Backend + Frontend)
echo    [2] Start Frontend Only (Vite Dev Server)
echo    [3] Start Backend Only (Docker)
echo    [4] Start Backend Locally (Maven Spring Boot)
echo.
echo  BUILD
echo  ------------------------------------------------------------
echo    [5] Build Backend (Maven Package)
echo    [6] Build Frontend (Vite Production Build)
echo    [7] Build All (Backend + Frontend)
echo.
echo  MANAGEMENT
echo  ------------------------------------------------------------
echo    [8] Restart Backend Container
echo    [9] Stop All Docker Services
echo    [10] Reset Database (Delete All Data)
echo    [11] Show Service Status
echo.
echo  UTILITIES
echo  ------------------------------------------------------------
echo    [12] Open Documentation
echo    [0] Exit
echo.
echo  ============================================================
echo.
set /p choice="  Enter your choice: "

if "%choice%"=="1" goto fullstack
if "%choice%"=="2" goto frontend
if "%choice%"=="3" goto backend_docker
if "%choice%"=="4" goto backend_local
if "%choice%"=="5" goto build_backend
if "%choice%"=="6" goto build_frontend
if "%choice%"=="7" goto build_all
if "%choice%"=="8" goto restart_backend
if "%choice%"=="9" goto stop_docker
if "%choice%"=="10" goto reset_database
if "%choice%"=="11" goto status
if "%choice%"=="12" goto docs
if "%choice%"=="0" goto end

echo.
echo  [ERROR] Invalid choice. Please try again.
timeout /t 2 >nul
goto menu

REM =========================================
REM  QUICK START OPTIONS
REM =========================================

:fullstack
cls
echo.
echo  ============================================================
echo   Starting Full Stack Application...
echo  ============================================================
echo.

echo  [1/3] Checking Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Docker is not running!
    echo     Please start Docker Desktop and try again.
    echo.
    pause
    goto menu
)
echo  [OK] Docker is running

echo  [2/3] Starting Backend (Docker Compose)...
cd /d "c:\roomyproject\RoomyFinal-Backend\RoomyFinal-Backend"
docker-compose up -d
if errorlevel 1 (
    echo  [ERROR] Failed to start backend services
    pause
    goto menu
)
echo  [OK] Backend services started

echo  [3/3] Starting Frontend (Vite)...
cd /d "c:\roomyproject\RoomyFinal-main\RoomyFinal-main"
start "Roomy Frontend" cmd /k "npm run dev"
timeout /t 2 >nul

echo.
echo  ============================================================
echo   SUCCESS: Full Stack Application Ready!
echo  ============================================================
echo.
echo  Frontend:    http://localhost:5173
echo  Backend API: http://localhost:8080
echo  Database:    localhost:5432
echo.
echo  Test Users:
echo     - testuser / password123
echo     - john / john123
echo     - jane / jane123
echo.
pause
goto menu

:frontend
cls
echo.
echo  ============================================================
echo   Starting Frontend Development Server...
echo  ============================================================
echo.
cd /d "c:\roomyproject\RoomyFinal-main\RoomyFinal-main"

echo  Checking node_modules...
if not exist "node_modules\" (
    echo  Installing dependencies...
    call npm install
)

echo  Starting Vite dev server...
start "Roomy Frontend" cmd /k "npm run dev"
echo.
echo  [OK] Frontend starting in new window
echo  URL: http://localhost:5173
echo.
timeout /t 2 >nul
goto menu

:backend_docker
cls
echo.
echo  ============================================================
echo   Starting Backend with Docker...
echo  ============================================================
echo.

echo  Checking Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Docker is not running!
    echo     Please start Docker Desktop and try again.
    echo.
    pause
    goto menu
)
echo  [OK] Docker is running

echo  Starting services...
cd /d "c:\roomyproject\RoomyFinal-Backend\RoomyFinal-Backend"
docker-compose up -d

echo.
echo  [OK] Backend services started!
echo  Backend API: http://localhost:8080
echo  PostgreSQL:  localhost:5432
echo.
echo  TIP: Use option 8 to restart after code changes
echo.
pause
goto menu

:backend_local
cls
echo.
echo  ============================================================
echo   Starting Backend Locally (Maven)...
echo  ============================================================
echo.
echo  NOTE: Database must be running separately!
echo.
cd /d "c:\roomyproject\RoomyFinal-Backend\RoomyFinal-Backend"
call mvnw.cmd spring-boot:run
goto menu

REM =========================================
REM  BUILD OPTIONS
REM =========================================

:build_backend
cls
echo.
echo  ============================================================
echo   Building Backend (Maven Package)...
echo  ============================================================
echo.
cd /d "c:\roomyproject\RoomyFinal-Backend\RoomyFinal-Backend"
call mvnw.cmd clean package -DskipTests
if errorlevel 1 (
    echo.
    echo  [ERROR] Build failed!
    pause
    goto menu
)
echo.
echo  [OK] Build complete!
echo  JAR: target\roomy-backend-1.0.0.jar
echo.
pause
goto menu

:build_frontend
cls
echo.
echo  ============================================================
echo   Building Frontend (Vite Production)...
echo  ============================================================
echo.
cd /d "c:\roomyproject\RoomyFinal-main\RoomyFinal-main"

if not exist "node_modules\" (
    echo  Installing dependencies first...
    call npm install
)

call npm run build
if errorlevel 1 (
    echo.
    echo  [ERROR] Build failed!
    pause
    goto menu
)
echo.
echo  [OK] Build complete!
echo  Output: dist\
echo.
pause
goto menu

:build_all
cls
echo.
echo  ============================================================
echo   Building Backend + Frontend...
echo  ============================================================
echo.

echo  [1/2] Building Backend...
cd /d "c:\roomyproject\RoomyFinal-Backend\RoomyFinal-Backend"
call mvnw.cmd clean package -DskipTests
if errorlevel 1 (
    echo  [ERROR] Backend build failed!
    pause
    goto menu
)
echo  [OK] Backend built successfully

echo.
echo  [2/2] Building Frontend...
cd /d "c:\roomyproject\RoomyFinal-main\RoomyFinal-main"
if not exist "node_modules\" (
    call npm install
)
call npm run build
if errorlevel 1 (
    echo  [ERROR] Frontend build failed!
    pause
    goto menu
)
echo  [OK] Frontend built successfully

echo.
echo  ============================================================
echo   SUCCESS: All Builds Complete!
echo  ============================================================
echo.
echo  Backend:  target\roomy-backend-1.0.0.jar
echo  Frontend: dist\
echo.
pause
goto menu

REM =========================================
REM  MANAGEMENT OPTIONS
REM =========================================

:restart_backend
cls
echo.
echo  ============================================================
echo   Restarting Backend Container...
echo  ============================================================
echo.

echo  Checking Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Docker is not running!
    pause
    goto menu
)

cd /d "c:\roomyproject\RoomyFinal-Backend\RoomyFinal-Backend"
echo  Building latest JAR...
call mvnw.cmd clean package -DskipTests

echo  Restarting container...
docker-compose restart backend

echo.
echo  [OK] Backend restarted with latest code!
echo.
pause
goto menu

:stop_docker
cls
echo.
echo  ============================================================
echo   Stopping Docker Services...
echo  ============================================================
echo.

docker info >nul 2>&1
if errorlevel 1 (
    echo  [WARNING] Docker is not running. Nothing to stop.
    pause
    goto menu
)

cd /d "c:\roomyproject\RoomyFinal-Backend\RoomyFinal-Backend"
docker-compose down
echo.
echo  [OK] All services stopped
echo.
pause
goto menu

:reset_database
cls
echo.
echo  ============================================================
echo   WARNING: RESET DATABASE
echo  ============================================================
echo.
echo  This will:
echo    - DELETE ALL DATA in the database
echo    - Recreate schema from scratch
echo    - Restore test users only
echo.
set /p confirm="  Type YES (uppercase) to confirm: "
if not "%confirm%"=="YES" (
    echo.
    echo  [CANCELLED] Reset cancelled.
    timeout /t 2 >nul
    goto menu
)

echo.
echo  Checking Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Docker is not running!
    pause
    goto menu
)

cd /d "c:\roomyproject\RoomyFinal-Backend\RoomyFinal-Backend"
echo  Stopping containers and removing volumes...
docker-compose down -v

echo  Starting fresh containers...
docker-compose up -d

echo.
echo  [OK] Database reset complete!
echo.
echo  Test users restored:
echo     - testuser / password123
echo     - john / john123
echo     - jane / jane123
echo.
pause
goto menu

:status
cls
echo.
echo  ============================================================
echo   Service Status
echo  ============================================================
echo.

echo  Checking Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo  [X] Docker: Not running
    echo.
    pause
    goto menu
)
echo  [OK] Docker: Running

echo.
echo  Docker Containers:
echo  ------------------------------------------------------------
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo  ------------------------------------------------------------
echo.
pause
goto menu

REM =========================================
REM  UTILITIES
REM =========================================

:docs
cls
echo.
echo  ============================================================
echo   Documentation
echo  ============================================================
echo.
echo  Available Documentation:
echo.
echo    [1] Design System (DESIGN-SYSTEM.md)
echo    [2] Testing Checklist (TESTING-CHECKLIST.md)
echo    [3] Deployment Guide (DEPLOYMENT.md)
echo    [4] Project Summary (PROJECT-SUMMARY.md)
echo    [5] Setup Instructions (README-SETUP.md)
echo    [6] Back to Main Menu
echo.
set /p docchoice="  Select document: "

if "%docchoice%"=="1" start "" "c:\roomyproject\RoomyFinal-main\RoomyFinal-main\DESIGN-SYSTEM.md"
if "%docchoice%"=="2" start "" "c:\roomyproject\RoomyFinal-main\RoomyFinal-main\TESTING-CHECKLIST.md"
if "%docchoice%"=="3" start "" "c:\roomyproject\RoomyFinal-main\RoomyFinal-main\DEPLOYMENT.md"
if "%docchoice%"=="4" start "" "c:\roomyproject\RoomyFinal-main\RoomyFinal-main\PROJECT-SUMMARY.md"
if "%docchoice%"=="5" start "" "c:\roomyproject\RoomyFinal-Backend\RoomyFinal-Backend\README-SETUP.md"
if "%docchoice%"=="6" goto menu

timeout /t 1 >nul
goto docs

:end
cls
echo.
echo  ============================================================
echo   Thanks for using Roomy App!
echo  ============================================================
echo.
timeout /t 2 >nul
exit /b 0
