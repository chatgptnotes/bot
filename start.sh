#!/bin/bash

# ClawdBot Dashboard Startup Script

echo "🤖 Starting ClawdBot Dashboard..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo ""
fi

# Start the dashboard
echo "🚀 Launching dashboard on http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

pnpm dev
