import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Probaho - Cross-MFS Unified Wallet',
  description: 'Your Money, Your Control. Unified wallet for seamless cross-MFS transfers in Bangladesh.',
  keywords: 'mobile financial services, bKash, Rocket, Nagad, digital wallet, Bangladesh fintech',
  authors: [{ name: 'Probaho Team' }],
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Probaho - Cross-MFS Unified Wallet',
    description: 'Your Money, Your Control. Unified wallet for seamless cross-MFS transfers in Bangladesh.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Probaho - Cross-MFS Unified Wallet',
    description: 'Your Money, Your Control. Unified wallet for seamless cross-MFS transfers in Bangladesh.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
            {children}
          </div>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
