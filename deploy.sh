#!/usr/bin/env bash

# Exit if any command fails
set -e

# Echo all commands for debugging
set -x

# Navigate to the web app directory
cd apps/web

# Install dependencies if needed
npm install

# Create env file
echo "NEXT_PUBLIC_BASE_PATH=/ProbahoWebApp" > .env.local

# Build the app
npm run build

# Navigate to the out directory
cd out

# Initialize git in the out directory
git init
git checkout -b main

# Add all files
git add -A

# Commit
git commit -m "Deploy to GitHub Pages"

# Force push to the gh-pages branch of the parent repo
git push -f git@github.com:meheduz/ProbahoWebApp.git main:gh-pages

# Clean up
cd ..
rm -rf out