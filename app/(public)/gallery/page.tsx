'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>(['Semua'])
  const [active, setActive] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('gallery').select('*').order('sort_order', { ascending: true })
      .then(({ data }) => {
        const items = data || []
        setItems(items)
        setFiltered(items)
        const cats = ['Semua', ...Array.from(new Set(items.map((i: any) => i.category).filter(Boolean)))]
        setCategories(cats)
        setLoading(false)
      })
  }, [])

  function filter(cat: string) {
    setActive(cat)
    setFiltered(cat === 'Semua' ? items : items.filter(i => i.category === cat))
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px' }}>

        <div style={{ marginBottom: '48px' }}>
          <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Galeri</p>
          <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 16px' }}>Gallery</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.7 }}>
            Kumpulan foto dan dokumentasi kegiatan, penelitian, dan karya.
          </p>
        </div>

        {/* Filter */}
        {categories.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => filter(cat)} style={{
                background: active === cat ? '#4f46e5' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${active === cat ? '#4f46e5' : 'rgba(255,255,255,0.1)'}`,
                color: active === cat ? 'white' : 'rgba(255,255,255,0.5)',
                padding: '8px 18px', borderRadius: '999px', fontSize: '13px', cursor: 'pointer'
              }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading && <p style={{ color: 'rgba(255,255,255,0.3)' }}>Memuat...</p>}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🖼️</p>
            <p>Belum ada foto. Upload melalui Admin Panel.</p>
          </div>
        )}

        {/* Grid */}
        <div className="gallery-grid" style={{, gap: '12px' }}>
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
              onClick={() => setLightbox(item.image_url)}
              style={{
                breakInside: 'avoid', marginBottom: '12px',
                borderRadius: '12px', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer', position: 'relative', display: 'block'
              }}>
              <img
                src={item.image_url}
                alt={item.title || ''}
                style={{ width: '100%', display: 'block', transition: 'transform 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
              {item.title && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  padding: '20px 12px 10px', opacity: 0, transition: 'opacity 0.2s'
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
                  <p style={{ color: 'white', fontSize: '12px', margin: 0 }}>{item.title}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '40px', cursor: 'zoom-out'
          }}>
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute', top: '20px', right: '24px',
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', borderRadius: '50%', width: '40px', height: '40px',
              fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
            ✕
          </button>
          <img
            src={lightbox}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px', cursor: 'default' }}
          />
        </div>
      )}
    </div>
  )
}