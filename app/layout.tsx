import './globals.css'
import { Inter } from 'next/font/google'
import StableMSALProvider from '@/lib/auth/StableMSALProvider'
import { ToastProvider } from '@/components/ToastProvider'
import SiteHeader from '@/components/SiteHeader'
import ApiDebugPanel from '@/components/ApiDebugPanel'
import '@/lib/utils/apiMonitor' // Initialize API monitoring

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Code Chronicle',
  description: 'A community platform for writers, readers, and content creators to share stories and inspire each other.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StableMSALProvider>
          <ToastProvider>
            <SiteHeader />
            {children}
            <ApiDebugPanel />
          </ToastProvider>
        </StableMSALProvider>
      </body>
    </html>
  )
}
