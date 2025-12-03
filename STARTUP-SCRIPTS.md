# Roomy App Startup Scripts

Modern, cross-platform startup scripts for the Roomy roommate management application.

## Available Scripts

### Windows
- **`start.bat`** - Windows batch script with modern UI and emoji support
  - Color-coded output
  - Menu-driven interface with 12 options
  - Docker health checks
  - Error handling and validation

### Linux/Unix
- **`start.sh`** - Universal Linux/Unix bash script
  - ANSI color support
  - Cross-distribution compatibility
  - Works on Ubuntu, Debian, Fedora, Arch, etc.
  - Smart dependency detection

### macOS
- **`start-mac.sh`** - macOS-optimized bash script
  - Homebrew integration
  - Auto-opens Docker Desktop if not running
  - Native macOS `open` command support
  - System requirements checker

## Quick Start

### Windows
```cmd
start.bat
```

### Linux/Unix
```bash
chmod +x start.sh
./start.sh
```

### macOS
```bash
chmod +x start-mac.sh
./start-mac.sh
```

## Features

### All Platforms
- **Quick Start Options**
  - Start full stack (backend + frontend)
  - Start frontend only
  - Start backend with Docker
  - Start backend locally with Maven

- **Build Options**
  - Build backend (Maven package)
  - Build frontend (Vite production)
  - Build all (backend + frontend)

- **Management**
  - Restart backend container
  - Stop all Docker services
  - Reset database (with confirmation)
  - Show service status

- **Utilities**
  - Open documentation
  - Check system requirements (macOS)
  - Open app in browser (macOS)

### Windows-Specific Features
- Windows Terminal color support
- Automatic `cd /d` path handling
- PowerShell-safe commands
- Custom window titles

### Linux-Specific Features
- Cross-distribution package manager detection
- `xdg-open` for documentation
- Background process management
- PID tracking for services

### macOS-Specific Features
- Homebrew installation suggestions
- Auto-start Docker Desktop
- Opens apps in new Terminal windows using AppleScript
- Native `open` command for browsers
- macOS version detection
- Beautiful unicode box-drawing characters

## Prerequisites

### All Platforms
- **Docker Desktop** (for containerized backend)
- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **Java** (JDK 17+ for local backend)

### Platform-Specific Installation

#### Windows
```cmd
# Install via Chocolatey
choco install docker-desktop nodejs openjdk17
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt install docker.io nodejs npm openjdk-17-jdk

# Fedora
sudo dnf install docker nodejs npm java-17-openjdk

# Arch
sudo pacman -S docker nodejs npm jdk17-openjdk
```

#### macOS
```bash
# Install via Homebrew
brew install node
brew install openjdk@17
brew install --cask docker
```

## Menu Options Explained

### Option 1: Start Full Stack
Starts both backend (Docker) and frontend (Vite dev server) in one command.
- Perfect for development
- Backend runs in detached mode
- Frontend opens in new window (macOS) or separate terminal
- Auto-displays URLs and test credentials

### Option 2: Start Frontend Only
Starts just the Vite development server.
- Use when backend is already running
- Auto-installs dependencies if needed
- Hot module replacement (HMR) enabled
- Opens on `http://localhost:5173`

### Option 3: Start Backend (Docker)
Starts PostgreSQL and Spring Boot backend in Docker containers.
- Detached mode (runs in background)
- Automatic health checks
- Database persists between restarts
- Opens on `http://localhost:8080`

### Option 4: Start Backend Locally
Runs Spring Boot backend with Maven locally.
- Requires separate database setup
- Useful for backend development
- Live reload with Spring Boot DevTools
- Direct Maven control

### Option 5: Build Backend
Creates production-ready JAR file.
- Skips tests for faster builds
- Output: `target/roomy-backend-1.0.0.jar`
- Can be deployed to any server

### Option 6: Build Frontend
Creates optimized production build.
- Vite production optimization
- Code splitting and minification
- Output: `dist/` directory
- Ready for static hosting

### Option 7: Build All
Builds both backend and frontend sequentially.
- One-command production build
- Shows progress for each step
- Displays output locations

### Option 8: Restart Backend
Rebuilds JAR and restarts Docker container.
- Use after backend code changes
- Automatic rebuild and redeploy
- Zero-downtime restart

### Option 9: Stop Docker Services
Gracefully stops all Docker containers.
- Stops backend and database
- Data persists (volumes retained)
- Safe shutdown

### Option 10: Reset Database
**DESTRUCTIVE**: Deletes all data and recreates schema.
- Requires typing "YES" to confirm
- Removes all volumes
- Restores only test users
- Use for fresh start

### Option 11: Show Service Status
Displays current status of all services.
- Docker container status
- Port mappings
- System information (macOS)

### Option 12: Open Documentation
Opens project documentation files.
- Design System
- Testing Checklist
- Deployment Guide
- Project Summary
- Setup Instructions

## Customization

### Changing Project Paths

If your project structure is different, edit these variables:

**Windows (`start.bat`):**
```batch
REM Update these paths if needed
cd /d "c:\roomyproject\RoomyFinal-Backend\RoomyFinal-Backend"
cd /d "c:\roomyproject\RoomyFinal-main\RoomyFinal-main"
```

**Linux/macOS (`start.sh` or `start-mac.sh`):**
```bash
# Update these paths if needed
BACKEND_DIR="$SCRIPT_DIR/RoomyFinal-Backend/RoomyFinal-Backend"
FRONTEND_DIR="$SCRIPT_DIR/RoomyFinal-main/RoomyFinal-main"
```

### Changing Default Ports

**Frontend (Vite):**
Edit `RoomyFinal-main/RoomyFinal-main/vite.config.js`:
```javascript
server: {
  port: 5173, // Change this
}
```

**Backend (Spring Boot):**
Edit `RoomyFinal-Backend/RoomyFinal-Backend/src/main/resources/application.properties`:
```properties
server.port=8080  # Change this
```

**Database (Docker Compose):**
Edit `RoomyFinal-Backend/RoomyFinal-Backend/docker-compose.yml`:
```yaml
ports:
  - "5432:5432"  # Change host port (first number)
```

## Troubleshooting

### Docker not running
**Problem:** `Docker is not running!`
**Solution:**
- Windows: Start Docker Desktop from Start Menu
- macOS: Script will try to auto-start, or open Docker Desktop manually
- Linux: `sudo systemctl start docker`

### Port already in use
**Problem:** `Address already in use`
**Solution:**
```bash
# Find process using port (replace 8080 with your port)
# Linux/macOS:
lsof -i :8080
kill -9 <PID>

# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Node modules missing
**Problem:** `Cannot find module...`
**Solution:** Scripts auto-install dependencies, but you can manually run:
```bash
cd RoomyFinal-main/RoomyFinal-main
npm install
```

### Permission denied (Linux/macOS)
**Problem:** `Permission denied`
**Solution:**
```bash
chmod +x start.sh start-mac.sh
```

### Maven build fails
**Problem:** `mvnw: command not found` or build errors
**Solution:**
```bash
# Make mvnw executable
chmod +x mvnw

# Or use system Maven
mvn clean package -DskipTests
```

## Service URLs

Once started, services are available at:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React app (Vite dev server) |
| Backend API | http://localhost:8080 | Spring Boot REST API |
| Swagger Docs | http://localhost:8080/swagger-ui.html | API documentation |
| Database | localhost:5432 | PostgreSQL (internal) |

## Test Users

| Username | Password | Role |
|----------|----------|------|
| testuser | password123 | User |
| john | john123 | User |
| jane | jane123 | User |

## Script Comparison

| Feature | Windows | Linux | macOS |
|---------|---------|-------|-------|
| Color output | Yes | Yes | Yes |
| Auto-install deps | Yes | Yes | Yes |
| Docker health check | Yes | Yes | Yes + Auto-start |
| New window for frontend | Yes | No | Yes (Terminal) |
| Open browser | No | Warning (via xdg-open) | Yes |
| Package manager integration | No | Warning (suggestions) | Yes (Homebrew) |
| System requirements check | No | No | Yes |

## Development Tips

### Hot Reload
- **Frontend:** Vite provides instant hot module replacement
- **Backend:** Use Spring Boot DevTools for auto-restart on code changes

### Debug Mode
To run backend in debug mode (port 5005):
```bash
cd RoomyFinal-Backend/RoomyFinal-Backend
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

### Watch Mode
Frontend automatically watches for changes. For backend, use option 8 to restart after changes.

## Production Deployment

For production deployment:
1. Use option 7 to build both backend and frontend
2. Deploy JAR: `target/roomy-backend-1.0.0.jar`
3. Deploy frontend: Upload `dist/` contents to web server
4. See `DEPLOYMENT.md` for detailed cloud deployment guides

## Additional Documentation

- **DESIGN-SYSTEM.md** - UI components and styling guide
- **TESTING-CHECKLIST.md** - Comprehensive testing procedures
- **DEPLOYMENT.md** - Production deployment instructions
- **PROJECT-SUMMARY.md** - Project overview and achievements
- **README-SETUP.md** - Detailed setup instructions

## Contributing

To add features to the startup scripts:
1. Test on your platform
2. Maintain cross-platform compatibility
3. Update this README with new features
4. Follow existing code style and comments

## License

These scripts are part of the Roomy App project and follow the same license.


