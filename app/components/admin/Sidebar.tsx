'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '../../lib/auth'

const menus = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/profile', label: 'Profile', icon: '👤' },
  { href: '/admin/research', label: 'Research', icon: '📄' },
  { href: '/admin/portfolio', label: 'Portfolio', icon: '🎨' },
  { href: '/admin/skills', label: 'Skills', icon: '⚡' },
  { href: '/admin/blog', label: 'Blog', icon: '✍️' },
  { href: '/admin/certificates', label: 'Certificates', icon: '🏆' },
  { href: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { href: '/admin/videos', label: 'Videos', icon: '🎥' },
  { href: '/admin/messages', label: 'Messages', icon: '💬' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await signOut()
    router.push('/admin/login')
  }

  return (
    <div style={{ width: '240px', minHeight: '100vh', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <p style={{ fontWeight: 700, fontSize: '18px', color: 'white', margin: 0 }}>
          ibnusp<span style={{ color: '#818cf8' }}>_</span>
        </p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '4px' }}>Admin Panel</p>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {menus.map(menu => {
          const active = pathname === menu.href
          return (
            <Link key={menu.href} href={menu.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', marginBottom: '4px',
              textDecoration: 'none', fontSize: '13px',
              background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: active ? '#818cf8' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.15s',
            }}>
              <span>{menu.icon}</span>
              <span>{menu.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', marginBottom: '4px', textDecoration: 'none', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          <span>🌐</span><span>Lihat Website</span>
        </Link>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'rgba(239,68,68,0.7)' }}>
          <span>🚪</span><span>Logout</span>
        </button>
      </div>
    </div>
  )
}