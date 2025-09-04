import './globals.css'
import { Inter } from 'next/font/google'
import { MSALProvider } from '@/lib/auth/MSALProvider'
import { ToastProvider } from '@/components/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Error Club',
  description: 'Write. Review. Publish.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MSALProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </MSALProvider>
      </body>
    </html>
  )
}
