'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Profile', href: '/admin/profile', icon: '👤' },
  { name: 'About (Edu & Org)', href: '/admin/about', icon: '📖' },
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setSidebarOpen(!mobile) // desktop: open by default, mobile: closed
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>

      {/* Overlay mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        top: 0,
        left: isMobile ? (sidebarOpen ? 0 : '-260px') : 0,
        width: isMobile ? '260px' : (sidebarOpen ? '220px' : '64px'),
        height: '100vh',
        background: 'rgba(15,15,20,0.98)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        transition: 'left 0.3s ease, width 0.3s ease',
        zIndex: 50,
        overflowX: 'hidden',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Logo & Toggle */}
        <div style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          minHeight: '60px',
        }}>
          {(sidebarOpen || isMobile) && (
            <span style={{ fontWeight: 700, fontSize: '16px', color: 'white', whiteSpace: 'nowrap' }}>
              Admin<span style={{ color: '#818cf8' }}>Panel</span>
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '14px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: 'auto',
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setSidebarOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                marginBottom: '2px',
                borderRadius: '10px',
                background: pathname === item.href ? 'rgba(79,70,229,0.2)' : 'transparent',
                color: pathname === item.href ? '#818cf8' : 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
              {(sidebarOpen || isMobile) && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom links */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <Link
            href="/"
            onClick={() => isMobile && setSidebarOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '10px',
              color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
              fontSize: '13px', whiteSpace: 'nowrap', marginBottom: '2px',
            }}
          >
            <span style={{ fontSize: '18px', flexShrink: 0 }}>🌐</span>
            {(sidebarOpen || isMobile) && <span>Lihat Website</span>}
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '10px 12px',
              background: 'transparent', border: 'none', borderRadius: '10px',
              color: '#f87171', cursor: 'pointer', fontSize: '13px',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '18px', flexShrink: 0 }}>🚪</span>
            {(sidebarOpen || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content — margin kiri mengikuti lebar sidebar (desktop only) */}
      <main style={{
        flex: 1,
        marginLeft: isMobile ? 0 : (sidebarOpen ? '220px' : '64px'),
        transition: 'margin-left 0.3s ease',
        padding: isMobile ? '16px' : '32px',
        overflowY: 'auto',
        minWidth: 0,
      }}>
        {/* Mobile top bar */}
        {isMobile && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '20px', padding: '10px 0',
          }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', padding: '8px 10px',
                color: 'white', cursor: 'pointer', fontSize: '16px',
              }}
            >
              ☰
            </button>
            <span style={{ fontWeight: 700, color: 'white', fontSize: '16px' }}>
              Admin<span style={{ color: '#818cf8' }}>Panel</span>
            </span>
          </div>
        )}
        {children}
      </main>
    </div>
  )
}