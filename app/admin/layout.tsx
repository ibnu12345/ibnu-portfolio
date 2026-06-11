'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Profile', href: '/admin/profile', icon: '👤' },
  { name: 'About', href: '/admin/about', icon: '📖' },
  { name: 'Research', href: '/admin/research', icon: '🔬' },
  { name: 'Portfolio', href: '/admin/portfolio', icon: '💼' },
  { name: 'Skills', href: '/admin/skills', icon: '⚡' },
  { name: 'Blog', href: '/admin/blog', icon: '✍️' },
  { name: 'Certificates', href: '/admin/certificates', icon: '📜' },
  { name: 'Gallery', href: '/admin/gallery', icon: '🖼️' },
  { name: 'Videos', href: '/admin/videos', icon: '🎥' },
  { name: 'Messages', href: '/admin/messages', icon: '💬' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Di mobile, sidebar default tertutup
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [isMobile])

  const handleLogout = () => {
    // Implement logout jika perlu
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      {/* Overlay untuk mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        width: sidebarOpen ? '260px' : '70px',
        height: '100vh',
        background: 'rgba(15,15,20,0.98)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        transition: 'width 0.3s ease',
        zIndex: 50,
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Logo & Toggle Button */}
        <div style={{
          padding: '20px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          {sidebarOpen && (
            <span style={{ fontWeight: 700, fontSize: '18px', color: 'white' }}>
              Admin<span style={{ color: '#818cf8' }}>Panel</span>
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '16px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, padding: '16px 8px' }}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                marginBottom: '4px',
                borderRadius: '10px',
                background: pathname === item.href ? 'rgba(79,70,229,0.15)' : 'transparent',
                color: pathname === item.href ? '#818cf8' : 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                transition: 'all 0.2s',
                fontSize: '14px',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '10px 12px',
              background: 'transparent',
              border: 'none',
              borderRadius: '10px',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: isMobile ? '20px' : '32px',
        overflowY: 'auto',
        marginLeft: isMobile && sidebarOpen ? '260px' : 0,
        transition: 'margin-left 0.3s ease',
      }}>
        {children}
      </main>
    </div>
  )
}