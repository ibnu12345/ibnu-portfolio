import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Admin Panel',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: 0,
        background: '#0a0a0f',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  )
}