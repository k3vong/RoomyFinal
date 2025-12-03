# Roomy Frontend Setup Guide

## Prerequisites
- Node.js and npm (detected but PowerShell execution policy blocked)

## Current Status
✓ Dependencies installed (node_modules/ found)
✓ Import paths fixed in App.jsx
✓ Vite configuration ready

## Setup Steps

### Fix PowerShell Execution Policy (Required)
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then you can use npm commands.

### Running the Frontend

#### Development Mode
```powershell
npm run dev
```
The app will be available at: http://localhost:5173

#### Build for Production
```powershell
npm run build
```

#### Preview Production Build
```powershell
npm run preview
```

## Configuration

### Backend API Connection
The frontend is configured to connect to the backend at: http://localhost:8080

Controllers are set up with CORS for: http://localhost:5173

### Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Sign up page
- `/dashboard` - Main dashboard
- `/apartments` - Apartment management
- `/chores` - Chore tracking
- `/payments` - Payment management
- `/roommates` - Roommate information
- `/forgot-password` - Password recovery
- `/emailsent` - Email confirmation

## Common Issues

### PowerShell Execution Policy
If you see "running scripts is disabled", follow the setup step above.

### Port Already in Use
If port 5173 is busy, Vite will automatically try the next available port.

### Backend Connection Errors
Ensure the backend is running on http://localhost:8080 before testing API calls.

## Development
All source files are in `src/`:
- React components in feature folders (Dashboard/, Chores/, etc.)
- Main routing in App.jsx
- Styling in component-specific .css files
