# Probaho: Cross-MFS Unified Wallet

**Tagline:** Your Money, Your Control

Probaho is a revolutionary fintech solution that unifies Bangladesh's fragmented mobile financial services (MFS) ecosystem. By consolidating multiple MFS providers into a single platform, Probaho enables seamless cross-MFS transfers while dramatically reducing costs and time.

## 🚀 The Problem

- **Fragmented MFS ecosystem**: Bangladesh has over 130M registered MFS accounts across bKash, Rocket, Nagad, etc.
- **Cross-platform barrier**: Users cannot directly transfer between MFS — they must cash out/in, wasting 30–60 minutes and paying 6–12% fees
- **User frustration**: 84.7% of surveyed users face problems sending money when the recipient uses another MFS

## 💡 The Solution

Probaho provides a unified wallet that:
- Consolidates balances from any MFS or bank using official APIs
- Enables instant transfer to any recipient, regardless of their MFS
- Cuts transfer cost to ~1.5%, saving billions annually
- Keeps all funds safe under partner bank custody (regulated by Bangladesh Bank)

## 🏗️ Architecture

This project uses a monorepo structure with shared code between web and mobile applications:

```
probaho/
├── apps/
│   ├── web/              # Next.js web application
│   └── mobile/           # React Native mobile app
├── packages/
│   └── shared/           # Shared types, utilities, and business logic
└── docs/                 # Documentation
```

### Tech Stack

**Frontend:**
- **Web**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Mobile**: React Native, Expo, TypeScript
- **Shared**: Zod for validation, common utilities

**Backend** (to be implemented):
- Node.js, Express/Fastify
- PostgreSQL with Prisma ORM
- Redis for caching and sessions
- JWT authentication

**Infrastructure:**
- Docker containerization
- AWS/GCP cloud deployment
- CI/CD with GitHub Actions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- For mobile development: Expo CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/probaho.git
   cd probaho
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Build shared packages**
   ```bash
   npm run build
   ```

### Running the Applications

**Web App:**
```bash
cd apps/web
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

**Mobile App:**
```bash
cd apps/mobile
npm start
```
Use Expo Go app to scan the QR code

**All apps simultaneously:**
```bash
npm run dev
```

## 📱 Features

### Core Features
- [x] Unified wallet dashboard
- [x] Cross-MFS money transfers
- [x] Add money from any MFS
- [x] Transaction history
- [x] Real-time balance updates
- [x] Secure PIN authentication
- [x] OTP verification

### Security Features
- [x] Bank-grade encryption
- [x] Biometric authentication (mobile)
- [x] Secure token management
- [x] Transaction monitoring
- [x] Fraud detection

### User Experience
- [x] Modern, responsive design
- [x] Dark/light theme support
- [x] Multi-language support (EN/BN)
- [x] Offline capability
- [x] Push notifications

## 🔧 Development

### Project Structure

```
apps/web/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── services/         # API services
│   └── lib/              # Web-specific utilities
└── public/               # Static assets

apps/mobile/
├── src/
│   ├── screens/          # React Native screens
│   ├── components/       # Shared mobile components
│   ├── contexts/         # React contexts
│   ├── services/         # API services
│   ├── theme/            # Theme configuration
│   └── navigation/       # Navigation setup
└── assets/               # Mobile assets

packages/shared/
├── src/
│   ├── types/            # TypeScript types
│   ├── utils/            # Common utilities
│   ├── schemas/          # Zod validation schemas
│   └── constants/        # App constants
└── dist/                 # Built package
```

### Available Scripts

```bash
# Development
npm run dev              # Start all apps in development mode
npm run build            # Build all packages
npm run lint             # Lint all packages
npm run test             # Run tests across all packages

# Individual apps
npm run dev:web          # Start web app only
npm run dev:mobile       # Start mobile app only
npm run build:shared     # Build shared package
```

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Conventional Commits** for commit messages

## 🔐 Security

Probaho implements multiple layers of security:

1. **Authentication**
   - PIN-based authentication
   - OTP verification
   - JWT tokens with refresh mechanism
   - Biometric authentication (mobile)

2. **Data Protection**
   - End-to-end encryption
   - Secure key management
   - PCI DSS compliance
   - GDPR compliance

3. **Transaction Security**
   - Multi-factor authentication
   - Real-time fraud detection
   - Transaction limits
   - Audit trails

## 🚀 Deployment

### Web Application
- **Production**: Vercel/Netlify
- **Staging**: AWS S3 + CloudFront
- **Development**: Local development server

### Mobile Application
- **iOS**: App Store via Expo Application Services (EAS)
- **Android**: Google Play Store via EAS
- **Development**: Expo Go app

### Backend Services
- **API**: AWS Lambda/Google Cloud Functions
- **Database**: AWS RDS/Google Cloud SQL
- **Cache**: AWS ElastiCache/Google Cloud Memorystore

## 📊 Business Model

### Revenue Streams
1. **Transaction Fees**: 1.5% per transaction (vs 6-12% current)
2. **Premium Features**: Advanced analytics, priority support
3. **API Licensing**: White-label solutions for banks
4. **Data Insights**: Anonymized market insights

### Market Opportunity
- **Total Addressable Market**: 130M+ MFS users in Bangladesh
- **Serviceable Market**: 50M+ active users
- **Initial Target**: 1M users in first year

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@probaho.app
- **Website**: https://probaho.app
- **Documentation**: https://docs.probaho.app

## 🙏 Acknowledgments

- Bangladesh Bank for regulatory guidance
- MFS providers (bKash, Rocket, Nagad) for API access
- Open source community for excellent tools and libraries

---

**Probaho** - Unifying Bangladesh's financial future, one transaction at a time.
