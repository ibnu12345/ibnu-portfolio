'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/research', label: 'Research' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/skills', label: 'Skills' },
  { href: '/blog', label: 'Blog' },
  { href: '/videos', label: 'Videos' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'all 0.3s',
      background: scrolled ? 'rgba(10,10,15,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '0 64px', height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontWeight: 700, fontSize: '18px', color: 'white' }}>
            ibnusp<span style={{ color: '#818cf8' }}>_</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={{
              textDecoration: 'none', fontSize: '14px',
              color: pathname === link.href ? 'white' : 'rgba(255,255,255,0.5)',
              fontWeight: pathname === link.href ? 500 : 400,
              transition: 'color 0.2s',
            }}>
              {link.label}
            </Link>
          ))}

          {/* Hire Me */}
          <Link href="/contact" style={{
            background: '#4f46e5',
            color: 'white',
            fontSize: '13px',
            fontWeight: 500,
            padding: '8px 20px',
            borderRadius: '999px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'background 0.2s',
          }}>
            Hire Me
          </Link>
        </div>

      </div>
    </nav>
  )
}