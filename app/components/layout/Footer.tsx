'use client'

import Link from 'next/link'

const links = [
  { href: '/about', label: 'About' },
  { href: '/research', label: 'Research' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/skills', label: 'Skills' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

const socials = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
]

export default function Footer() {
  return (
    <footer style={{
      background: '#0a0a0f',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '60px 64px 32px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Top row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr',
          gap: '48px', marginBottom: '48px'
        }}>

          {/* Brand */}
          <div>
            <p style={{ fontWeight: 700, fontSize: '20px', color: 'white', margin: '0 0 8px' }}>
              ibnusp<span style={{ color: '#818cf8' }}>_</span>
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', lineHeight: 1.7, maxWidth: '280px' }}>
              Educational Researcher & Arabic Language Researcher yang berfokus pada inovasi media pembelajaran Islam.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Navigasi
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {links.map(link => (
                <Link key={link.href} href={link.href} style={{
                  color: 'rgba(255,255,255,0.35)', fontSize: '13px',
                  textDecoration: 'none',
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Social Media
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                  color: 'rgba(255,255,255,0.35)', fontSize: '13px',
                  textDecoration: 'none',
                }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom row */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', margin: 0 }}>
            © {new Date().getFullYear()} Muhamad Ibnu Setiawan Pratama. All rights reserved.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', margin: 0 }}>
            Built with Next.js & Supabase
          </p>
        </div>

      </div>
    </footer>
  )
}