#!/bin/bash
# Build script for Render deployment
# This installs dependencies for both server and client, then builds the client

set -e  # Exit on error

echo "📦 Installing root dependencies..."
npm install

echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

echo "📦 Installing client dependencies..."
cd client
npm install

echo "🔨 Building React client..."
npm run build

echo "✅ Build complete!"
