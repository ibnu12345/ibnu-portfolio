'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const categories = ['Semua', 'Research', 'Design', 'Content Creation', 'Public Speaking', 'Organization']

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [active, setActive] = useState('Semua')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('portfolio').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data || []); setFiltered(data || []); setLoading(false) })
  }, [])

  function filter(cat: string) {
    setActive(cat)
    setFiltered(cat === 'Semua' ? items : items.filter(i => i.category === cat))
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 64px 80px' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Portfolio</p>
          <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 16px' }}>Karya & Proyek</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.7 }}>
            Koleksi karya terbaik dalam bidang penelitian, desain, konten, dan public speaking.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => filter(cat)} style={{ background: active === cat ? '#4f46e5' : 'rgba(255,255,255,0.05)', border: `1px solid ${active === cat ? '#4f46e5' : 'rgba(255,255,255,0.1)'}`, color: active === cat ? 'white' : 'rgba(255,255,255,0.5)', padding: '8px 18px', borderRadius: '999px', fontSize: '13px', cursor: 'pointer' }}>
              {cat}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: 'rgba(255,255,255,0.3)' }}>Memuat...</p>}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</p>
            <p>Belum ada portfolio. Tambahkan melalui Admin Panel.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
              <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                {item.thumbnail_url
                  ? <img src={item.thumbnail_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🎨</div>
                }
                {item.category && (
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '11px', padding: '4px 10px', borderRadius: '999px' }}>
                    {item.category}
                  </span>
                )}
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ color: 'white', fontWeight: 600, fontSize: '16px', margin: '0 0 8px' }}>{item.title}</h3>
                {item.description && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 16px' }}>{item.description.slice(0, 100)}{item.description.length > 100 ? '...' : ''}</p>}
                {item.tags && item.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {item.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontSize: '11px', padding: '3px 8px', borderRadius: '999px' }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}