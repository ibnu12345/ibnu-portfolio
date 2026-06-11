'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '../../lib/auth'
import {
  LayoutDashboard, User, FileText, Briefcase, Zap,
  PenSquare, Award, Image, Video, MessageSquare,
  Globe, LogOut, GraduationCap
} from 'lucide-react'

const menus = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/about', label: 'About (Edu & Org)', icon: GraduationCap },
  { href: '/admin/research', label: 'Research', icon: FileText },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/admin/skills', label: 'Skills', icon: Zap },
  { href: '/admin/blog', label: 'Blog', icon: PenSquare },
  { href: '/admin/certificates', label: 'Certificates', icon: Award },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/videos', label: 'Videos', icon: Video },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await signOut()
    router.push('/admin/login')
  }

  return (
    <div className="admin-sidebar">
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <p style={{ fontWeight: 700, fontSize: '18px', color: 'white', margin: 0 }}>
          ibnusp<span style={{ color: '#818cf8' }}>_</span>
        </p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '4px' }}>Admin Panel</p>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {menus.map(menu => {
          const active = pathname === menu.href
          const Icon = menu.icon
          return (
            <Link key={menu.href} href={menu.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: '8px', marginBottom: '2px',
              textDecoration: 'none', fontSize: '13px',
              background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: active ? '#818cf8' : 'rgba(255,255,255,0.5)',
            }}>
              <Icon size={16} />
              <span>{menu.label}</span>
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '9px 12px', borderRadius: '8px', marginBottom: '2px',
          textDecoration: 'none', fontSize: '13px', color: 'rgba(255,255,255,0.4)'
        }}>
          <Globe size={16} />
          <span>Lihat Website</span>
        </Link>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '9px 12px', borderRadius: '8px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontSize: '13px', color: 'rgba(239,68,68,0.7)'
        }}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}