# Probaho - Cross-MFS Unified Wallet

A unified wallet application that allows seamless money transfers between different Mobile Financial Services (MFS) in Bangladesh, including bKash, Nagad, Rocket, and Upay.

## 🚀 Features

- **Unified Wallet**: Consolidate all your MFS balances in one secure place
- **Instant Transfers**: Send money to any MFS in seconds
- **Bank-Grade Security**: Your funds are protected by partner bank custody
- **24/7 Available**: Access your money anytime, anywhere
- **Low Fees**: Save 80% compared to traditional cash-out methods
- **All MFS Support**: Works with bKash, Rocket, Nagad and more

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Custom Auth Context
- **State Management**: React Context API
- **Icons**: Heroicons

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd probaho-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the values in `.env.local`:
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   PAYMENT_SECRET=your-secure-secret-key
   NODE_ENV=development
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Demo Credentials

For testing purposes, use these demo credentials:

- **Phone**: 01712345678
- **PIN**: 1234

## 📱 Supported MFS Providers

- **bKash**: Minimum 10 BDT, Maximum 50,000 BDT
- **Nagad**: Minimum 10 BDT, Maximum 40,000 BDT  
- **Rocket**: Minimum 10 BDT, Maximum 30,000 BDT
- **Upay**: Minimum 10 BDT, Maximum 25,000 BDT

## 🏗️ Project Structure

```
probaho-web/
├── components/           # Reusable UI components
│   ├── WalletBalance.js
│   ├── QuickActions.js
│   └── RecentTransactions.js
├── app/                  # Next.js app directory
│   ├── page.tsx         # Home page
│   ├── layout.tsx       # Root layout
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   ├── add-money/       # Add money flow
│   ├── send-money/      # Send money page
│   └── api/             # API routes
├── images/              # Static images
│   └── mfs/            # MFS provider logos
├── .env.local          # Environment variables
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run export` - Export static files
- `npm run serve` - Serve static files

## 🔒 Security Features

- JWT-based authentication
- HMAC signature verification for payments
- Environment variable protection
- Secure API endpoints
- Input validation and sanitization

## 🌐 API Endpoints

- `POST /api/payment/create` - Create payment session
- `GET /api/payment/mock-gateway` - Mock payment gateway

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@probaho.com or join our Discord community.

## 🎯 Roadmap

- [ ] Real MFS API integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-currency support
- [ ] International transfers
- [ ] Business accounts
- [ ] API for third-party integrations

---

Made with ❤️ by the Probaho Team