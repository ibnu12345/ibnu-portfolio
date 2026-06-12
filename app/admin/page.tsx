'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ research: 0, portfolio: 0, blog: 0, messages: 0 })

  useEffect(() => {
    checkAuth()
    loadStats()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin/login')
    else setLoading(false)
  }

  async function loadStats() {
    const [r, p, b, m] = await Promise.all([
      supabase.from('research').select('id', { count: 'exact', head: true }),
      supabase.from('portfolio').select('id', { count: 'exact', head: true }),
      supabase.from('blog_post').select('id', { count: 'exact', head: true }),
      supabase.from('contact_message').select('id', { count: 'exact', head: true }).eq('is_read', false),
    ])
    setStats({ research: r.count || 0, portfolio: p.count || 0, blog: b.count || 0, messages: m.count || 0 })
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: 'white' }}>
      Loading...
    </div>
  )

  const cards = [
    { label: 'Research', value: stats.research, icon: '📄', href: '/admin/research', color: '#818cf8' },
    { label: 'Portfolio', value: stats.portfolio, icon: '🎨', href: '/admin/portfolio', color: '#a78bfa' },
    { label: 'Blog Posts', value: stats.blog, icon: '✍️', href: '/admin/blog', color: '#34d399' },
    { label: 'Pesan Baru', value: stats.messages, icon: '💬', href: '/admin/messages', color: '#f59e0b' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'white', margin: 0 }}>Dashboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontSize: '14px' }}>Selamat datang di Admin Panel ibnusp_</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))', gap: '16px', marginBottom: '40px' }}>
        {cards.map(card => (
          <a key={card.label} href={card.href} style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', display: 'block', transition: 'border-color 0.2s' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>{card.icon}</div>
            <p style={{ fontSize: '32px', fontWeight: 700, color: card.color, margin: '0 0 4px' }}>{card.value}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>{card.label}</p>
          </a>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '16px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { label: '+ Tambah Research', href: '/admin/research' },
            { label: '+ Tambah Portfolio', href: '/admin/portfolio' },
            { label: '+ Tulis Blog', href: '/admin/blog' },
            { label: '+ Upload Sertifikat', href: '/admin/certificates' },
          ].map(a => (
            <a key={a.label} href={a.href} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none' }}>
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}