'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '../../lib/auth'

const menus = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/profile', label: 'Profile', icon: '👤' },
  { href: '/admin/about', label: 'About (Edu & Org)', icon: '🎓' },
  { href: '/admin/research', label: 'Research', icon: '🔬' },
  { href: '/admin/portfolio', label: 'Portfolio', icon: '💼' },
  { href: '/admin/skills', label: 'Skills', icon: '⚡' },
  { href: '/admin/blog', label: 'Blog', icon: '✍️' },
  { href: '/admin/certificates', label: 'Certificates', icon: '🏆' },
  { href: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { href: '/admin/videos', label: 'Videos', icon: '🎬' },
  { href: '/admin/messages', label: 'Messages', icon: '💬' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await signOut()
    router.push('/admin/login')
  }

  const currentPage = menus.find(m => m.href === pathname)?.label || 'Admin'

  const sidebarContent = (isMobileDrawer = false) => (
    <div style={{
      width: isMobileDrawer ? '260px' : '220px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#0d0d14',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: '16px', color: 'white', margin: 0 }}>
            <span style={{ color: 'white' }}>Admin</span>
            <span style={{ color: '#818cf8' }}>Panel</span>
          </p>
        </div>
        {isMobileDrawer && (
          <button onClick={() => setOpen(false)} style={{
            background: 'rgba(255,255,255,0.08)', border: 'none',
            borderRadius: '8px', color: 'white', cursor: 'pointer',
            width: '32px', height: '32px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '16px',
          }}>◄</button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
        {menus.map(menu => {
          const active = pathname === menu.href
          return (
            <Link key={menu.href} href={menu.href} onClick={() => setOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '10px', marginBottom: '2px',
              textDecoration: 'none', fontSize: '13px',
              background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
              color: active ? '#818cf8' : 'rgba(255,255,255,0.55)',
              fontWeight: active ? 600 : 400,
              transition: 'background 0.15s, color 0.15s',
            }}>
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{menu.icon}</span>
              <span>{menu.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 12px', borderRadius: '10px', marginBottom: '2px',
          textDecoration: 'none', fontSize: '13px', color: 'rgba(255,255,255,0.4)',
        }}>
          <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>🌐</span>
          <span>Lihat Website</span>
        </Link>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 12px', borderRadius: '10px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontSize: '13px', color: 'rgba(239,68,68,0.7)',
        }}>
          <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        .sidebar-desktop-wrap {
          min-height: 100vh;
          border-right: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
        }
        .sidebar-mobile-topbar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #0d0d14;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: sticky;
          top: 0;
          z-index: 40;
          width: 100%;
        }
        @media (max-width: 768px) {
          .sidebar-desktop-wrap { display: none; }
          .sidebar-mobile-topbar { display: flex; }
        }
        @media (min-width: 769px) {
          .sidebar-mobile-topbar { display: none; }
        }
      `}</style>

      {/* Desktop */}
      <div className="sidebar-desktop-wrap">
        {sidebarContent(false)}
      </div>

      {/* Mobile topbar */}
      <div className="sidebar-mobile-topbar">
        <p style={{ fontWeight: 700, fontSize: '15px', color: 'white', margin: 0 }}>
          <span>Admin</span><span style={{ color: '#818cf8' }}>Panel</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', fontWeight: 400, marginLeft: '8px' }}>
            {currentPage}
          </span>
        </p>
        <button onClick={() => setOpen(true)} style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px', color: 'white', cursor: 'pointer',
          padding: '7px 12px', display: 'flex', alignItems: 'center',
          gap: '6px', fontSize: '13px',
        }}>
          ☰ Menu
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          {/* Overlay */}
          <div onClick={() => setOpen(false)} style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 50,
            backdropFilter: 'blur(2px)',
          }} />
          {/* Drawer */}
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0,
            zIndex: 60,
            boxShadow: '4px 0 24px rgba(0,0,0,0.5)',
            overflowY: 'auto',
          }}>
            {sidebarContent(true)}
          </div>
        </>
      )}
    </>
  )
}