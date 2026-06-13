'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

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
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: '48px' }}>
          <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Portfolio</p>
          <h1 className="h-page" style={{ margin: '0 0 16px' }}>Karya & Proyek</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.7 }}>
            Koleksi karya terbaik dalam bidang penelitian, desain, konten, dan public speaking.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <motion.button key={cat} onClick={() => filter(cat)} whileTap={{ scale: 0.95 }}
              style={{ background: active === cat ? '#4f46e5' : 'rgba(255,255,255,0.05)', border: `1px solid ${active === cat ? '#4f46e5' : 'rgba(255,255,255,0.1)'}`, color: active === cat ? 'white' : 'rgba(255,255,255,0.5)', padding: '8px 18px', borderRadius: '999px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}>
              {cat}
            </motion.button>
          ))}
        </div>

        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
            {[1,2,3].map(i => <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', height: '280px' }} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</p>
            <p>Belum ada portfolio.</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
            {filtered.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.07 }} whileHover={{ y: -4 }}>
                <Link href={`/portfolio/${item.slug || item.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.4)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'}>
                    <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                      {item.thumbnail_url
                        ? <img src={item.thumbnail_url} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'} alt={item.title} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🎨</div>
                      }
                      {item.category && (
                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '11px', padding: '4px 10px', borderRadius: '999px' }}>
                          {item.category}
                        </span>
                      )}
                      {/* Badge media type */}
                      <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '4px' }}>
                        {item.youtube_url && <span style={{ background: 'rgba(255,0,0,0.8)', color: 'white', fontSize: '10px', padding: '3px 7px', borderRadius: '999px' }}>▶ YT</span>}
                        {item.external_urls?.length > 0 && <span style={{ background: 'rgba(99,102,241,0.8)', color: 'white', fontSize: '10px', padding: '3px 7px', borderRadius: '999px' }}>🔗</span>}
                        {item.gallery_urls?.length > 0 && <span style={{ background: 'rgba(168,85,247,0.8)', color: 'white', fontSize: '10px', padding: '3px 7px', borderRadius: '999px' }}>🖼 {item.gallery_urls.length}</span>}
                      </div>
                    </div>
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ color: 'white', fontWeight: 600, fontSize: '15px', margin: '0 0 8px', lineHeight: 1.4 }}>{item.title}</h3>
                      {item.description && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 12px' }}>{item.description.slice(0, 90)}{item.description.length > 90 ? '...' : ''}</p>}
                      {item.tags?.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {item.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontSize: '11px', padding: '3px 8px', borderRadius: '999px' }}>{tag}</span>
                          ))}
                        </div>
                      )}
                      <div style={{ marginTop: '12px', color: '#818cf8', fontSize: '13px', fontWeight: 500 }}>Lihat Detail →</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}