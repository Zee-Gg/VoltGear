import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VoltGear — Tech Accessories',
  description: 'Premium tech accessories for everyone'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar/>
            <main className="min-h-screen relative overflow-hidden">
              <div className="ambient-glow top-0 left-1/4"></div>
              <div className="ambient-glow bottom-0 right-1/4" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(15,23,42,0) 70%)' }}></div>
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}