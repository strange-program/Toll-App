#!/bin/bash

# Enable strict mode
set -e  # Exit on error
set -u  # Treat unset variables as an error
set -o pipefail  # Catch errors in piped commands

# Define paths
FRONTEND_DIR="front-end/my-app"
API_DIR="back-end/RESTful API"
CLI_DIR="cli-client"

echo "Starting deployment..."

# Check if directories exist
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "Error: Frontend directory not found"
    exit 1
fi

if [ ! -d "$API_DIR" ]; then
    echo "Error: API directory not found"
    exit 1
fi

if [ ! -d "$CLI_DIR" ]; then
    echo "Error: CLI directory not found"
    exit 1
fi

# Check for package.json files
if [ ! -f "$FRONTEND_DIR/package.json" ]; then
    echo "Error: package.json not found in frontend directory"
    exit 1
fi

if [ ! -f "$API_DIR/package.json" ]; then
    echo "Error: package.json not found in API directory"
    exit 1
fi

if [ ! -f "$CLI_DIR/package.json" ]; then
    echo "Error: package.json not found in CLI directory"
    exit 1
fi

# Install dependencies
echo "Installing API dependencies..."
(cd "$API_DIR" && npm install)

echo "Installing frontend dependencies..."
(cd "$FRONTEND_DIR" && npm install)

echo "Installing CLI dependencies..."
(cd "$CLI_DIR" && npm install)

# Start services
echo "Starting API..."
(cd "$API_DIR" && npm start &)  # Run in the background

# Delay to let API start
sleep 5

echo "Starting frontend..."
(cd "$FRONTEND_DIR" && npm start &)  # Run in the background

# Link CLI
echo "Linking CLI..."
(cd "$CLI_DIR" && npm link)

echo "Deployment complete."
