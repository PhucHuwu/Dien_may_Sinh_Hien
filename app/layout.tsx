import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/contexts/CartContext'
import { SessionProvider } from '@/components/SessionProvider'
import { GoogleRegistrationChecker } from '@/components/google-registration-checker'
import { Toaster } from 'sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Điện Máy Sinh Hiền - Mua sắm Thiết bị Điện tử',
  description: 'Cửa hàng bán thiết bị điện tử chất lượng cao với giá tốt nhất',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`font-sans antialiased`}>
        <SessionProvider>
          <GoogleRegistrationChecker>
            <CartProvider>
              {children}
              <Toaster position="top-right" richColors />
            </CartProvider>
          </GoogleRegistrationChecker>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
