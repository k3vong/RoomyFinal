# Roomy Backend Setup Guide

## Prerequisites
- Java 21 or higher ✓ (Java 25 detected)
- PostgreSQL database (or Docker for containerized setup)
- Maven (optional - project includes Maven wrapper)

## Current Status
✓ Backend is already compiled (classes found in target/)
✓ Application properties configured
✓ Database schema ready (init.sql)

## Setup Options

### Option 1: Using Docker (Recommended)
If Docker is not installed, install Docker Desktop from: https://www.docker.com/products/docker-desktop

Then run:
```powershell
docker-compose up -d
```

This will start both PostgreSQL database and the Spring Boot backend.

### Option 2: Manual Setup (without Docker)

#### 1. Install PostgreSQL
Download and install PostgreSQL from: https://www.postgresql.org/download/windows/

#### 2. Create Database
```sql
CREATE DATABASE roomy_db;
CREATE USER roomy_user WITH PASSWORD 'roomy_password';
GRANT ALL PRIVILEGES ON DATABASE roomy_db TO roomy_user;
```

#### 3. Run init.sql
```powershell
psql -U roomy_user -d roomy_db -f init.sql
```

#### 4. Run the Backend
```powershell
# Using Maven wrapper (recommended)
.\mvnw.cmd spring-boot:run

# Or using Java directly (if Maven wrapper fails)
java -cp "target\classes;target\roomy-backend-1.0.0.jar" com.roomy.RoomyBackendApplication
```

## Testing the Backend
Once running, the backend will be available at: http://localhost:8080

Test endpoints:
- GET http://localhost:8080/api/users
- GET http://localhost:8080/api/apartments
- GET http://localhost:8080/api/chores

## Common Issues

### Maven Wrapper Missing Files
If Maven wrapper fails, you need to either:
1. Install Maven globally, or
2. Use the compiled classes directly (see Option 2 above)

### Database Connection Issues
Check that:
- PostgreSQL is running
- Database credentials match application.properties
- Port 5432 is not blocked

### Port Already in Use
If port 8080 is busy, change it in application.properties:
```
server.port=8081
```
