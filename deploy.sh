#!/bin/bash

# Simple deployment script for LostLink platform
# This script builds the project and serves it using a simple HTTP server

echo "🚀 Building LostLink for production..."

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Check if we should serve the project
if [ "$1" = "--serve" ]; then
    echo "🌐 Starting development server..."
    npx serve dist -p 3000
    echo "📱 Open http://localhost:3000 to view the application"
else
    echo "📁 Build files are ready in the 'dist' directory"
    echo "💡 Run '$0 --serve' to start a local server"
    echo "🚀 Deploy the 'dist' directory to your hosting platform (Netlify, Vercel, etc.)"
fi