import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

export const metadata: Metadata = {
  title: 'Muhamad Ibnu Setiawan Pratama',
  description: 'Educational Researcher | Arabic Language Researcher | Content Creator',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, background: '#0a0a0f', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        {children}
      </body>
    </html>
  )
}