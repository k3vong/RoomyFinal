# Roomy - Roommate Management Application

A modern, full-stack web application for managing shared living spaces. Track rent payments, manage chores, organize grocery lists, and coordinate with roommates - all in one sleek, intuitive platform.

![Roomy Banner](https://img.shields.io/badge/Built%20with-React%20%26%20Spring%20Boot-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

### **Apartment Management**
- Create and manage shared apartments
- Invite roommates to join
- Track apartment details and members

### **Payment Tracking**
- Split rent evenly or rotate payment responsibility
- Track payment status and history
- Set due dates and get notifications
- View payment breakdowns per roommate

### **Chore Management**
- Create and assign household tasks
- Set recurring chores (daily, monthly)
- Mark tasks as complete
- Track who's responsible for what

### **Grocery Lists**
- Shared shopping lists
- Organize items by category
- Mark items as purchased
- Never forget milk again!

### **Roommate Directory**
- View all roommates in your apartment
- Set custom status messages
- See who's available, busy, or away
- Share apartment ID for easy invites

### **Expense Calculator**
- Built-in calculator for splitting costs
- Beautiful gradient design
- Perfect for quick calculations

### **User Profiles**
- Customize your profile
- Update personal information
- Set availability status
- Add bio and custom messages

## Design System

Roomy features a modern design system inspired by Notion, Linear, and Stripe:
- **Clean & Professional** - Minimal distractions, maximum productivity
- **Fully Responsive** - Beautiful on mobile, tablet, and desktop
- **Accessible** - WCAG 2.1 AA compliant
- **Performant** - Optimized for speed with lazy loading and code splitting

For detailed design documentation, see [DESIGN-SYSTEM.md](./RoomyFinal-main/RoomyFinal-main/DESIGN-SYSTEM.md)

## Quick Start

### Prerequisites

- **Docker Desktop** (for containerized backend)
- **Node.js 18+** and npm
- **Java 17+** (for local backend development)

### Super Easy Setup

We've created modern startup scripts for all platforms:

#### Windows
```cmd
start.bat
```

#### Linux
```bash
chmod +x start.sh
./start.sh
```

#### macOS
```bash
chmod +x start-mac.sh
./start-mac.sh
```

The startup scripts provide a beautiful menu-driven interface with options to:
- Start full stack (backend + frontend)
- Start frontend only
- Start backend only
- Build for production
- Restart services
- Check status
- Open documentation

**See [STARTUP-SCRIPTS.md](./STARTUP-SCRIPTS.md) for detailed usage guide.**

## Setup Instructions

### Option 1: Using Startup Scripts (Recommended)

Simply run the appropriate script for your platform (see Quick Start above) and choose option 1 to start the full stack application.

### Option 2: Manual Setup

#### Backend with Docker Compose

1. Navigate to the backend directory:
   ```bash
   cd RoomyFinal-Backend/RoomyFinal-Backend
   ```

2. Start the backend and PostgreSQL database:
   ```bash
   docker-compose up -d
   ```

3. To stop the services:
   ```bash
   docker-compose down
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```powershell
   cd c:\roomyproject\RoomyFinal-main\RoomyFinal-main
   ```

2. Install dependencies (first time only):
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   npm run dev
   ```

4. Open your browser to: `http://localhost:5173`

### Option 2: Running Locally (Without Docker)

#### Backend

1. Install and start PostgreSQL locally

2. Create the database:
   ```sql
   CREATE DATABASE roomy_db;
   CREATE USER roomy_user WITH PASSWORD 'roomy_password';
   GRANT ALL PRIVILEGES ON DATABASE roomy_db TO roomy_user;
   ```

3. Run the initialization script:
   ```powershell
   psql -U roomy_user -d roomy_db -f c:\roomyproject\RoomyFinal-Backend\RoomyFinal-Backend\init.sql
   ```

4. Navigate to the backend directory:
   ```powershell
   cd c:\roomyproject\RoomyFinal-Backend\RoomyFinal-Backend
   ```

5. Run the application:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

#### Frontend

Same as Option 1 - follow the Frontend steps above.

## Building for Production

### Backend

Build the JAR file:
```powershell
cd c:\roomyproject\RoomyFinal-Backend\RoomyFinal-Backend
.\mvnw.cmd clean package -DskipTests
```

The executable JAR will be created at:
`target/roomy-backend-1.0.0.jar`

Run it with:
```powershell
java -jar target/roomy-backend-1.0.0.jar
```

### Frontend

Build the production bundle:
```powershell
cd c:\roomyproject\RoomyFinal-main\RoomyFinal-main
npm run build
```

The production files will be in the `dist/` directory.

## API Endpoints

The backend exposes the following REST API endpoints:

- **Users**: `/api/users/*`
- **Apartments**: `/api/apartments/*`
- **Residence**: `/api/residence/*`
- **Chores**: `/api/chores/*`
- **Groceries**: `/api/groceries/*`
- **Rent Payments**: `/api/rent/*`
- **Calculator**: `/api/calculator/*`

All endpoints are CORS-enabled for `http://localhost:5173`.

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts
- `apartments` - Apartment information
- `residence` - User-Apartment relationships
- `chores` - Chore tracking
- `groceries` - Shopping list items
- `rent_payments` - Rent payment tracking

See `init.sql` for the complete schema.

## Configuration

### Backend Configuration

Edit `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/roomy_db
spring.datasource.username=roomy_user
spring.datasource.password=roomy_password

# Server Configuration
server.port=8080
```

### Frontend Configuration

The frontend is configured to connect to the backend at `http://localhost:8080`. 
To change this, update the axios calls in the React components.

## Troubleshooting

### Backend Issues

1. **Maven wrapper not found**: The maven wrapper files have been restored. If you still have issues, try:
   ```powershell
   mvn wrapper:wrapper
   ```

2. **Database connection failed**: Ensure PostgreSQL is running and credentials match `application.properties`

3. **Port 8080 already in use**: Change the port in `application.properties`:
   ```properties
   server.port=8081
   ```

### Frontend Issues

1. **npm command not found**: Ensure Node.js is installed and in your PATH

2. **Port 5173 already in use**: Vite will automatically try the next available port

3. **Cannot connect to backend**: Ensure the backend is running on port 8080

## Features

- **User Management**: Registration and login
- **Apartment Management**: Create and join apartments
- **Chore Tracking**: Assign and complete chores
- **Grocery Lists**: Shared shopping lists
- **Rent Payment Tracking**: Split or queue-based rent payment
- **Status Updates**: Set and view roommate statuses
- **Dashboard**: Overview of apartment information

## Technologies Used

### Backend
- Spring Boot 3.5.7
- Spring Data JDBC
- PostgreSQL 15
- Java 21
- Maven

### Frontend
- React 19.1.1
- Vite 7.1.7
- React Router 7.9.4
- Axios 1.13.1
- React Icons 5.5.0

