import type { Metadata, Viewport } from 'next'
import { Press_Start_2P, VT323 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/context/AuthContext';
import './globals.css'

const pressStart2P = Press_Start_2P({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-pixel'
});

const vt323 = VT323({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-pixel-body'
});

export const metadata: Metadata = {
  title: 'PulsePlay - Match Your Heartbeat to Music',
  description: 'Discover songs that sync with your rhythm. Enter your heart rate and find the perfect music for your pulse.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/pixel-heart.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/pixel-heart.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${pressStart2P.variable} ${vt323.variable} antialiased`}>
        <AuthProvider>
        {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
