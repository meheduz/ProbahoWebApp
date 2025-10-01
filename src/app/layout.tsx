import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Probaho - Cross-MFS Unified Wallet',
  description: 'Your Money, Your Control. Unified wallet for seamless cross-MFS transfers in Bangladesh.',
  keywords: 'mobile financial services, bKash, Rocket, Nagad, digital wallet, Bangladesh fintech',
  authors: [{ name: 'Probaho Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563eb',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
          <AuthProvider>
            <main className="flex-1">{children}</main>
          </AuthProvider>

          <footer className="w-full py-2 bg-transparent text-center text-sm text-gray-500 border-t border-gray-100">
            Developed by Md. Meeheduz Zaman, Student of Dept. CSE, SUST
          </footer>
        </div>
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
      </body>
    </html>
  )
}
