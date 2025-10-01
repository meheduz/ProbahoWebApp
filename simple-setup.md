# Simple Setup Guide

The workspace protocol error occurs because npm doesn't natively support `workspace:*` syntax. Here are two solutions:

## Option 1: Use Yarn (Recommended)

```bash
# Install yarn globally
npm install -g yarn

# Install dependencies with yarn (supports workspaces natively)
yarn install

# Start development
yarn dev
```

## Option 2: Use npm with file paths

Update the package.json files to use relative paths instead of workspace protocol:

```json
{
  "dependencies": {
    "@probaho/shared": "file:../packages/shared"
  }
}
```

## Option 3: Run Individual Apps

Instead of using the monorepo, you can run each app separately:

### Web App Only
```bash
cd apps/web
npm install
npm run dev
```

### Mobile App Only
```bash
cd apps/mobile
npm install
npm start
```

## Quick Start (Simplest)

1. **Install dependencies in root:**
   ```bash
   npm install
   ```

2. **Run web app:**
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

3. **Open browser:**
   Go to http://localhost:3000

The web app will work independently with mock data and all the UI components we've built.
