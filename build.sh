#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e 

echo "Starting frontend build process..."

# Step 1: Navigate to client and build
echo "Building React client with pnpm..."
cd react-client
pnpm run build
cd ..

# Step 2: Remove old public directory
echo "Cleaning up old public folder..."
rm -rf public

# Step 3: Copy dist to public
echo "Moving new build to public directory..."
cp -r react-client/dist public

# Step 4: build backend
echo "building backend..."
pnpm run build

# Step 5: build backend
echo "moving public to dist"
cp -r public dist/public

echo "✅ Build complete!"