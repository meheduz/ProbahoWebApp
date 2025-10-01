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

# Create a temporary deploy directory
rm -rf deploy
mkdir deploy

# First build a clean export
rm -rf out
npm run build

# Copy the exported build to deploy directory
cp -r out/* deploy/

# Ensure the _next directory structure is correct
mkdir -p deploy/_next/static
cp -r out/_next/static/* deploy/_next/static/

# Create index.html if it doesn't exist
if [ ! -f deploy/index.html ]; then
  echo '<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Probaho</title>
    <link rel="stylesheet" href="/ProbahoWebApp/_next/static/css/21297fe1594f4928.css" />
    <script src="/ProbahoWebApp/_next/static/chunks/webpack-17c02b7ae71b0748.js" defer></script>
    <script src="/ProbahoWebApp/_next/static/chunks/main-91f2891f3b449df0.js" defer></script>
    <script src="/ProbahoWebApp/_next/static/chunks/app/layout-c95ded988b3f448f.js" defer></script>
    <script src="/ProbahoWebApp/_next/static/chunks/app/page-22d7968d4a70cd6a.js" defer></script>
  </head>
  <body>
    <div id="__next">
      <div id="app-root"></div>
    </div>
  </body>
</html>' > deploy/index.html
fi

# Add .nojekyll file
touch deploy/.nojekyll

# Initialize git in the deploy directory
cd deploy
git init
git checkout -b main

# Add all files
git add -A

# Commit
git commit -m "Deploy to GitHub Pages"

# Force push to the gh-pages branch of the parent repo
git push -f https://github.com/meheduz/ProbahoWebApp.git main:gh-pages

# Clean up
cd ..
rm -rf deploy