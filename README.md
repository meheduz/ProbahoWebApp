# Probaho - Digital Wallet with MFS Integration

**Tagline:** Your Money, Your Control

Probaho is a digital wallet prototype that explores unified access to Bangladesh's Mobile Financial Services (MFS) ecosystem. This demonstration project showcases how multiple MFS providers could be integrated into a single platform for simplified transactions.

---

## Overview

This is a **prototype/demonstration project** that explores the concept of a unified digital wallet for Bangladesh's MFS ecosystem. It demonstrates technical feasibility and user experience design for cross-platform MFS integration.

### The Concept

- **Problem**: Multiple MFS providers (bKash, Rocket, Nagad, Upay) operate independently without direct interoperability
- **Solution**: A unified interface that could facilitate transactions across different MFS platforms
- **Status**: Prototype/demonstration - not a production financial service

---

## Features

### Digital Wallet Management
- Real-time wallet balance tracking
- Transaction history with detailed logs
- Secure PIN-based authentication
- Multi-currency support (focused on BDT)

### MFS Integration (Concept)
- Demonstration of integration patterns for:
  - bKash
  - Nagad
  - Rocket
  - Upay

### Money Transfer Features
- Send money interface (demo)
- Add money from MFS accounts (demo)
- Transaction status tracking
- Transaction fee calculation
- Daily transaction limit enforcement

### Security Features
- PIN-protected transactions
- OTP verification flow
- Session management
- Transaction monitoring interface

### User Experience
- Modern, responsive design
- Dark/light theme support
- Multi-language support (English/বাংলা)
- Intuitive navigation

---

## Architecture

This project uses a monorepo structure with shared code between web and mobile applications:

```
probaho/
├── apps/
│   ├── web/              # Next.js web application
│   │   ├── src/
│   │   │   ├── app/      # App router pages
│   │   │   ├── components/
│   │   │   ├── contexts/
│   │   │   ├── services/
│   │   │   └── lib/
│   │   └── public/
│   └── mobile/           # React Native mobile app
│       ├── src/
│       │   ├── screens/
│       │   ├── components/
│       │   ├── contexts/
│       │   ├── services/
│       │   ├── theme/
│       │   └── navigation/
│       └── assets/
└── packages/
    └── shared/           # Shared utilities and types
        ├── types/
        ├── utils/
        ├── schemas/
        └── constants/
```

---

## Tech Stack

### Frontend
**Web:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Query

**Mobile:**
- React Native
- Expo
- TypeScript
- Native Base

**Shared:**
- Turborepo for monorepo management
- Zod for validation
- Shared component library

### Backend (Planned)
- Node.js with Express/Fastify
- PostgreSQL with Prisma ORM
- Redis for caching and sessions
- JWT authentication

### Infrastructure
- Docker containerization
- CI/CD with GitHub Actions
- Cloud deployment ready (AWS/GCP/Azure)

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- For mobile development: Expo CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/meheduz/ProbahoWebApp.git
   cd ProbahoWebApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file in apps/web directory
   cp .env.example .env.local
   ```

   Example `.env.local`:
   ```env
   NEXT_PUBLIC_BASE_PATH=/ProbahoWebApp
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Build shared packages**
   ```bash
   npm run build
   ```

### Running the Applications

**Web Application:**
```bash
cd apps/web
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser

**Mobile Application:**
```bash
cd apps/mobile
npm start
```
Scan the QR code with Expo Go app on your mobile device

**Run all apps simultaneously:**
```bash
npm run dev
```

---

## Transaction Specifications (Demo)

*Note: These are demonstration specifications for the prototype interface*

### Add Money Limits (Proposed)

| MFS Provider | Per Transaction | Daily Limit |
|--------------|----------------|-------------|
| **bKash**    | ৳50,000       | ৳100,000    |
| **Nagad**    | ৳40,000       | ৳80,000     |
| **Rocket**   | ৳30,000       | ৳60,000     |
| **Upay**     | ৳25,000       | ৳50,000     |

### Send Money

- **Minimum**: ৳10 per transaction
- **Maximum**: ৳100,000 per transaction
- **Fee**: Fixed ৳20 per transaction (demonstration pricing)

---

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start all apps in development mode
npm run build            # Build all packages
npm run lint             # Lint all packages
npm run test             # Run tests across all packages
npm run type-check       # TypeScript type checking

# Individual apps
npm run dev:web          # Start web app only
npm run dev:mobile       # Start mobile app only
npm run build:shared     # Build shared package
npm run clean            # Clean all build artifacts
```

### Code Style & Standards

This project follows:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Conventional Commits** for commit messages

Example commit:
```bash
git commit -m "feat(wallet): add transaction history filter"
git commit -m "fix(auth): resolve PIN validation issue"
git commit -m "docs(readme): update installation steps"
```

---

## Security Implementation

This prototype demonstrates security best practices:

### Authentication & Authorization
- 4-digit PIN authentication
- OTP verification via SMS (simulated)
- JWT tokens with refresh mechanism
- Session management with timeout

### Data Protection
- HTTPS/TLS for API communications
- Secure password hashing (bcrypt)
- Environment variable protection
- Secure credential storage

### Transaction Security
- PIN verification for transactions
- OTP verification for sensitive operations
- Transaction limits enforcement
- Audit trail logging

### API Security
- Rate limiting
- Request validation
- CORS policies
- Input sanitization

---

## Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- wallet.test.ts

# Watch mode
npm run test:watch
```

---

## Deployment

### Web Application

**Development**: Local development server  
**Production Build**:
```bash
cd apps/web
npm run build
npm run start
```

**Hosting Options**: Vercel, Netlify, or custom Node.js hosting

### Mobile Application

**Development**: Expo Go app  
**Production Build**:
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

## Contributing

Contributions are welcome! This project is open for improvements and feature additions.

### Development Workflow

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
   - Follow the code style guidelines
   - Add tests if applicable
   - Update documentation
4. Commit your changes
   ```bash
   git commit -m "feat: add your feature"
   ```
5. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a Pull Request

### Contribution Guidelines

- Write clear, descriptive commit messages
- Follow TypeScript best practices
- Maintain consistent code formatting
- Update tests and documentation
- Be respectful in discussions

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact & Support

- **Project Repository**: [GitHub - meheduz/ProbahoWebApp](https://github.com/meheduz/ProbahoWebApp)
- **Issues & Suggestions**: [GitHub Issues](https://github.com/meheduz/ProbahoWebApp/issues)
- **Developer**: [@meheduz](https://github.com/meheduz)

---

## Acknowledgments

- Open source community for excellent tools and libraries
- MFS providers for inspiration in building better financial services
- All contributors who help improve this project

---

## Important Disclaimer

**This is a demonstration/prototype project created for educational and portfolio purposes.**

### What This Project IS:
- A technical demonstration of unified MFS wallet concepts  
- A showcase of modern web and mobile development practices  
- An exploration of user experience design for fintech  
- Open source and available for learning  

### What This Project IS NOT:
- A production-ready financial service  
- Licensed or authorized by any regulatory body  
- Connected to real MFS provider APIs  
- Handling actual financial transactions  
- Endorsed by any MFS provider or financial institution  

### For Production Implementation:

Any real-world implementation of this concept would require:

1. **Regulatory Compliance**
   - Bangladesh Bank licensing and approval
   - Financial service regulations compliance
   - Anti-money laundering (AML) compliance
   - Know Your Customer (KYC) procedures

2. **Official Partnerships**
   - Formal agreements with MFS providers
   - API access and integration permissions
   - Legal contracts and SLAs
   - Technical support arrangements

3. **Security & Infrastructure**
   - Professional security audit
   - PCI DSS compliance certification
   - Penetration testing
   - Production-grade infrastructure
   - 24/7 monitoring and support

4. **Legal & Financial**
   - Financial backing and capital
   - Insurance coverage
   - Legal team and compliance officers
   - Customer support infrastructure

---

## Development Roadmap

### Current Phase - Prototype
- [x] Core wallet interface design
- [x] MFS integration concept demonstration
- [x] Web application (Next.js)
- [x] Mobile application (React Native)
- [x] Basic security patterns
- [ ] Backend API implementation
- [ ] Database integration
- [ ] Comprehensive testing

### Future Enhancements
- [ ] Advanced transaction filtering
- [ ] Export transaction history
- [ ] Multiple wallet support
- [ ] Recurring payments interface
- [ ] Budget tracking features
- [ ] Enhanced analytics dashboard

*This roadmap represents the technical development vision for the prototype. It does not imply plans for production deployment.*

---

**Probaho** - A prototype exploring unified digital wallet concepts for Bangladesh.

Made with care as a demonstration project

*Last updated: October 2024*
