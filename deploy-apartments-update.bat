@echo off
REM Complete deployment script for Roomy apartment management updates

echo ================================================
echo Roomy Apartments Update Deployment
echo ================================================
echo.
echo This will:
echo 1. Stop the backend server
echo 2. Update database schema
echo 3. Rebuild backend with new apartment creator features
echo 4. Restart the backend server
echo.
pause

REM Step 1: Stop backend
echo.
echo [1/4] Stopping backend server...
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak >nul

REM Step 2: Run database migration
echo.
echo [2/4] Updating database schema...
cd /d "%~dp0RoomyFinal-Backend\RoomyFinal-Backend"
docker exec -i roomy-postgres psql -U roomy_user -d roomy_db < migration.sql

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Database migration failed!
    pause
    exit /b 1
)

REM Step 3: Rebuild backend
echo.
echo [3/4] Rebuilding backend with Maven...
call mvnw.cmd clean package -DskipTests

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backend build failed!
    pause
    exit /b 1
)

REM Step 4: Start backend
echo.
echo [4/4] Starting backend server...
start "Roomy Backend" cmd /k "java -jar target\roomy-backend-1.0.0.jar"

echo.
echo ================================================
echo Deployment Complete!
echo ================================================
echo.
echo Backend is starting on http://localhost:8080
echo Frontend should be running on http://localhost:5173
echo.
echo New features available:
echo - Apartment creators can edit/delete their apartments
echo - Creator badges shown on apartment cards
echo - Current apartment highlighted
echo - Users can only join one apartment at a time
echo.
echo Press any key to exit...
pause >nul
