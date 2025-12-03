@echo off
REM Update database schema to add created_by column to apartments table

echo ================================================
echo Running Database Migration for Apartments
echo ================================================
echo.

REM Navigate to backend directory
cd /d "%~dp0RoomyFinal-Backend\RoomyFinal-Backend"

echo Applying migration.sql to add created_by column...
docker exec -i roomy-postgres psql -U roomy_user -d roomy_db < migration.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo Migration completed successfully!
    echo ================================================
    echo.
    echo Changes applied:
    echo - Added created_by column to apartments table
    echo - Set existing apartments to be owned by first user
    echo.
) else (
    echo.
    echo ================================================
    echo ERROR: Migration failed!
    echo ================================================
    echo Please check if:
    echo 1. Docker is running
    echo 2. Database container is running: docker ps
    echo 3. Database credentials are correct
    echo.
)

pause
