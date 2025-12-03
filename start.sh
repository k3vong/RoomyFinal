#!/usr/bin/env bash

#=========================================
#  Roomy App - Linux/Unix Startup Script
#  Modern menu-driven launcher
#=========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Project paths (update these if your paths are different)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/RoomyFinal-Backend/RoomyFinal-Backend"
FRONTEND_DIR="$SCRIPT_DIR/RoomyFinal-main/RoomyFinal-main"

# Helper functions
print_header() {
    clear
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                                                           ║${NC}"
    echo -e "${CYAN}║              ${BOLD}🏠 ROOMY APP LAUNCHER 🏠${NC}${CYAN}                     ║${NC}"
    echo -e "${CYAN}║           ${BOLD}Roommate Management Platform${NC}${CYAN}                   ║${NC}"
    echo -e "${CYAN}║                                                           ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed!"
        echo "  Please install Docker and try again."
        return 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running!"
        echo "  Please start Docker and try again."
        return 1
    fi
    
    return 0
}

check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed!"
        echo "  Please install Node.js and try again."
        return 1
    fi
    return 0
}

check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed!"
        echo "  Please install npm and try again."
        return 1
    fi
    return 0
}

press_any_key() {
    echo ""
    read -n 1 -s -r -p "Press any key to continue..."
    echo ""
}

show_menu() {
    print_header
    echo -e "${CYAN}┌───────────────────────────────────────────────────────────┐${NC}"
    echo -e "${CYAN}│${NC}  ${BOLD}QUICK START${NC}                                              ${CYAN}│${NC}"
    echo -e "${CYAN}└───────────────────────────────────────────────────────────┘${NC}"
    echo "  [1] 🚀 Start Full Stack (Backend + Frontend)"
    echo "  [2] 🎨 Start Frontend Only (Vite Dev Server)"
    echo "  [3] ⚙️  Start Backend Only (Docker)"
    echo "  [4] 🔧 Start Backend Locally (Maven Spring Boot)"
    echo ""
    echo -e "${CYAN}┌───────────────────────────────────────────────────────────┐${NC}"
    echo -e "${CYAN}│${NC}  ${BOLD}BUILD${NC}                                                    ${CYAN}│${NC}"
    echo -e "${CYAN}└───────────────────────────────────────────────────────────┘${NC}"
    echo "  [5] 📦 Build Backend (Maven Package)"
    echo "  [6] 📦 Build Frontend (Vite Production Build)"
    echo "  [7] 📦 Build All (Backend + Frontend)"
    echo ""
    echo -e "${CYAN}┌───────────────────────────────────────────────────────────┐${NC}"
    echo -e "${CYAN}│${NC}  ${BOLD}MANAGEMENT${NC}                                               ${CYAN}│${NC}"
    echo -e "${CYAN}└───────────────────────────────────────────────────────────┘${NC}"
    echo "  [8] 🔄 Restart Backend Container"
    echo "  [9] 🛑 Stop All Docker Services"
    echo "  [10] 🗑️  Reset Database (Delete All Data)"
    echo "  [11] 🔧 Run Database Migration"
    echo "  [12] 📊 Show Service Status"
    echo ""
    echo -e "${CYAN}┌───────────────────────────────────────────────────────────┐${NC}"
    echo -e "${CYAN}│${NC}  ${BOLD}UTILITIES${NC}                                                ${CYAN}│${NC}"
    echo -e "${CYAN}└───────────────────────────────────────────────────────────┘${NC}"
    echo "  [13] 📖 Open Documentation"
    echo "  [0] 👋 Exit"
    echo ""
    read -p "  Enter your choice: " choice
    echo ""
}

#=========================================
#  QUICK START OPTIONS
#=========================================

start_fullstack() {
    print_header
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  Starting Full Stack Application...                      ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo "  [1/3] Checking Docker..."
    if ! check_docker; then
        press_any_key
        return
    fi
    print_success "Docker is running"
    
    echo "  [2/3] Starting Backend (Docker Compose)..."
    cd "$BACKEND_DIR"
    if docker-compose up -d; then
        print_success "Backend services started"
    else
        print_error "Failed to start backend services"
        press_any_key
        return
    fi
    
    echo "  [3/3] Starting Frontend (Vite)..."
    cd "$FRONTEND_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "  📦 Installing dependencies..."
        npm install
    fi
    
    # Start frontend in background
    npm run dev &
    FRONTEND_PID=$!
    sleep 2
    
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  ${GREEN}✅ Full Stack Application Ready!${NC}                        ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "  📱 Frontend:    ${BOLD}http://localhost:5173${NC}"
    echo -e "  ⚙️  Backend API: ${BOLD}http://localhost:8080${NC}"
    echo -e "  🗄️  Database:    ${BOLD}localhost:5432${NC}"
    echo ""
    echo "  👤 Test Users:"
    echo "     • testuser / password123"
    echo "     • john / john123"
    echo "     • jane / jane123"
    echo ""
    print_info "Frontend is running in background (PID: $FRONTEND_PID)"
    print_info "Use 'kill $FRONTEND_PID' to stop frontend"
    press_any_key
}

start_frontend() {
    print_header
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  Starting Frontend Development Server...                 ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    if ! check_node || ! check_npm; then
        press_any_key
        return
    fi
    
    cd "$FRONTEND_DIR"
    
    echo "  Checking node_modules..."
    if [ ! -d "node_modules" ]; then
        echo "  📦 Installing dependencies..."
        npm install
    fi
    
    echo "  🎨 Starting Vite dev server..."
    print_success "Frontend starting"
    echo -e "  📱 URL: ${BOLD}http://localhost:5173${NC}"
    echo ""
    
    npm run dev
}

start_backend_docker() {
    print_header
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  Starting Backend with Docker...                         ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo "  Checking Docker..."
    if ! check_docker; then
        press_any_key
        return
    fi
    print_success "Docker is running"
    
    echo "  Starting services..."
    cd "$BACKEND_DIR"
    docker-compose up -d
    
    echo ""
    print_success "Backend services started!"
    echo -e "  ⚙️  Backend API: ${BOLD}http://localhost:8080${NC}"
    echo -e "  🗄️  PostgreSQL:  ${BOLD}localhost:5432${NC}"
    echo ""
    print_info "Tip: Use option 8 to restart after code changes"
    press_any_key
}

start_backend_local() {
    print_header
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  Starting Backend Locally (Maven)...                     ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    print_warning "Note: Database must be running separately!"
    echo ""
    
    cd "$BACKEND_DIR"
    ./mvnw spring-boot:run
}

#=========================================
#  BUILD OPTIONS
#=========================================

build_backend() {
    print_header
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  Building Backend (Maven Package)...                     ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    cd "$BACKEND_DIR"
    if ./mvnw clean package -DskipTests; then
        echo ""
        print_success "Build complete!"
        echo "  📦 JAR: target/roomy-backend-1.0.0.jar"
    else
        echo ""
        print_error "Build failed!"
    fi
    press_any_key
}

build_frontend() {
    print_header
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  Building Frontend (Vite Production)...                  ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    if ! check_node || ! check_npm; then
        press_any_key
        return
    fi
    
    cd "$FRONTEND_DIR"
    
    if [ ! -d "node_modules" ]; then
        echo "  📦 Installing dependencies first..."
        npm install
    fi
    
    if npm run build; then
        echo ""
        print_success "Build complete!"
        echo "  📦 Output: dist/"
    else
        echo ""
        print_error "Build failed!"
    fi
    press_any_key
}

build_all() {
    print_header
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  Building Backend + Frontend...                          ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo "  [1/2] Building Backend..."
    cd "$BACKEND_DIR"
    if ./mvnw clean package -DskipTests; then
        print_success "Backend built successfully"
    else
        print_error "Backend build failed!"
        press_any_key
        return
    fi
    
    echo ""
    echo "  [2/2] Building Frontend..."
    cd "$FRONTEND_DIR"
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    if npm run build; then
        print_success "Frontend built successfully"
    else
        print_error "Frontend build failed!"
        press_any_key
        return
    fi
    
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  ${GREEN}✅ All Builds Complete!${NC}                                 ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "  📦 Backend:  target/roomy-backend-1.0.0.jar"
    echo "  📦 Frontend: dist/"
    press_any_key
}

#=========================================
#  MANAGEMENT OPTIONS
#=========================================

restart_backend() {
    print_header
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  Restarting Backend Container...                         ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo "  Checking Docker..."
    if ! check_docker; then
        press_any_key
        return
    fi
    
    cd "$BACKEND_DIR"
    echo "  Building latest JAR..."
    ./mvnw clean package -DskipTests
    
    echo "  Restarting container..."
    docker-compose restart backend
    
    echo ""
    print_success "Backend restarted with latest code!"
    press_any_key
}

stop_docker() {
    print_header
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  Stopping Docker Services...                             ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    if ! docker info &> /dev/null; then
        print_warning "Docker is not running. Nothing to stop."
        press_any_key
        return
    fi
    
    cd "$BACKEND_DIR"
    docker-compose down
    echo ""
    print_success "All services stopped"
    press_any_key
}

reset_database() {
    print_header
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  ${YELLOW}⚠️  RESET DATABASE WARNING ⚠️${NC}                           ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "  This will:"
    echo "    • DELETE ALL DATA in the database"
    echo "    • Recreate schema from scratch"
    echo "    • Restore test users only"
    echo ""
    read -p "  Type YES (uppercase) to confirm: " confirm
    
    if [ "$confirm" != "YES" ]; then
        echo ""
        print_error "Reset cancelled."
        sleep 2
        return
    fi
    
    echo ""
    echo "  Checking Docker..."
    if ! check_docker; then
        press_any_key
        return
    fi
    
    cd "$BACKEND_DIR"
    echo "  Stopping containers and removing volumes..."
    docker-compose down -v
    
    echo "  Starting fresh containers..."
    docker-compose up -d
    
    echo ""
    print_success "Database reset complete!"
    echo ""
    echo "  👤 Test users restored:"
    echo "     • testuser / password123"
    echo "     • john / john123"
    echo "     • jane / jane123"
    press_any_key
}

run_migration() {
    print_header
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  Running Database Migration...                           ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo "  Checking Docker..."
    if ! check_docker; then
        press_any_key
        return
    fi
    
    cd "$BACKEND_DIR"
    
    # Check if migration.sql exists
    if [ ! -f "migration.sql" ]; then
        print_error "migration.sql not found!"
        echo "  Expected location: $BACKEND_DIR/migration.sql"
        press_any_key
        return
    fi
    
    print_info "Found migration.sql"
    echo ""
    echo "  This will:"
    echo "    • Add created_by column to apartments table"
    echo "    • Update existing data structure"
    echo "    • Safe to run multiple times"
    echo ""
    read -p "  Continue? (y/n): " confirm
    
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo ""
        print_error "Migration cancelled."
        sleep 2
        return
    fi
    
    echo ""
    echo "  Executing migration..."
    
    # Try to run migration via Docker
    if docker exec -i roomy-postgres psql -U roomy -d roomy < migration.sql 2>&1; then
        echo ""
        print_success "Migration completed successfully!"
        echo ""
        read -p "  Restart backend to apply changes? (y/n): " restart_choice
        if [[ "$restart_choice" =~ ^[Yy]$ ]]; then
            echo ""
            echo "  Restarting backend..."
            docker-compose restart backend
            print_success "Backend restarted"
        fi
    else
        echo ""
        print_error "Migration failed!"
        echo ""
        echo "  Troubleshooting:"
        echo "    • Check if PostgreSQL container is running"
        echo "    • Verify database credentials"
        echo "    • Review migration.sql syntax"
    fi
    
    press_any_key
}

show_status() {
    print_header
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  Service Status                                          ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo "  Checking Docker..."
    if ! docker info &> /dev/null; then
        echo -e "  🔴 Docker: ${RED}Not running${NC}"
        press_any_key
        return
    fi
    echo -e "  🟢 Docker: ${GREEN}Running${NC}"
    
    echo ""
    echo "  Docker Containers:"
    echo "  ──────────────────────────────────────────────────────────"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    echo "  ──────────────────────────────────────────────────────────"
    press_any_key
}

#=========================================
#  UTILITIES
#=========================================

show_docs() {
    print_header
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  Documentation                                           ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "  📖 Available Documentation:"
    echo ""
    echo "    [1] Design System (DESIGN-SYSTEM.md)"
    echo "    [2] Testing Checklist (TESTING-CHECKLIST.md)"
    echo "    [3] Deployment Guide (DEPLOYMENT.md)"
    echo "    [4] Project Summary (PROJECT-SUMMARY.md)"
    echo "    [5] Setup Instructions (README-SETUP.md)"
    echo "    [6] Back to Main Menu"
    echo ""
    read -p "  Select document: " docchoice
    
    case $docchoice in
        1)
            if command -v xdg-open &> /dev/null; then
                xdg-open "$FRONTEND_DIR/DESIGN-SYSTEM.md" &
            elif command -v open &> /dev/null; then
                open "$FRONTEND_DIR/DESIGN-SYSTEM.md" &
            else
                less "$FRONTEND_DIR/DESIGN-SYSTEM.md"
            fi
            ;;
        2)
            if command -v xdg-open &> /dev/null; then
                xdg-open "$FRONTEND_DIR/TESTING-CHECKLIST.md" &
            elif command -v open &> /dev/null; then
                open "$FRONTEND_DIR/TESTING-CHECKLIST.md" &
            else
                less "$FRONTEND_DIR/TESTING-CHECKLIST.md"
            fi
            ;;
        3)
            if command -v xdg-open &> /dev/null; then
                xdg-open "$FRONTEND_DIR/DEPLOYMENT.md" &
            elif command -v open &> /dev/null; then
                open "$FRONTEND_DIR/DEPLOYMENT.md" &
            else
                less "$FRONTEND_DIR/DEPLOYMENT.md"
            fi
            ;;
        4)
            if command -v xdg-open &> /dev/null; then
                xdg-open "$FRONTEND_DIR/PROJECT-SUMMARY.md" &
            elif command -v open &> /dev/null; then
                open "$FRONTEND_DIR/PROJECT-SUMMARY.md" &
            else
                less "$FRONTEND_DIR/PROJECT-SUMMARY.md"
            fi
            ;;
        5)
            if command -v xdg-open &> /dev/null; then
                xdg-open "$BACKEND_DIR/README-SETUP.md" &
            elif command -v open &> /dev/null; then
                open "$BACKEND_DIR/README-SETUP.md" &
            else
                less "$BACKEND_DIR/README-SETUP.md"
            fi
            ;;
        6)
            return
            ;;
    esac
    
    sleep 1
    show_docs
}

#=========================================
#  MAIN LOOP
#=========================================

main() {
    while true; do
        show_menu
        
        case $choice in
            1)
                start_fullstack
                ;;
            2)
                start_frontend
                ;;
            3)
                start_backend_docker
                ;;
            4)
                start_backend_local
                ;;
            5)
                build_backend
                ;;
            6)
                build_frontend
                ;;
            7)
                build_all
                ;;
            8)
                restart_backend
                ;;
            9)
                stop_docker
                ;;
            10)
                reset_database
                ;;
            11)
                run_migration
                ;;
            12)
                show_status
                ;;
            13)
                show_docs
                ;;
            0)
                clear
                echo ""
                echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
                echo -e "${CYAN}║${NC}  Thanks for using Roomy App! 👋                          ${CYAN}║${NC}"
                echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
                echo ""
                exit 0
                ;;
            *)
                print_error "Invalid choice. Please try again."
                sleep 2
                ;;
        esac
    done
}

# Run main function
main
