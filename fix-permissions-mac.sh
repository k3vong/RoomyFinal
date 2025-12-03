#!/usr/bin/env bash

#=========================================
#  Fix Permissions for Mac
#  Run this if you get "Permission denied" errors
#=========================================

echo "🔧 Fixing permissions for Roomy App on macOS..."
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/RoomyFinal-main/RoomyFinal-main"
BACKEND_DIR="$SCRIPT_DIR/RoomyFinal-Backend/RoomyFinal-Backend"

# Fix frontend permissions
if [ -d "$FRONTEND_DIR/node_modules" ]; then
    echo "📦 Fixing frontend node_modules permissions..."
    chmod -R +x "$FRONTEND_DIR/node_modules/.bin"
    echo "✅ Frontend permissions fixed"
else
    echo "⚠️  node_modules not found. Run 'npm install' first."
fi

# Fix backend Maven wrapper permissions
if [ -f "$BACKEND_DIR/mvnw" ]; then
    echo "🔧 Fixing Maven wrapper permissions..."
    chmod +x "$BACKEND_DIR/mvnw"
    echo "✅ Maven wrapper permissions fixed"
fi

# Fix start scripts
echo "🚀 Fixing start script permissions..."
chmod +x "$SCRIPT_DIR/start-mac.sh"
chmod +x "$SCRIPT_DIR/start.sh"
echo "✅ Start scripts permissions fixed"

echo ""
echo "✅ All permissions fixed!"
echo ""
echo "Now you can run: ./start-mac.sh"
