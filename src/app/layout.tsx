
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/context/auth-context'
import { FavoritesProvider } from '@/context/favorites-context'
import { InstallPrompt } from '@/components/pwa/install-prompt'
import { NetworkStatus } from '@/components/pwa/network-status'
import { PWAInfo } from '@/components/pwa/pwa-info'
import { PWADebug } from '@/components/pwa/pwa-debug'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FixMyEvent - Premium Venue Booking',
  description: 'Discover and book the perfect venues for your events. Professional, elegant, and hassle-free.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/images/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/images/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/images/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
    ],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <FavoritesProvider>
              <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                {children}
              </div>
              <Toaster />
              <InstallPrompt />
              <NetworkStatus />
              <PWAInfo />
              <PWADebug />
            </FavoritesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
