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
  { href: '/gallery', label: 'Gallery' },
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

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s',
        background: scrolled || menuOpen ? 'rgba(10,10,15,0.95)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 24px', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <span style={{ fontWeight: 700, fontSize: '18px', color: 'white' }}>
              ibnusp<span style={{ color: '#818cf8' }}>_</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{
                textDecoration: 'none', fontSize: '13px',
                color: pathname === link.href ? 'white' : 'rgba(255,255,255,0.5)',
                fontWeight: pathname === link.href ? 500 : 400,
                transition: 'color 0.2s',
              }}>
                {link.label}
              </Link>
            ))}
            <Link href="/contact" style={{
              background: '#4f46e5', color: 'white', fontSize: '13px',
              fontWeight: 500, padding: '8px 20px', borderRadius: '999px',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              Hire Me
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none', background: 'transparent', border: 'none',
              color: 'white', cursor: 'pointer', padding: '8px', flexDirection: 'column',
              gap: '5px', alignItems: 'center', justifyContent: 'center',
            }}
            className="show-mobile-flex"
          >
            <span style={{ width: '22px', height: '2px', background: 'white', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ width: '22px', height: '2px', background: 'white', display: 'block', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: '22px', height: '2px', background: 'white', display: 'block', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            background: 'rgba(10,10,15,0.98)', borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: '16px 24px 24px',
          }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                display: 'block', padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                color: pathname === link.href ? 'white' : 'rgba(255,255,255,0.5)',
                textDecoration: 'none', fontSize: '15px',
                fontWeight: pathname === link.href ? 500 : 400,
              }}>
                {link.label}
              </Link>
            ))}
            <Link href="/contact" style={{
              display: 'block', marginTop: '16px', background: '#4f46e5', color: 'white',
              textAlign: 'center', padding: '12px', borderRadius: '10px',
              textDecoration: 'none', fontSize: '14px', fontWeight: 500,
            }}>
              Hire Me
            </Link>
          </div>
        )}
      </nav>

      {/* Mobile-only CSS injected via style tag */}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile-flex { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile-flex { display: none !important; }
        }
      `}</style>
    </>
  )
}