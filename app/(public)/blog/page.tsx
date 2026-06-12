'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'

export default function BlogPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('blog_post').select('*').eq('is_published', true).order('published_date', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [])

  const filtered = items.filter(i => i.title?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <div className="page-container">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ marginBottom: '40px' }}>
          <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 500, marginBottom: '10px' }}>Blog</p>
          <h1 className="h-page" style={{ margin: '0 0 14px' }}>Artikel & Tulisan</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', maxWidth: '520px', lineHeight: 1.7 }}>
            Pemikiran, riset, dan pengalaman dalam dunia pendidikan dan penelitian.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ marginBottom: '40px' }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Cari artikel..."
            style={{ width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </motion.div>

        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', height: '300px' }} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>✍️</p>
            <p style={{ fontSize: '16px' }}>Belum ada artikel yang dipublikasikan.</p>
          </motion.div>
        )}

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Link href={`/blog/${item.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px', overflow: 'hidden',
                  transition: 'border-color 0.2s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.4)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'}
                >
                  {item.thumbnail_url ? (
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                      <img src={item.thumbnail_url} alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                      />
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '160px', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                      ✍️
                    </div>
                  )}

                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      {item.category && (
                        <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontSize: '11px', padding: '3px 10px', borderRadius: '999px', fontWeight: 500 }}>
                          {item.category}
                        </span>
                      )}
                      {item.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: '11px', padding: '3px 10px', borderRadius: '999px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 style={{ color: 'white', fontWeight: 600, fontSize: '16px', margin: '0 0 10px', lineHeight: 1.4 }}>
                      {item.title}
                    </h3>

                    {item.excerpt || item.content ? (
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 16px' }}>
                        {(item.excerpt || item.content).slice(0, 110)}...
                      </p>
                    ) : null}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>
                        {item.published_date ? new Date(item.published_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                      </span>
                      <span style={{ color: '#818cf8', fontSize: '13px', fontWeight: 500 }}>Baca →</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}