# 🚀 Quick Start Guide for Probaho

The workspace dependency issue can be resolved easily. Here are the steps to get your Probaho app running:

## Option 1: Run Web App Only (Recommended for now)

```bash
# Navigate to web app directory
cd apps/web

# Install dependencies (ignore workspace warnings)
npm install --legacy-peer-deps

# Start the development server
npm run dev
```

Then open http://localhost:3000 in your browser.

## Option 2: Use Yarn (Better for monorepos)

```bash
# Install yarn globally
npm install -g yarn

# Install all dependencies
yarn install

# Start web app
yarn workspace @probaho/web dev

# Start mobile app (in another terminal)
yarn workspace @probaho/mobile start
```

## Option 3: Fix Dependencies Manually

Update the mobile app package.json to fix version conflicts:

```bash
cd apps/mobile
npm install --legacy-peer-deps
```

## What You'll See

Once running, the web app will show:
- ✅ Beautiful modern UI with gradient design
- ✅ Wallet balance dashboard with mock data
- ✅ Quick actions (Add Money, Send Money, etc.)
- ✅ Recent transactions with filtering
- ✅ Interactive modals for transfers
- ✅ Responsive design for all devices
- ✅ Smooth animations and transitions

## Features Working

- 🏦 **Wallet Dashboard**: Shows balance, today's activity, recent transactions
- 💰 **Add Money Modal**: Multi-step flow for adding money from MFS providers
- 📤 **Send Money Modal**: Complete transfer flow with recipient selection
- 📱 **MFS Integration**: Support for bKash, Rocket, Nagad, Upay, Tapp, MyCash
- 🔒 **Security**: PIN-based authentication flows
- 📊 **Analytics**: Transaction history and statistics
- 🎨 **UI/UX**: Modern design with Tailwind CSS and Framer Motion

## Next Steps

1. **Backend Integration**: Connect to real MFS APIs
2. **Authentication**: Implement actual user login/signup
3. **Database**: Add PostgreSQL for data persistence
4. **Mobile App**: Complete React Native implementation
5. **Testing**: Add unit and integration tests
6. **Deployment**: Deploy to production

## Recent Improvements (Performance & UX)

- Lazy-loaded dashboard components (`WalletBalance`, `QuickActions`, `RecentTransactions`) to reduce initial bundle size.
- Navigation links use Next.js `Link` with prefetch to speed up route changes.
- Utility `debounce` included in `apps/web/src/lib/utils.ts` for smarter search and input handling.
- Header and Quick Actions updated for better accessibility and faster perceived navigation.

## Developer: Simulate MFS Payment Flow

- The `Add Money` page now includes a "Simulate Payment (Dev)" button that redirects to `/add-money/callback` with `provider`, `status`, `amount`, and `tx` query params.
- The callback route saves a top-up record to `localStorage` under `probaho_topups` and redirects to `/history`.
- This is for development and testing only — replace with a real gateway integration for production.

### Preview Gateway (Showcase)

- If you want to demo the flow without a server, use the `Preview Gateway (Showcase)` button on the `Add Money` page. It opens a client-side demo page and redirects back to the app confirm flow.
- This is ideal for presentations or sharing the UX with stakeholders without needing real provider integration.

### Replacing the mock gateway with a real provider

1. Set `PAYMENT_SECRET` in your environment and `NEXT_PUBLIC_BASE_URL` to your deployed URL.
2. Replace the logic in `/api/payment/create` with calls to the MFS provider's payment/session creation API.
3. Update the gateway to redirect to your real provider URL instead of `/api/payment/mock-gateway`.
4. Implement a server webhook endpoint that validates callbacks using provider signatures and updates the user wallet server-side.
5. Use HTTPS, secure storage for secrets, and validate every callback before crediting funds.

## Troubleshooting

If you encounter issues:

1. **Clear node_modules**: `rm -rf node_modules && npm install --legacy-peer-deps`
2. **Use yarn**: `yarn install` (handles workspaces better)
3. **Run individually**: Navigate to `apps/web` and run `npm run dev`
4. **Check Node version**: Ensure you're using Node.js 18+

The app is fully functional with mock data and ready for backend integration!
